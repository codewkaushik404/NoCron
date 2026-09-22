
type Node = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
};

type Edge = {
  id: string;
  source: string;
  dest: string;
  sourceHandle: string | null;
};

type Workflow = {
  node_config: {
    nodes: Node[];
    edges: Edge[];
  };
};

const nodeMap = new Map<string, Node>();
const outgoingEdges = new Map<string, Edge[]>();
const States: Record<string, any> = {};

const operatorMap = new Map<String, String>();
operatorMap.set("equals", "=");
operatorMap.set("notEquals", "!=");
operatorMap.set("greaterThan", ">");
operatorMap.set("lessThan", "<");


function getNextNode(nodeId: string) {
    const nodeEdges: Edge[] = outgoingEdges.get(nodeId) ?? [];

    if (nodeEdges.length === 0) return null;
    return nodeEdges[0]!.dest;
}

export function buildStateMachineDefinition(workflow: Workflow) {
    const { nodes, edges } = workflow.node_config;

    const triggerTypes = [
        "webhookTrigger",
        "tallyTrigger",
        "scheduleTrigger",
    ];

    //Find the starting trigger
    const startNode = nodes.find((node) => triggerTypes.includes(node.type));

    if (!startNode) {
        throw new Error("No trigger node found");
    }

    for (const node of nodes) {
        nodeMap.set(node.id, node);
    }

    for (const edge of edges) {
        const existing = outgoingEdges.get(edge.source) ?? [];
        existing.push(edge);
        outgoingEdges.set(edge.source, existing);
    }
    
    for (const node of nodes) {
        const nodeEdges = outgoingEdges.get(node.id) ?? [];

        //Trigger Node
        if (triggerTypes.includes(node.type)) {
        const nextNode = getNextNode(node.id);

        if (!nextNode) {
            throw new Error( `Trigger node ${node.id} has no outgoing edge`);
        }

        States[node.id] = {
            Type: "Pass",
            Next: nextNode,
        };

        continue;
        }

        //Branch Node
        if (node.type === "branch") {
            
            const trueEdge = nodeEdges.find((edge) => edge.sourceHandle === "true");
            const falseEdge = nodeEdges.find((edge) => edge.sourceHandle === "false");

            if (!trueEdge) throw new Error(`Branch ${node.id} has no true edge`);
            if (!falseEdge) throw new Error(`Branch ${node.id} has no false edge`);

            const variable = node.data.variable;
            const operator = node.data.operator;
            const value = node.data.value;

            if (!variable) throw new Error(`Branch ${node.id} has no variable`);
            if (!operator) throw new Error(`Branch ${node.id} has no operator`);
            
            const condition = 
            `{% $states.input.data.fields[key = '${variable}'][0].value ${operatorMap.get(operator)} '${value}' %}`;

            States[node.id] = {
                Type: "Choice",

                Choices: [
                    {
                        Condition: condition,
                        Next: trueEdge.dest,
                    }
                ],

                Default: falseEdge.dest,
            };

            continue;
        }

        if (node.type === "wait") {
            
            const nextNode = getNextNode(node.id);

            const state: Record<string, any> = {
                Type: "Wait",
                Seconds: Number(node.data.seconds ?? 60),
            };

            if (nextNode) state.Next = nextNode;
            else state.End = true;

            States[node.id] = state;

            continue;
        }

        //send Email Node
        if (node.type === "sendEmail") {
            
            const nextNode = getNextNode(node.id);

            const state: Record<string, any> = {
                Type: "Task",
                Resource: "arn:aws:states:::aws-sdk:sesv2:sendEmail",

                Arguments: {
                    FromEmailAddress: process.env.SES_FROM_EMAIL,
                    Destination: {
                        ToAddresses: [
                            node.data.recipient,
                        ],
                    },

                    Content: {
                        Simple: {
                            Subject: {
                                Data: node.data.subject ?? "GOOD MORNING",
                            },

                            Body: {
                                Text: {
                                Data: node.data.body ?? "Have a great day!",
                                },
                            },
                        },
                    },
                },
            };

            if (nextNode) state.Next = nextNode;
            else state.End = true;

            States[node.id] = state;

            continue;
        }

        //doNothing Node
        if (node.type === "doNothing") {
            States[node.id] = {
                Type: "Succeed",
            };

            continue;
        }

        throw new Error(`Unsupported node type: ${node.type}`);
    }

    return {
        Comment: "NoCron workflow",
        QueryLanguage: "JSONata",
        StartAt: startNode.id,
        States,
    };
}
