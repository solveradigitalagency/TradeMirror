"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useMemo, useState } from "react"
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"

type AuthFormProps = {
  mode: "login" | "signup"
}

export default function AuthForm({
  mode,
}: AuthFormProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] =
    useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] =
    useState(false)

  const isSignup = mode === "signup"

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setMessage("")
    setLoading(true)

    if (isSignup) {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        setMessage(
          "Check your email to confirm your TradeMirror account."
        )
        setLoading(false)
        return
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    router.replace("/dashboard")
    router.refresh()
  }

  async function handleGoogleLogin() {
    setError("")
    setMessage("")
    setGoogleLoading(true)

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          queryParams: {
            prompt: "select_account",
          },
        },
      })

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <Link
          href="/"
          className="auth-brand auth-logo-link"
        >
          <img
            src="/trademirrorlogo.png"
            alt="TradeMirror"
            className="auth-logo-image"
          />
        </Link>

        <h1>
          {isSignup
            ? "Create your journal."
            : "Welcome back."}
        </h1>

        <p>
          {isSignup
            ? "Start tracking your performance and decisions."
            : "Sign in to continue to your trading dashboard."}
        </p>
      </div>

      <button
        type="button"
        className="google-auth-button"
        disabled={googleLoading || loading}
        onClick={handleGoogleLogin}
      >
        {googleLoading ? (
          <LoaderCircle
            className="auth-spinner"
            size={18}
          />
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.702-1.567 2.684-3.874 2.684-6.613Z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.468-.806 5.956-2.182l-2.91-2.258c-.805.54-1.835.86-3.046.86-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z"
              />
              <path
                fill="#FBBC05"
                d="M3.963 10.706A5.42 5.42 0 0 1 3.681 9c0-.592.102-1.168.282-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.038l3.007-2.332Z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.322 0 2.508.454 3.441 1.346l2.582-2.582C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58Z"
              />
            </svg>

            {isSignup
              ? "Sign up with Google"
              : "Continue with Google"}
          </>
        )}
      </button>

      <div className="auth-divider">
        <span />
        <small>OR CONTINUE WITH EMAIL</small>
        <span />
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        {isSignup && (
          <label>
            <span>Full name</span>

            <input
              type="text"
              placeholder="Alex Trader"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </label>
        )}

        <label>
          <span>Email address</span>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            required
          />
        </label>

        <label>
          <span>Password</span>

          <div className="password-field">
            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder={
                isSignup
                  ? "At least 6 characters"
                  : "Enter your password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete={
                isSignup
                  ? "new-password"
                  : "current-password"
              }
              minLength={6}
              required
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (current) => !current
                )
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </label>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        <button
          className="auth-submit"
          type="submit"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <LoaderCircle
              className="auth-spinner"
              size={18}
            />
          ) : (
            <>
              {isSignup
                ? "Create free account"
                : "Sign in"}

              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-switch">
        {isSignup
          ? "Already have an account?"
          : "New to TradeMirror?"}

        <Link
          href={isSignup ? "/login" : "/signup"}
        >
          {isSignup
            ? "Sign in"
            : "Create an account"}
        </Link>
      </div>
    </div>
  )
}