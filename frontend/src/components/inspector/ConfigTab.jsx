import { fieldSchemas } from "../../lib/fieldSchemas.js";
import { catalogByType } from "../../lib/nodeCatalog.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import WebhookUrlField from "./WebhookUrlField.jsx";
import TallyFormSelector from "./TallyFormSelector.jsx";
import { useRecoilValue } from "recoil";
import { tallyFormFieldsState } from "../../state/atoms.js";

/** Typed form for the selected node, driven by fieldSchemas.js per node type. */
export default function ConfigTab({ node }) {
  const { nodes, updateNodeData } = useWorkflow();
  const fields = fieldSchemas[node.type] ?? [];

  const tallyFormFields = useRecoilValue(tallyFormFieldsState);
  const tallyTrigger = nodes.find(
    (workflowNode) => workflowNode.type === "tallyTrigger"
  );
  const selectedTallyFormId =
    tallyTrigger?.data?.form_id ?? tallyTrigger?.data?.formId ?? "";

  const availableTallyFields = node.type === "branch"
    ? tallyFormFields[selectedTallyFormId] ?? []
    : [];

  return (
    <form className="space-y-4 px-5 py-5" onSubmit={(event) => event.preventDefault()}>
      {catalogByType[node.type]?.service != null && (
        <p className="font-mono text-[11px] text-ink-faint">
          AWS Service : {catalogByType[node.type].service}
        </p>
      )}

      {(node.type === "webhookTrigger" || node.type === "tallyTrigger") &&
      node.data.hookId ? (
        <WebhookUrlField hookId={node.data.hookId} />
      ) : null}

      {node.type === "tallyTrigger" 
        ? (
          <TallyFormSelector
            node={node}
          />
          ) 
        : null
      }

      {fields.map((field) => (
        <FieldControl
          key={field.key}
          field={field}
          value={node.data[field.key]}
          onChange={(next) => updateNodeData(node.id, { [field.key]: next })}
          tallyFields={availableTallyFields}
        />
      ))}
    </form>
  );
}

function FieldControl({ field, value, onChange, tallyFields = [] }) {
  const shared =
    "w-full rounded-lg border border-line bg-raised/60 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none";

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-ink-soft">
        {field.label}
        {field.required ? <span className="text-rose-700"> *</span> : null}
      </span>

      {field.control === "textarea" 
      ? (
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={`${shared} resize-y font-mono text-[12px]`}
        />
      ) 
      : field.control === "password" 
        ? (
            <input
              type="text"
              value={value ?? ""}
              onChange={(event) => onChange(event.target.value)}
              className={`${shared} font-mono text-[12px]`}
            />
        )
        : field.control === "tallyField"
            ? (
                <select
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value)}
                  className={`${shared} font-mono text-[12px]`}
                >
                  <option value="">
                    Select a form field
                  </option>

                  {tallyFields.map((tallyField) => (
                    <option
                      key={tallyField.key}
                      value={tallyField.key}
                    >
                      {tallyField.label}
                    </option>
                  ))}
                </select>
              )
            : field.control === "select" 
              ? (
                <select
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value)}
                  className={`${shared} font-mono text-[12px]`}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) 
              : field.control === "number" 
                ? (
                <input
                type="number"
                min={field.min}
                value={value ?? 0}
                onChange={(event) => onChange(Number(event.target.value) || 0)}
                className={`${shared} font-mono text-[12px]`}
                />
              ) 
                : (
                <input
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value)}
                  className={`${shared} ${field.mono ? "font-mono text-[12px]" : ""}`}
                />
                )
          }

      {field.hint ? <span className="mt-1 block text-[11px] text-ink-faint">{field.hint}</span> : null}
    </label>
  );
}