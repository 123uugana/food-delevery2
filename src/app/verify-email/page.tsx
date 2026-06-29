import { AuthScreen } from "@/components/auth/auth-screen";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return <AuthScreen initialEmail={email} initialMode="verify" />;
}
