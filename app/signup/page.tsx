import AuthForm from "@/components/auth-form"

export default function SignupPage() {
  return (
    <main className="auth-page">
      <div className="auth-background-light" />
      <AuthForm mode="signup" />
    </main>
  )
}