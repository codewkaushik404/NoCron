const variants = {
  primary: "bg-ink text-panel hover:bg-cyan transition-colors",
  outline:
    "border border-line bg-panel text-ink hover:border-line-strong hover:bg-raised",
  ghost: "text-ink-soft hover:bg-raised hover:text-ink",
};

export default function Button({
  variant = "outline",
  icon: Icon,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon ? <Icon size={15} strokeWidth={2} /> : null}
      {children}
    </button>
  );
}

export const primaryButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-1.5 text-[15px] font-semibold text-white shadow-sm transition-colors";

