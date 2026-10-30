import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import GoogleSignInButton from "../auth/GoogleSignInButton.jsx";
import UserMenu from "../auth/UserMenu.jsx";
import { useAuth } from "../../state/useAuth.js";
import { primaryButton } from "../ui/Button.jsx";

export function Logo() {
  return (
    <span className="text-[17px] font-bold tracking-tight text-slate-900">
      NoCron
    </span>
  );
}

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated } = useAuth();
  const sectionPath = location.pathname === "/" ? "" : "/";

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname, location.key]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:gap-6"
      >
        <Link
          to="/"
          aria-label="NoCron home"
          onClick={(event) => {
            if (location.pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="shrink-0 rounded-md transition-opacity hover:opacity-70"
        >
          <Logo />
        </Link>

        <ul className="flex items-center gap-0.5 sm:gap-1">
          <li>
            <Link
              to="/"
              className="rounded-lg px-1 py-2 text-[10px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 sm:px-3 sm:text-sm"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={`${sectionPath}#how-it-works`}
              className="rounded-lg px-1 py-2 text-[10px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 sm:px-3 sm:text-sm"
            >
              How it works
            </Link>
          </li>
          <li>
            <Link
              to={`${sectionPath}#blocks`}
              className="rounded-lg px-1 py-2 text-[10px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 sm:px-3 sm:text-sm"
            >
              Blocks
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {authenticated ? (
            <>
              {location.pathname === "/" && (
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className={`${primaryButton} shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm`}
                >
                  <ArrowRight size={15} />
                  <span>Dashboard</span>
                </button>
              )}

              {location.pathname === "/dashboard" && (
                <button
                  type="button"
                  onClick={() => navigate("/app")}
                  className={`${primaryButton} shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm`}
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New workflow</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
            </>
          ) : (
            <GoogleSignInButton />
          )}
          {authenticated ? <UserMenu /> : null}
        </div>
      </nav>
    </header>
  );
}
