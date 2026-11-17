import { useAuthStore } from "../../features/auth/store/authStore";

const LoginPage = () => {
  const signIn = useAuthStore((state) => state.signIn);

  const handleLogin = () => {
    signIn({
      id: "user-001",
      fullName: "Sahil Ali Bhutto",
      phone: "03001234567",
      email: "sahil@example.com",
    });

    console.log("Logged in:", useAuthStore.getState().user);
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="rounded-lg bg-green-600 px-5 py-3 text-white"
    >
      Login as Demo User
    </button>
  );
};

export default LoginPage;
