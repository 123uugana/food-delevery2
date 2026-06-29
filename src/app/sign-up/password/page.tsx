import { AuthScreen } from "@/components/auth/auth-screen";

type SignUpPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function SignUpPasswordPage({
  searchParams,
}: SignUpPasswordPageProps) {
  const { email } = await searchParams;

  return <AuthScreen initialEmail={email} initialMode="password" />;
}
