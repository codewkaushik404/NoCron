import { fieldSchemas } from "../../lib/fieldSchemas.js";
import { catalogByType } from "../../lib/nodeCatalog.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import WebhookUrlField from "./WebhookUrlField.jsx";

/** Typed form for the selected node, driven by fieldSchemas.js per node type. */
export default function ConfigTab({ node }) {
  const { updateNodeData } = useWorkflow();
  const fields = fieldSchemas[node.type] ?? [];

  return (
    <form className="space-y-4 px-5 py-5" onSubmit={(event) => event.preventDefault()}>
      <p className="font-mono text-[11px] text-ink-faint">{catalogByType[node.type]?.service}</p>

      {node.type === "webhookTrigger" && node.data.hookId ? (
        <WebhookUrlField hookId={node.data.hookId} />
      ) : null}

      {fields.map((field) => (
        <FieldControl
          key={field.key}
          field={field}
          value={node.data[field.key]}
          onChange={(next) => updateNodeData(node.id, { [field.key]: next })}
        />
      ))}
    </form>
  );
}

function FieldControl({ field, value, onChange }) {
  const shared =
    "w-full rounded-lg border border-line bg-raised/60 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none";

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-ink-soft">
        {field.label}
        {field.required ? <span className="text-rose-700"> *</span> : null}
      </span>

      {field.control === "textarea" ? (
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={`${shared} resize-y font-mono text-[12px]`}
        />
      ) : field.control === "select" ? (
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
      ) : field.control === "number" ? (
        <input
          type="number"
          min={field.min}
          value={value ?? 0}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className={`${shared} font-mono text-[12px]`}
        />
      ) : (
        <input
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={`${shared} ${field.mono ? "font-mono text-[12px]" : ""}`}
        />
      )}

      {field.hint ? <span className="mt-1 block text-[11px] text-ink-faint">{field.hint}</span> : null}
    </label>
  );
}