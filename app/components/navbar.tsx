import { Link, useNavigate, Form } from "react-router";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { MapPin, Compass, BookOpen, LogOut, User, LogIn } from "lucide-react";

export function Navbar() {
  const { config, loading } = useConfigurables();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const appName = loading ? "WanderMind" : (config?.appName ?? "WanderMind");

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Compass className="w-6 h-6" />
          <span>{appName}</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/planner"
            className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Rencanakan
          </Link>
          <Link
            to="/trips"
            className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Perjalananku
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {!authLoading && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-primary-foreground/80">
                  <User className="w-4 h-4" />
                  {user?.username}
                </span>
                <Form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </Form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-primary-foreground text-primary text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Daftar
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
