import { Link, useNavigate } from "@tanstack/react-router";
import { Stethoscope, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    console.log("Logout clicked");
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">SmartDoctor AI</span>
            <span className="text-[11px] text-muted-foreground">Find the right doctor, fast</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/search" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">
            Search
          </Link>
          {user ? (
            <>
              <Link to="/appointments" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                My appointments
              </Link>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
