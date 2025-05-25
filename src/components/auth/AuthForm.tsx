
import { useState } from "react";
import { EmailAuthForm } from "./EmailAuthForm";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { AuthModeToggle } from "./AuthModeToggle";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isSignUp = mode === "signup";

  return (
    <div className="w-full max-w-md space-y-6">
      <EmailAuthForm
        mode={mode}
        loading={loading}
        setLoading={setLoading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <GoogleSignInButton
        loading={loading}
        setLoading={setLoading}
        isSignUp={isSignUp}
      />
      
      <AuthModeToggle mode={mode} setMode={setMode} />
    </div>
  );
}
