export default function Panel({
  title,
  subtitle,
  action,
  onClose,
  closeIcon,
  closeLabel = "Close panel",
  children,
  className = "",
  scroll = true,
}) {
  return (
    <aside className={`flex h-full flex-col bg-panel ${className}`}>
      <header className="shrink-0 border-b border-line px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-sm font-semibold tracking-wide text-ink">{title}</h2>
          <div className="flex shrink-0 items-center gap-2">
            {action}
            {onClose ? (
              <button
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="rounded p-1 text-ink-faint transition-colors hover:bg-raised hover:text-ink"
              >
                {closeIcon}
              </button>
            ) : null}
          </div>
        </div>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-ink-faint">{subtitle}</p>
        ) : null}
      </header>
      {scroll ? (
        <div className="thin-scroll flex-1 overflow-y-auto">{children}</div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      )}
    </aside>
  );
}