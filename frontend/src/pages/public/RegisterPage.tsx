import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthShell from "../../features/auth/components/AuthShell";
import AuthStepper from "../../features/auth/components/AuthStepper";
import RegisterForm from "../../features/auth/components/RegisterForm";
import { useAuthStore } from "../../features/auth/store/authStore";

const RegisterPage = () => {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    document.title = "Create account | SNT Supermart";
  }, []);

  // Already signed in and verified
  if (user?.is_verify) return <Navigate to="/" replace />;

  return (
    <AuthShell>
      <AuthStepper current={1} />

      <header className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Create your account</h1>
        <p className="text-muted-foreground">It takes less than a minute. We will verify your phone next.</p>
      </header>

      <RegisterForm />
    </AuthShell>
  );
};

export default RegisterPage;
