"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthMode = "signup" | "password" | "login" | "reset" | "verify" | "new-password";

const modeTitles: Record<AuthMode, string> = {
  signup: "Create your account",
  password: "Create a strong password",
  login: "Log in",
  reset: "Reset your password",
  verify: "Please verify Your Email",
  "new-password": "Create new password",
};

const modeDescriptions: Record<AuthMode, string> = {
  signup: "Sign up to explore your favorite dishes.",
  password: "Create a strong password with letters, numbers.",
  login: "Log in to enjoy your favorite dishes.",
  reset: "Enter your email to receive a password reset link.",
  verify: "",
  "new-password": "Set a new password with a combination of letters and numbers for better security.",
};

const authModes = new Set<AuthMode>([
  "signup",
  "password",
  "login",
  "reset",
  "verify",
  "new-password",
]);

const routeByMode: Record<AuthMode, string> = {
  signup: "/sign-up",
  password: "/sign-up/password",
  login: "/log-in",
  reset: "/forgot-password",
  verify: "/verify-email",
  "new-password": "/create-new-password",
};

function isAuthMode(value: string | undefined): value is AuthMode {
  return !!value && authModes.has(value as AuthMode);
}

export function AuthScreen({
  initialEmail = "",
  initialMode = "signup",
}: {
  initialEmail?: string;
  initialMode?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(isAuthMode(initialMode) ? initialMode : "signup");
  const [email, setEmail] = useState(initialEmail);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeEmail = mode === "login" ? loginEmail : email;
  const emailInvalid = activeEmail.length > 0 && !isValidEmail(activeEmail);
  const signupReady = isValidEmail(email);
  const passwordError = getPasswordError(password, confirmPassword);
  const newPasswordError = getPasswordError(newPassword, newConfirmPassword);
  const passwordReady = !!password && !!confirmPassword && !passwordError;
  const newPasswordReady = !!newPassword && !!newConfirmPassword && !newPasswordError;
  const loginReady = isValidEmail(loginEmail) && loginPassword.length >= 8;
  const resetReady = isValidEmail(email);

  const content = useMemo(() => {
    if (mode === "verify") {
      return {
        title: modeTitles[mode],
        description: `We just sent an email to ${email || "example@gmail.com"}. Click the link in the email to verify your account.`,
      };
    }

    return {
      title: modeTitles[mode],
      description: modeDescriptions[mode],
    };
  }, [email, mode]);

  function go(nextMode: AuthMode, options: { updateUrl?: boolean } = {}) {
    setMode(nextMode);
    setTouched(false);
    setSubmitted(false);

    if (options.updateUrl !== false) {
      router.push(routeForMode(nextMode, email));
    }
  }

  function handleBack() {
    if (mode === "signup" || mode === "login") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.push("/");
      }
      return;
    }

    go(mode === "reset" ? "login" : "signup");
  }

  return (
    <main className="min-h-screen bg-white text-[#171719]">
      <div className="grid min-h-screen grid-cols-[minmax(320px,0.78fr)_minmax(420px,1.22fr)] gap-10 px-12 py-8 max-lg:grid-cols-1 max-lg:px-6 max-lg:py-6">
        <section className="flex min-h-[680px] items-center justify-center max-lg:min-h-auto">
          <div className="w-full max-w-[360px]">
            <button
              type="button"
              onClick={handleBack}
              className="mb-9 grid size-8 place-items-center rounded-md border border-[#e8e8ea] bg-white text-[#5e6066] shadow-sm transition hover:bg-[#f8f8f9]"
              aria-label="Go back"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div>
              <h1 className="text-[24px] font-bold tracking-normal text-[#151517]">
                {content.title}
              </h1>
              <p className="mt-2 max-w-[350px] text-[14px] leading-5 text-[#7b7f87]">
                {content.description}
              </p>
            </div>

            <div className="mt-6">
              {mode === "signup" && (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setTouched(true);
                    if (signupReady) go("password");
                  }}
                >
                  <FieldError message={touched && emailInvalid ? "Invalid email. Use a format like example@email.com" : ""}>
                    <Input
                      value={email}
                      onBlur={() => setTouched(true)}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                      aria-invalid={touched && emailInvalid}
                      className="h-9 rounded-md text-[13px]"
                    />
                  </FieldError>
                  <AuthButton disabled={!signupReady}>{"Let's Go"}</AuthButton>
                  <SwitchLine label="Already have an account?" action="Log in" onClick={() => go("login")} />
                </form>
              )}

              {mode === "password" && (
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                    if (!passwordError) go("verify");
                  }}
                >
                  <PasswordFields
                    password={password}
                    confirmPassword={confirmPassword}
                    error={submitted ? passwordError : ""}
                    showPassword={showPassword}
                    onConfirmChange={setConfirmPassword}
                    onPasswordChange={setPassword}
                    onShowPasswordChange={setShowPassword}
                  />
                  <AuthButton disabled={!passwordReady}>{"Let's Go"}</AuthButton>
                  <SwitchLine label="Already have an account?" action="Log in" onClick={() => go("login")} />
                </form>
              )}

              {mode === "login" && (
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <FieldError message={submitted && emailInvalid ? "Invalid email. Use a format like example@email.com" : ""}>
                    <Input
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      placeholder="Enter your email address"
                      aria-invalid={submitted && emailInvalid}
                      className="h-9 rounded-md text-[13px]"
                    />
                  </FieldError>
                  <FieldError
                    message={
                      submitted && loginPassword.length > 0 && loginPassword.length < 8
                        ? "Incorrect password. Please try again."
                        : ""
                    }
                  >
                    <Input
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Password"
                      type="password"
                      aria-invalid={submitted && loginPassword.length > 0 && loginPassword.length < 8}
                      className="h-9 rounded-md text-[13px]"
                    />
                  </FieldError>
                  <button
                    type="button"
                    onClick={() => go("reset")}
                    className="text-[12px] text-[#31333a] underline underline-offset-2"
                  >
                    Forgot password ?
                  </button>
                  <AuthButton disabled={!loginReady}>{"Let's Go"}</AuthButton>
                  <SwitchLine label="Don't have an account?" action="Sign up" onClick={() => go("signup")} />
                </form>
              )}

              {mode === "reset" && (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (resetReady) go("new-password");
                  }}
                >
                  <FieldError message={emailInvalid ? "Invalid email. Use a format like example@email.com" : ""}>
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="example@gmail.com"
                      aria-invalid={emailInvalid}
                      className="h-9 rounded-md text-[13px]"
                    />
                  </FieldError>
                  <AuthButton disabled={!resetReady}>Send link</AuthButton>
                  <SwitchLine label="Don't have an account?" action="Sign up" onClick={() => go("signup")} />
                </form>
              )}

              {mode === "verify" && (
                <div className="space-y-6">
                  <AuthButton onClick={() => go("signup")}>Resend email</AuthButton>
                </div>
              )}

              {mode === "new-password" && (
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                    if (!newPasswordError) go("login");
                  }}
                >
                  <PasswordFields
                    password={newPassword}
                    confirmPassword={newConfirmPassword}
                    error={submitted ? newPasswordError : ""}
                    showPassword={showPassword}
                    onConfirmChange={setNewConfirmPassword}
                    onPasswordChange={setNewPassword}
                    onShowPasswordChange={setShowPassword}
                  />
                  <AuthButton disabled={!newPasswordReady}>Create password</AuthButton>
                </form>
              )}
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex text-[12px] font-medium text-[#2563eb] hover:underline"
            >
              Back to menu
            </Link>
          </div>
        </section>

        <section className="relative min-h-[680px] overflow-hidden rounded-[18px] max-lg:min-h-[420px] max-sm:min-h-[320px]">
          <Image
            src="/Image÷.png"
            alt="NomNom delivery rider on a city street"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </section>
      </div>
    </main>
  );
}

function PasswordFields({
  password,
  confirmPassword,
  error,
  showPassword,
  onPasswordChange,
  onConfirmChange,
  onShowPasswordChange,
}: {
  password: string;
  confirmPassword: string;
  error: string;
  showPassword: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onShowPasswordChange: (value: boolean) => void;
}) {
  const type = showPassword ? "text" : "password";

  return (
    <div className="space-y-3">
      <Input
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Password"
        type={type}
        className="h-9 rounded-md text-[13px]"
      />
      <FieldError message={error}>
        <Input
          value={confirmPassword}
          onChange={(event) => onConfirmChange(event.target.value)}
          placeholder="Confirm"
          type={type}
          aria-invalid={!!error}
          className="h-9 rounded-md text-[13px]"
        />
      </FieldError>
      <label className="flex items-center gap-2 text-[12px] text-[#6f737b]">
        <Checkbox checked={showPassword} onCheckedChange={(value) => onShowPasswordChange(value === true)} />
        Show password
      </label>
    </div>
  );
}

function FieldError({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}) {
  return (
    <div>
      {children}
      {message && <p className="mt-2 text-[12px] leading-4 text-[#ef4444]">{message}</p>}
    </div>
  );
}

function AuthButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type={onClick ? "button" : "submit"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-10 w-full rounded-md bg-[#18181b] text-[12px] font-semibold text-white hover:bg-[#27272a]",
        "disabled:bg-[#d1d1d1] disabled:text-white disabled:opacity-100",
      )}
    >
      {children}
    </Button>
  );
}

function SwitchLine({
  label,
  action,
  onClick,
}: {
  label: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <p className="text-center text-[13px] text-[#8a8d94]">
      {label}{" "}
      <button
        type="button"
        onClick={onClick}
        className="font-medium text-[#2563eb] hover:underline"
      >
        {action}
      </button>
    </p>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.com$/i.test(value.trim());
}

function routeForMode(mode: AuthMode, email: string) {
  if ((mode === "password" || mode === "verify") && email.trim()) {
    return `${routeByMode[mode]}?email=${encodeURIComponent(email.trim())}`;
  }

  return routeByMode[mode];
}

function getPasswordError(password: string, confirmPassword: string) {
  if (!password && !confirmPassword) return "";
  if (password !== confirmPassword) return "Those password did not match, Try again";

  const hasLetter = /[a-z]/i.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^a-z0-9]/i.test(password);

  if (password.length < 8 || !hasLetter || !hasNumber || !hasSymbol) {
    return "Weak password. Use numbers and symbols.";
  }

  return "";
}
