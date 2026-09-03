"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { createClient } from "@/lib/supabase/client"

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.push("/login")
    router.refresh()
  }

  return (
    <button className="temporary-signout" onClick={handleSignOut}>
      <LogOut size={17} />
      Sign out
    </button>
  )
}