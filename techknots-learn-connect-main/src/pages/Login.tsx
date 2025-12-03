import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Code2, Github, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFirebaseAuth, type OAuthProvider } from "@/lib/firebaseClient";
import { getRoleForEmail } from "@/lib/roleStorage";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const { auth, authError } = useMemo(() => {
    try {
      return { auth: getFirebaseAuth(), authError: null };
    } catch (error) {
      return { auth: null, authError: error as Error };
    }
  }, []);

  const routeByRole = (userEmail: string | null | undefined, explicitRole?: string | null) => {
    const resolvedRole = explicitRole ?? getRoleForEmail(userEmail ?? undefined) ?? "student";
    localStorage.setItem("user", JSON.stringify({ email: userEmail, role: resolvedRole }));
    navigate(`/${resolvedRole}-dashboard`);
  };

  useEffect(() => {
    const state = (location.state as { email?: string } | null) ?? null;
    if (state?.email) {
      setEmail(state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth) {
      toast({
        title: "Authentication unavailable",
        description: authError?.message ?? "Firebase is not configured.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login successful!" });
      routeByRole(credentials.user.email);
    } catch (error) {
      toast({
        title: "Unable to sign in",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    if (!auth) {
      toast({
        title: "Authentication unavailable",
        description: authError?.message ?? "Firebase is not configured.",
        variant: "destructive",
      });
      return;
    }

    setOauthLoading(provider);
    try {
      const authProvider = provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      if (provider === "github") {
        authProvider.addScope("read:user");
        authProvider.addScope("user:email");
      }
      const result = await signInWithPopup(auth, authProvider);
      const additionalInfo = getAdditionalUserInfo(result);
      const email = result.user.email;

      if (!email) {
        throw new Error("This provider did not return an email address.");
      }

      const existingRole = getRoleForEmail(email);

      if (additionalInfo?.isNewUser || !existingRole) {
        await signOut(auth);
        toast({
          title: "Complete your signup",
          description: "Choose your role to finish creating your account.",
        });
        navigate("/signup", { state: { email, provider } });
        return;
      }

      toast({ title: `Signed in with ${provider}` });
      routeByRole(email, existingRole);
    } catch (error) {
      toast({
        title: `Unable to sign in with ${provider}`,
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setOauthLoading(null);
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication not configured</CardTitle>
            <CardDescription>{authError?.message}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add the Firebase environment variables (see README) to enable login.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-2">
              <Code2 className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-primary">TechKnots</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="my-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleOAuthLogin("google")} disabled={oauthLoading === "google"}>
              {oauthLoading === "google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin("github")} disabled={oauthLoading === "github"}>
              {oauthLoading === "github" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
