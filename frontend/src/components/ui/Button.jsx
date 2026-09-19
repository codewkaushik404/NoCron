const variants = {
  primary:
    "bg-gradient-to-r from-cyan-dim to-cyan text-panel font-semibold shadow-glow hover:brightness-110",
  outline:
    "border border-line bg-raised/60 text-ink hover:border-cyan/50 hover:text-cyan",
  ghost: "text-ink-soft hover:text-ink hover:bg-raised/60",
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
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon ? <Icon size={16} strokeWidth={2} /> : null}
      {children}
    </button>
  );
}
