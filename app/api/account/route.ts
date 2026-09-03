import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to delete this account." },
      { status: 401 }
    )
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Account deletion is not configured on the server." },
      { status: 500 }
    )
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Capture screenshot paths before the user and cascading rows are deleted.
  const { data: screenshotObjects } = await admin.storage
    .from("trade-screenshots")
    .list(user.id, { limit: 1000 })

  const { data: avatarObjects } = await admin.storage
    .from("profile-avatars")
    .list(user.id, { limit: 100 })

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    )
  }

  if (screenshotObjects?.length) {
    const paths = screenshotObjects.map(
      (object) => `${user.id}/${object.name}`
    )

    await admin.storage.from("trade-screenshots").remove(paths)
  }

  if (avatarObjects?.length) {
    const avatarPaths = avatarObjects.map(
      (object) => `${user.id}/${object.name}`
    )

    await admin.storage.from("profile-avatars").remove(avatarPaths)
  }

  const response = NextResponse.json({ success: true })

  // Clear the browser's Supabase auth cookies after permanent deletion.
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("auth-token")) {
      response.cookies.delete(cookie.name)
    }
  })

  return response
}