import AuthForm from "@/components/auth-form"

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-background-light" />
      <AuthForm mode="login" />
    </main>
  )
}