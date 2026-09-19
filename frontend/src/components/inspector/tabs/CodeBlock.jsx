/** Shared scrollable JSON viewer for the Payload and Step Functions tabs. */
export default function CodeBlock({ value }) {
  return (
    <pre className="thin-scroll h-full overflow-auto px-5 py-4 font-mono text-[11px] leading-relaxed text-ink-soft">
      {value}
    </pre>
  );
}
