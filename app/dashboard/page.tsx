import { redirect } from "next/navigation"

import DashboardClient from "@/components/dashboard/dashboard-client"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: trades, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("trade_date", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const fullName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "Trader"

  return (
    <DashboardClient
      userId={user.id}
      fullName={fullName}
      initialTrades={trades || []}
    />
  )
}