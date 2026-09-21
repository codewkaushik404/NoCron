import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRecoilState } from "recoil";
import {
  tallyConnectionState,
  tallyFormFieldsState,
} from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_DEPLOY_URL;

export default function TallyFormSelector({ node }) {
  const { updateNodeData } = useWorkflow();

  const [connection, setConnection] = useRecoilState(tallyConnectionState);

  const [, setFormFields] = useRecoilState(tallyFormFieldsState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = node?.data?.apiKey ?? "";

  const connectTally = async () => {
    if (!apiKey.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/tally/forms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey: apiKey.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to connect Tally"
        );
      }

      setConnection({
        connection_id: data.connection_id,
        forms: data.forms ?? [],
      });

      updateNodeData(node.id, {
        connection_id: data.connection_id,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFormFields = async (formId) => {
    if (!connection.connection_id || !formId) {
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/tally/forms/${formId}/fields?connection_id=${encodeURIComponent(
          connection.connection_id
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load form fields"
        );
      }

      setFormFields((current) => ({
        ...current,
        [formId]: data.fields ?? [],
      }));
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormChange = async (event) => {
    const formId = event.target.value;

    const selectedForm = connection.forms.find(
      (form) => form.id === formId
    );

    // Save selected form in this workflow node.
    updateNodeData(node.id, {
      form_id: formId,
      form_name: selectedForm?.name ?? "",
    });

    // Get fields belonging to this exact form.
    await loadFormFields(formId);
  };

  return (
    <div className="space-y-4">

      {/* API key */}
      <label className="block">
        <span className="mb-1.5 block text-xs text-ink-soft">
          Tally API key
        </span>

        <input
          type="text"
          value={apiKey}
          onChange={(event) =>
            updateNodeData(node.id, {
              apiKey: event.target.value,
            })
          }
          placeholder="Enter Tally API key"
          className="w-full rounded-lg border border-line bg-raised/60 px-3 py-2.5 font-mono text-[12px] text-ink outline-none focus:border-cyan/60"
        />
      </label>

      {/* Connect */}
      <button
        type="button"
        disabled={!apiKey.trim() || loading}
        onClick={connectTally}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-2.5 text-xs font-medium text-cyan disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading && (
          <Loader2
            size={14}
            className="animate-spin"
          />
        )}

        {loading ? "Connecting..." : "Connect Tally"}
      </button>

      {/* Form */}
      {connection.connection_id && (
        <label className="block">
          <span className="mb-1.5 block text-xs text-ink-soft">
            Tally form
          </span>

          <select
            value={node?.data?.form_id ?? node?.data?.formId ?? ""}
            onChange={handleFormChange}
            className="w-full rounded-lg border border-line bg-raised/60 px-3 py-2.5 font-mono text-[12px] text-ink outline-none focus:border-cyan/60"
          >
            <option value="">
              Select a form
            </option>

            {connection.forms.map((form) => (
              <option
                key={form.id}
                value={form.id}
              >
                {form.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {error && (
        <p className="text-[11px] text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}