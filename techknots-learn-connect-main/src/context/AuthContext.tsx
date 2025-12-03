import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import { getRoleForEmail, type Role } from "@/lib/roleStorage";

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  error: Error | null;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          setRole(null);
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        setUser(firebaseUser);
        const resolvedRole = getRoleForEmail(firebaseUser.email) ?? "student";
        setRole(resolvedRole);
        if (firebaseUser.email) {
          localStorage.setItem("user", JSON.stringify({ email: firebaseUser.email, role: resolvedRole }));
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signOutUser = async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      setRole(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      error,
      signOutUser,
    }),
    [user, role, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


