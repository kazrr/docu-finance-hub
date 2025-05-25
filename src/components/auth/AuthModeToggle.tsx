
type AuthMode = "signin" | "signup";

interface AuthModeToggleProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

export function AuthModeToggle({ mode, setMode }: AuthModeToggleProps) {
  const isSignUp = mode === "signup";
  
  return (
    <div className="text-center text-sm">
      {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
      <button
        type="button"
        className="underline text-primary"
        onClick={() => setMode(isSignUp ? "signin" : "signup")}
      >
        {isSignUp ? "Sign in" : "Sign up"}
      </button>
    </div>
  );
}
