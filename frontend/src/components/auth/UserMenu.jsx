import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../state/useAuth.js";

/** Avatar + name in the top bar, with a click-out dropdown to sign out. */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-line bg-raised/60 py-1 pl-1 pr-3 text-sm text-ink transition-colors hover:border-cyan/50"
      >
        {user.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-6 w-6 rounded-full" />
        ) : (
          <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan/20 text-cyan">
            <User size={13} />
          </span>
        )}
        <span className="max-w-[12ch] truncate">{user.name}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-panel shadow-node">
          <div className="border-b border-line px-3 py-2.5">
            <p className="truncate text-xs text-ink-faint">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-raised hover:text-ink"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}