import { AuthScreen } from "@/components/auth/auth-screen";

type AuthPageProps = {
  searchParams: Promise<{
    email?: string;
    mode?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { email, mode } = await searchParams;

  return <AuthScreen initialEmail={email} initialMode={mode} />;
}
