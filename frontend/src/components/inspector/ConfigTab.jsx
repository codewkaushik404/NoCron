import { fieldSchemas } from "../../lib/fieldSchemas.js";
import { catalogByType } from "../../lib/nodeCatalog.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import WebhookUrlField from "./WebhookUrlField.jsx";

export default function ConfigTab({ node }) {
  const { updateNodeData } = useWorkflow();
  const fields = fieldSchemas[node.type] ?? [];

  return (
    <form
      className="space-y-4 px-5 py-5"
      onSubmit={(event) => event.preventDefault()}
    >
      {node.type === "webhook" ? <WebhookUrlField /> : null}

      {catalogByType[node.type]?.service ? (
        <p className="font-mono text-[11px] text-ink-faint">
          Type: {catalogByType[node.type].service}
        </p>
      ) : null}

      {fields.map((field) => {
        const value = node.data[field.key] ?? "";

        return (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-xs text-ink-soft">
              {field.label}
              {field.required ? (
                <span className="text-rose-400"> *</span>
              ) : null}
            </span>

            {field.control === "textarea" ? (
              <textarea
                rows={4}
                value={value}
                onChange={(event) =>
                  updateNodeData(node.id, {
                    [field.key]: event.target.value,
                  })
                }
                className="w-full resize-y rounded-lg border border-line bg-raised/60 px-3 py-2.5 font-mono text-[12px] text-ink focus:border-teal/60 focus:outline-none"
              />
            ) : field.control === "number" ? (
              <input
                type="number"
                min={field.min}
                value={value}
                onChange={(event) =>
                  updateNodeData(node.id, {
                    [field.key]: Number(event.target.value),
                  })
                }
                className="w-full rounded-lg border border-line bg-raised/60 px-3 py-2.5 font-mono text-[12px] text-ink focus:border-teal/60 focus:outline-none"
              />
            ) : (
              <input
                value={value}
                onChange={(event) =>
                  updateNodeData(node.id, {
                    [field.key]: event.target.value,
                  })
                }
                className={`w-full rounded-lg border border-line bg-raised/60 px-3 py-2.5 text-sm text-ink focus:border-teal/60 focus:outline-none ${
                  field.mono ? "font-mono text-[12px]" : ""
                }`}
              />
            )}
          </label>
        );
      })}
    </form>
  );
}
