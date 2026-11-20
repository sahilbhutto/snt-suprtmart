import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthShell from "../../features/auth/components/AuthShell";
import LoginForm from "../../features/auth/components/LoginForm";
import { useAuthStore } from "../../features/auth/store/authStore";

const LoginPage = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    document.title = "Sign in | SNT Supermart";
  }, []);

  // Already signed in and verified
  if (user?.is_verify) return <Navigate to={from} replace />;

  return (
    <AuthShell>
      <header className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h1>
        <p className="text-muted-foreground">Sign in with your mobile number. No password needed.</p>
      </header>

      <LoginForm />
    </AuthShell>
  );
};

export default LoginPage;
