"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

type AuthMode = "signup" | "password" | "login";

const modeTitles: Record<AuthMode, string> = {
  signup: "Create your account",
  password: "Create a strong password",
  login: "Log in",
};

const modeDescriptions: Record<AuthMode, string> = {
  signup: "Sign up to explore your favorite dishes.",
  password: "Create a strong password with letters, numbers.",
  login: "Log in to enjoy your favorite dishes.",
};

const authModes = new Set<AuthMode>(["signup", "password", "login"]);

const routeByMode: Record<AuthMode, string> = {
  signup: "/sign-up",
  password: "/sign-up/password",
  login: "/log-in",
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
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const activeEmail = mode === "login" ? loginEmail : email;
  const emailInvalid = activeEmail.length > 0 && !isValidEmail(activeEmail);
  const signupReady = isValidEmail(email);
  const passwordError = getPasswordError(password, confirmPassword);
  const passwordReady = !!password || !!confirmPassword;
  const loginReady = isValidEmail(loginEmail) && loginPassword.length >= 8;

  function go(nextMode: AuthMode, options: { updateUrl?: boolean } = {}) {
    setMode(nextMode);
    setTouched(false);
    setSubmitted(false);
    setAuthError("");

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

    go("signup");
  }

  async function submitAuth(
    path: "/auth/sign-up" | "/auth/log-in",
    credentials: { email: string; password: string },
  ) {
    setAuthError("");
    setAuthLoading(true);

    try {
      const response = await fetch(apiUrl(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = (await response.json().catch(() => null)) as {
        user?: { id: string; email: string };
        error?: string;
      } | null;

      if (!response.ok || !data?.user) {
        throw new Error(data?.error || "Could not continue. Please try again.");
      }

      window.localStorage.setItem("nomnom-user", JSON.stringify(data.user));
      router.push("/");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not continue. Please try again.");
    } finally {
      setAuthLoading(false);
    }
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
                {modeTitles[mode]}
              </h1>
              <p className="mt-2 max-w-[350px] text-[14px] leading-5 text-[#7b7f87]">
                {modeDescriptions[mode]}
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
                    if (!passwordError) {
                      void submitAuth("/auth/sign-up", { email, password });
                    }
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
                  {authError && <AuthMessage message={authError} />}
                  <AuthButton disabled={!passwordReady || authLoading}>
                    {authLoading ? "Creating account..." : "Let's Go"}
                  </AuthButton>
                  <SwitchLine label="Already have an account?" action="Log in" onClick={() => go("login")} />
                </form>
              )}

              {mode === "login" && (
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                    if (loginReady) {
                      void submitAuth("/auth/log-in", {
                        email: loginEmail,
                        password: loginPassword,
                      });
                    }
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
                  {authError && <AuthMessage message={authError} />}
                  <AuthButton disabled={!loginReady || authLoading}>
                    {authLoading ? "Logging in..." : "Let's Go"}
                  </AuthButton>
                  <SwitchLine label="Don't have an account?" action="Sign up" onClick={() => go("signup")} />
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
            src="/rider.png"
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
        aria-invalid={!!error}
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
      {message && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-[#fef2f2] px-2.5 py-2 text-[12px] font-medium leading-4 text-[#dc2626]">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}

function AuthMessage({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-1.5 rounded-md bg-[#fef2f2] px-2.5 py-2 text-[12px] font-medium leading-4 text-[#dc2626]">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
      <span>{message}</span>
    </p>
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value.trim());
}

function routeForMode(mode: AuthMode, email: string) {
  if (mode === "password" && email.trim()) {
    return `${routeByMode[mode]}?email=${encodeURIComponent(email.trim())}`;
  }

  return routeByMode[mode];
}

function getPasswordError(password: string, confirmPassword: string) {
  if (!password || !confirmPassword) return "Please enter and confirm your password.";
  if (password !== confirmPassword) return "Those passwords did not match. Try again.";

  const hasLetter = /[a-z]/i.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^a-z0-9]/i.test(password);

  if (password.length < 8 || !hasLetter || !hasNumber || !hasSymbol) {
    return "Weak password. Use numbers and symbols.";
  }

  return "";
}
