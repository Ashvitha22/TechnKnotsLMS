import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SiteNav = () => {
  const { user, role, loading, signOutUser } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (role) {
      navigate(`/${role}-dashboard`);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">TechKnots</span>
        </Link>

        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : user && role ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">{user.email}</span>
              <Button variant="secondary" onClick={goToDashboard}>
                Go to Dashboard
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SiteNav;


