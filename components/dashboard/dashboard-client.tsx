"use client"

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
  ArrowRight,
  Pencil,
  Trash2,
  SlidersHorizontal,
  UserPlus,
  UserCheck,
  Eye,
  ShieldCheck,
  UserRound,
  LockKeyhole,
  Mail,
  KeyRound,
  LogOut,
  Download,
} from "lucide-react"

import SignOutButton from "@/components/sign-out-button"
import { createClient } from "@/lib/supabase/client"

type Trade = {
  id: string
  user_id: string
  trade_date: string
  pnl: number | string
  instrument: string | null
  direction: "long" | "short" | null
  contracts: number | null
  setup: string | null
  journal: string | null
  emotion: string | null
  followed_plan: boolean | null
  execution_rating: string | null
  screenshot_path: string | null
  visibility: "private" | "followers" | "public"
  created_at: string
}

type DashboardClientProps = {
  userId: string
  fullName: string
  initialTrades: Trade[]
}

type DiscoverProfile = {
  id: string
  full_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
  show_public_pnl: boolean
}

type DashboardNotification = {
  id: string
  recipient_id: string
  actor_id: string
  type: "new_follower"
  read_at: string | null
  created_at: string
  actor: DiscoverProfile | null
}

const navigation = [
  { icon: LayoutDashboard, label: "Overview", view: "overview" },
  { icon: BarChart3, label: "Trades", view: "trades" },
  { icon: BookOpen, label: "Journal", view: "journal" },
  { icon: Users, label: "Discover", view: "discover" },
  { icon: Settings, label: "Settings", view: "settings" },
]

const initialForm = {
  pnl: "",
  instrument: "NQ",
  direction: "long",
  contracts: "1",
  setup: "",
  journal: "",
  emotion: "Focused",
  followedPlan: "yes",
  executionRating: "Good execution",
  visibility: "private",
}

function getFirstWeekdayOfMonth(month: Date) {
  const firstDay = startOfMonth(month)
  const weekday = firstDay.getDay()

  if (weekday === 6) return addDays(firstDay, 2)
  if (weekday === 0) return addDays(firstDay, 1)

  return firstDay
}

export default function DashboardClient({
  userId,
  fullName,
  initialTrades,
}: DashboardClientProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")
  const [activeView, setActiveView] = useState<
    "overview" | "trades" | "journal" | "discover" | "settings"
  >("overview")
  const [tradeSearch, setTradeSearch] = useState("")
  const [tradeResult, setTradeResult] = useState("all")
  const [tradeDirection, setTradeDirection] = useState("all")
  const [tradePlan, setTradePlan] = useState("all")
  const [selectedLedgerTrade, setSelectedLedgerTrade] =
    useState<Trade | null>(initialTrades[0] || null)
  const [discoverProfiles, setDiscoverProfiles] = useState<DiscoverProfile[]>([])
  const [discoverTrades, setDiscoverTrades] = useState<Trade[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const [discoverSearch, setDiscoverSearch] = useState("")
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [discoverError, setDiscoverError] = useState("")
  const [selectedDiscoverProfile, setSelectedDiscoverProfile] =
    useState<DiscoverProfile | null>(null)
  const [followLoadingId, setFollowLoadingId] = useState<string | null>(null)
  const [settingsName, setSettingsName] = useState(fullName)
  const [settingsUsername, setSettingsUsername] = useState("")
  const [settingsBio, setSettingsBio] = useState("")
  const [settingsShowPublicPnl, setSettingsShowPublicPnl] = useState(true)
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("")
  const [settingsAvatarFile, setSettingsAvatarFile] = useState<File | null>(null)
  const [settingsAvatarPreview, setSettingsAvatarPreview] = useState("")
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState("")
  const [settingsError, setSettingsError] = useState("")
  const [settingsTab, setSettingsTab] = useState<
    "profile" | "privacy" | "security"
  >("profile")
  const [settingsEmail, setSettingsEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [securitySaving, setSecuritySaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [journalSearch, setJournalSearch] = useState("")
  const [journalResult, setJournalResult] = useState("all")
  const [selectedJournalTrade, setSelectedJournalTrade] =
    useState<Trade | null>(initialTrades[0] || null)
  const [journalDownloadLoading, setJournalDownloadLoading] = useState(false)
  const [journalDownloadError, setJournalDownloadError] = useState("")

  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [deletingTradeId, setDeletingTradeId] = useState<string | null>(null)
  const [screenshotUrls, setScreenshotUrls] = useState<
    Record<string, string>
  >({})
  const [previewScreenshot, setPreviewScreenshot] = useState<{
    url: string
    instrument: string
  } | null>(null)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const [globalProfiles, setGlobalProfiles] = useState<DiscoverProfile[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<DashboardNotification[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(true)

  useEffect(() => {
    if (!globalSearchOpen || globalProfiles.length > 0) return

    let cancelled = false

    async function loadGlobalProfiles() {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, bio, avatar_url, show_public_pnl")
        .neq("id", userId)
        .order("full_name", { ascending: true })

      if (!cancelled) {
        setGlobalProfiles((data || []) as DiscoverProfile[])
      }
    }

    loadGlobalProfiles()

    return () => {
      cancelled = true
    }
  }, [globalProfiles.length, globalSearchOpen, supabase, userId])

  useEffect(() => {
    let cancelled = false

    async function loadNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, recipient_id, actor_id, type, read_at, created_at")
        .eq("recipient_id", userId)
        .order("created_at", { ascending: false })
        .limit(30)

      if (cancelled) return

      if (error) {
        setNotificationsLoading(false)
        return
      }

      const rows = data || []
      const actorIds = Array.from(
        new Set(rows.map((notification) => notification.actor_id))
      )

      let actors: DiscoverProfile[] = []

      if (actorIds.length > 0) {
        const { data: actorData } = await supabase
          .from("profiles")
          .select("id, full_name, username, bio, avatar_url, show_public_pnl")
          .in("id", actorIds)

        actors = (actorData || []) as DiscoverProfile[]
      }

      if (!cancelled) {
        setNotifications(
          rows.map((notification) => ({
            ...notification,
            type: "new_follower" as const,
            actor:
              actors.find((actor) => actor.id === notification.actor_id) ||
              null,
          }))
        )
        setNotificationsLoading(false)
      }
    }

    loadNotifications()

    const channel = supabase
      .channel(`dashboard-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        () => loadNotifications()
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  useEffect(() => {
    let cancelled = false

    async function loadScreenshots() {
      const screenshotPaths = Array.from(
        new Set(
          initialTrades
            .map((trade) => trade.screenshot_path)
            .filter((path): path is string => Boolean(path))
        )
      )

      if (screenshotPaths.length === 0) {
        setScreenshotUrls({})
        return
      }

      const results = await Promise.all(
        screenshotPaths.map(async (path) => {
          const { data, error } = await supabase.storage
            .from("trade-screenshots")
            .createSignedUrl(path, 60 * 60)

          if (error || !data?.signedUrl) return null

          return { path, url: data.signedUrl }
        })
      )

      if (cancelled) return

      const urls: Record<string, string> = {}

      results.forEach((result) => {
        if (result) urls[result.path] = result.url
      })

      setScreenshotUrls(urls)
    }

    loadScreenshots()

    return () => {
      cancelled = true
    }
  }, [initialTrades, supabase])

  const firstName = fullName.split(" ")[0]

  // === Addition for typed greeting effect ===
  const [typedGreeting, setTypedGreeting] = useState("")
  const [typingComplete, setTypingComplete] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()

    const greeting =
      hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening"

    const fullGreeting = `${greeting}, ${firstName}`

    let characterIndex = 0
    let typingInterval: number | undefined

    const startDelay = window.setTimeout(() => {
      typingInterval = window.setInterval(() => {
        characterIndex += 1

        setTypedGreeting(
          fullGreeting.slice(0, characterIndex)
        )

        if (characterIndex >= fullGreeting.length) {
          window.clearInterval(typingInterval)
          setTypingComplete(true)
        }
      }, 55)
    }, 250)

    return () => {
      window.clearTimeout(startDelay)

      if (typingInterval !== undefined) {
        window.clearInterval(typingInterval)
      }
    }
  }, [firstName])

  useEffect(() => {
    if (activeView !== "discover") return

    let cancelled = false

    async function loadDiscover() {
      setDiscoverLoading(true)
      setDiscoverError("")

      const [profilesResult, tradesResult, followsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, username, bio, avatar_url, show_public_pnl")
          .neq("id", userId)
          .order("full_name", { ascending: true }),
        supabase
          .from("trades")
          .select("*")
          .eq("visibility", "public")
          .order("trade_date", { ascending: false }),
        supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", userId),
      ])

      if (cancelled) return

      const error =
        profilesResult.error || tradesResult.error || followsResult.error

      if (error) {
        setDiscoverError(
          "Discover needs the supplied Supabase setup before profiles can load."
        )
        setDiscoverLoading(false)
        return
      }

      const profiles = (profilesResult.data || []) as DiscoverProfile[]
      setDiscoverProfiles(profiles)
      setDiscoverTrades((tradesResult.data || []) as Trade[])
      setFollowingIds(
        new Set(
          (followsResult.data || []).map(
            (follow) => follow.following_id as string
          )
        )
      )
      setDiscoverLoading(false)
    }

    loadDiscover()

    return () => {
      cancelled = true
    }
  }, [activeView, supabase, userId])

  useEffect(() => {
    if (activeView !== "settings") return

    let cancelled = false

    async function loadSettings() {
      setSettingsLoading(true)
      setSettingsError("")

      const [profileResult, userResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, username, bio, avatar_url, show_public_pnl")
          .eq("id", userId)
          .maybeSingle(),
        supabase.auth.getUser(),
      ])

      if (cancelled) return

      if (profileResult.error) {
        setSettingsError(profileResult.error.message)
      } else if (profileResult.data) {
        const profile = profileResult.data
        setSettingsName(profile.full_name || fullName)
        setSettingsUsername(profile.username || "")
        setSettingsBio(profile.bio || "")
        setProfileAvatarUrl(profile.avatar_url || "")
        setSettingsAvatarPreview(profile.avatar_url || "")
        setSettingsShowPublicPnl(profile.show_public_pnl !== false)
      }

      setSettingsEmail(userResult.data.user?.email || "")

      setSettingsLoading(false)
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [activeView, fullName, supabase, userId])

  useEffect(() => {
    let cancelled = false

    async function loadCurrentAvatar() {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .maybeSingle()

      if (!cancelled && data?.avatar_url) {
        setProfileAvatarUrl(data.avatar_url)
        setSettingsAvatarPreview(data.avatar_url)
      }
    }

    loadCurrentAvatar()

    return () => {
      cancelled = true
    }
  }, [supabase, userId])
  // === End addition for typed greeting effect ===

  const calendarWeeks = useMemo(() => {
    const firstCalendarDay = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: 1,
    })

    const lastCalendarDay = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: 1,
    })

    const allCalendarDays = eachDayOfInterval({
      start: firstCalendarDay,
      end: lastCalendarDay,
    })

    return Array.from(
      { length: Math.ceil(allCalendarDays.length / 7) },
      (_, weekIndex) => {
        const days = allCalendarDays.slice(
          weekIndex * 7,
          weekIndex * 7 + 7
        )

        const weekTrades = days
          .filter(
            (day) =>
              day.getDay() !== 6 &&
              isSameMonth(day, currentMonth)
          )
          .flatMap((day) => {
            const dateKey = format(day, "yyyy-MM-dd")
            return initialTrades.filter(
              (trade) => trade.trade_date === dateKey
            )
          })

        const latestTradeByDate = new Map<string, Trade>()

        weekTrades.forEach((trade) => {
          const existingTrade = latestTradeByDate.get(trade.trade_date)

          if (
            !existingTrade ||
            new Date(trade.created_at).getTime() >
              new Date(existingTrade.created_at).getTime()
          ) {
            latestTradeByDate.set(trade.trade_date, trade)
          }
        })

        const totalPnl = Array.from(latestTradeByDate.values()).reduce(
          (total, trade) => total + Number(trade.pnl || 0),
          0
        )

        return {
          days,
          totalPnl,
          hasTrades: latestTradeByDate.size > 0,
        }
      }
    ).filter(({ days }) =>
      days.some((day) => isSameMonth(day, currentMonth))
    )
  }, [currentMonth, initialTrades])

  const monthlyTrades = useMemo(() => {
    const monthKey = format(currentMonth, "yyyy-MM")

    const tradesFromMonth = initialTrades.filter((trade) =>
      trade.trade_date.startsWith(monthKey)
    )

    const latestTradeByDate = new Map<string, Trade>()

    tradesFromMonth.forEach((trade) => {
      const existingTrade = latestTradeByDate.get(trade.trade_date)

      if (
        !existingTrade ||
        new Date(trade.created_at).getTime() >
          new Date(existingTrade.created_at).getTime()
      ) {
        latestTradeByDate.set(trade.trade_date, trade)
      }
    })

    return Array.from(latestTradeByDate.values())
  }, [initialTrades, currentMonth])

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd")

  const selectedTrades = initialTrades.filter(
    (trade) => trade.trade_date === selectedDateKey
  )

  const totalPnl = monthlyTrades.reduce(
    (total, trade) => total + Number(trade.pnl),
    0
  )

  const winningTrades = monthlyTrades.filter(
    (trade) => Number(trade.pnl) > 0
  )

  const losingTrades = monthlyTrades.filter(
    (trade) => Number(trade.pnl) < 0
  )

  const winRate =
    winningTrades.length + losingTrades.length > 0
      ? Math.round(
          (winningTrades.length /
            (winningTrades.length + losingTrades.length)) *
            100
        )
      : 0

  const grossProfit = winningTrades.reduce(
    (total, trade) => total + Number(trade.pnl),
    0
  )

  const grossLoss = Math.abs(
    losingTrades.reduce(
      (total, trade) => total + Number(trade.pnl),
      0
    )
  )

  const profitFactor =
    grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : "—"

  const ratedTrades = monthlyTrades.filter(
    (trade) => trade.followed_plan !== null
  )

  const planFollowed =
    ratedTrades.length > 0
      ? Math.round(
          (ratedTrades.filter((trade) => trade.followed_plan).length /
            ratedTrades.length) *
            100
        )
      : 0

  function openTradeForm(date = new Date(), trade?: Trade) {
    setSelectedDate(date)
    setCurrentMonth(date)
    setScreenshot(null)
    setFormError("")

    if (trade) {
      setEditingTrade(trade)

      setForm({
        pnl: String(trade.pnl),
        instrument: trade.instrument || "NQ",
        direction: trade.direction || "long",
        contracts: String(trade.contracts || 1),
        setup: trade.setup || "",
        journal: trade.journal || "",
        emotion: trade.emotion || "Focused",
        followedPlan: trade.followed_plan === false ? "no" : "yes",
        executionRating: trade.execution_rating || "Good execution",
        visibility: trade.visibility || "private",
      })
    } else {
      setEditingTrade(null)
      setForm(initialForm)
    }

    setFormOpen(true)
  }

  async function saveTrade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setFormError("")

    let screenshotPath = editingTrade?.screenshot_path || null
    let newlyUploadedPath: string | null = null

    if (screenshot) {
      const safeName = screenshot.name.replace(/[^a-zA-Z0-9._-]/g, "-")
      newlyUploadedPath = `${userId}/${crypto.randomUUID()}-${safeName}`
      screenshotPath = newlyUploadedPath

      const { error: uploadError } = await supabase.storage
        .from("trade-screenshots")
        .upload(newlyUploadedPath, screenshot)

      if (uploadError) {
        setFormError(uploadError.message)
        setSaving(false)
        return
      }
    }

    const tradeData = {
      user_id: userId,
      trade_date: selectedDateKey,
      pnl: Number(form.pnl),
      instrument: form.instrument.trim().toUpperCase(),
      direction: form.direction,
      contracts: Number(form.contracts),
      setup: form.setup.trim() || null,
      journal: form.journal.trim() || null,
      emotion: form.emotion,
      followed_plan: form.followedPlan === "yes",
      execution_rating: form.executionRating,
      visibility: form.visibility,
      screenshot_path: screenshotPath,
    }

    const { error } = editingTrade
      ? await supabase
          .from("trades")
          .update(tradeData)
          .eq("id", editingTrade.id)
          .eq("user_id", userId)
      : await supabase.from("trades").insert(tradeData)

    if (error) {
      if (newlyUploadedPath) {
        await supabase.storage
          .from("trade-screenshots")
          .remove([newlyUploadedPath])
      }

      setFormError(error.message)
      setSaving(false)
      return
    }

    if (
      editingTrade?.screenshot_path &&
      newlyUploadedPath &&
      editingTrade.screenshot_path !== newlyUploadedPath
    ) {
      await supabase.storage
        .from("trade-screenshots")
        .remove([editingTrade.screenshot_path])
    }

    setSaving(false)
    setFormOpen(false)
    setEditingTrade(null)
    setScreenshot(null)

    router.refresh()
  }

  async function deleteTrade(trade: Trade) {
    const confirmed = window.confirm(
      `Delete this ${trade.instrument || "trade"} entry? This cannot be undone.`
    )

    if (!confirmed) return

    setDeletingTradeId(trade.id)

    const { error } = await supabase
      .from("trades")
      .delete()
      .eq("id", trade.id)
      .eq("user_id", userId)

    if (error) {
      window.alert(error.message)
      setDeletingTradeId(null)
      return
    }

    if (trade.screenshot_path) {
      await supabase.storage
        .from("trade-screenshots")
        .remove([trade.screenshot_path])
    }

    setDeletingTradeId(null)
    router.refresh()
  }

  function getDailyPnl(date: Date) {
    const dateKey = format(date, "yyyy-MM-dd")

    return initialTrades
      .filter((trade) => trade.trade_date === dateKey)
      .reduce((total, trade) => total + Number(trade.pnl), 0)
  }

  const filteredJournalTrades = useMemo(() => {
    const search = journalSearch.trim().toLowerCase()

    return [...initialTrades]
      .filter((trade) => {
        const pnl = Number(trade.pnl)
        const matchesResult =
          journalResult === "all" ||
          (journalResult === "wins" && pnl > 0) ||
          (journalResult === "losses" && pnl < 0) ||
          (journalResult === "breakeven" && pnl === 0)

        const matchesSearch =
          !search ||
          [
            trade.instrument,
            trade.setup,
            trade.journal,
            trade.emotion,
            trade.execution_rating,
          ].some((value) => value?.toLowerCase().includes(search))

        return matchesResult && matchesSearch
      })
      .sort(
        (a, b) =>
          new Date(b.trade_date).getTime() -
          new Date(a.trade_date).getTime()
      )
  }, [initialTrades, journalResult, journalSearch])

  const filteredLedgerTrades = useMemo(() => {
    const search = tradeSearch.trim().toLowerCase()

    return [...initialTrades]
      .filter((trade) => {
        const pnl = Number(trade.pnl)
        const matchesSearch =
          !search ||
          [trade.instrument, trade.setup, trade.journal].some((value) =>
            value?.toLowerCase().includes(search)
          )
        const matchesResult =
          tradeResult === "all" ||
          (tradeResult === "wins" && pnl > 0) ||
          (tradeResult === "losses" && pnl < 0) ||
          (tradeResult === "breakeven" && pnl === 0)
        const matchesDirection =
          tradeDirection === "all" || trade.direction === tradeDirection
        const matchesPlan =
          tradePlan === "all" ||
          (tradePlan === "followed" && trade.followed_plan === true) ||
          (tradePlan === "missed" && trade.followed_plan === false)

        return (
          matchesSearch &&
          matchesResult &&
          matchesDirection &&
          matchesPlan
        )
      })
      .sort(
        (a, b) =>
          new Date(b.trade_date).getTime() -
          new Date(a.trade_date).getTime()
      )
  }, [
    initialTrades,
    tradeDirection,
    tradePlan,
    tradeResult,
    tradeSearch,
  ])

  const ledgerStats = useMemo(() => {
    const wins = initialTrades.filter((trade) => Number(trade.pnl) > 0)
    const losses = initialTrades.filter((trade) => Number(trade.pnl) < 0)
    const averageWinner = wins.length
      ? wins.reduce((sum, trade) => sum + Number(trade.pnl), 0) /
        wins.length
      : 0
    const averageLoser = losses.length
      ? losses.reduce((sum, trade) => sum + Number(trade.pnl), 0) /
        losses.length
      : 0

    const pnlByInstrument = new Map<string, number>()
    initialTrades.forEach((trade) => {
      const instrument = trade.instrument || "Other"
      pnlByInstrument.set(
        instrument,
        (pnlByInstrument.get(instrument) || 0) + Number(trade.pnl)
      )
    })

    const bestInstrument = [...pnlByInstrument.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0]

    return {
      total: initialTrades.length,
      averageWinner,
      averageLoser,
      bestInstrument,
    }
  }, [initialTrades])

  const discoverCards = useMemo(() => {
    const search = discoverSearch.trim().toLowerCase()

    return discoverProfiles
      .filter((profile) =>
        !search
          ? true
          : [profile.full_name, profile.username, profile.bio].some((value) =>
              value?.toLowerCase().includes(search)
            )
      )
      .map((profile) => {
        const publicTrades = discoverTrades.filter(
          (trade) => trade.user_id === profile.id
        )
        const totalPnl = publicTrades.reduce(
          (sum, trade) => sum + Number(trade.pnl),
          0
        )
        const decidedTrades = publicTrades.filter(
          (trade) => Number(trade.pnl) !== 0
        )
        const winRate = decidedTrades.length
          ? Math.round(
              (decidedTrades.filter((trade) => Number(trade.pnl) > 0).length /
                decidedTrades.length) *
                100
            )
          : 0

        return { profile, publicTrades, totalPnl, winRate }
      })
      .sort((a, b) => b.publicTrades.length - a.publicTrades.length)
  }, [discoverProfiles, discoverSearch, discoverTrades])

  const globalSearchResults = useMemo(() => {
    const search = globalSearch.trim().toLowerCase()

    if (!search) {
      return {
        trades: [] as Trade[],
        profiles: [] as DiscoverProfile[],
      }
    }

    const trades = initialTrades
      .filter((trade) =>
        [
          trade.instrument,
          trade.setup,
          trade.journal,
          trade.emotion,
          trade.direction,
          trade.trade_date,
        ].some((value) => String(value || "").toLowerCase().includes(search))
      )
      .slice(0, 6)

    const profiles = globalProfiles
      .filter((profile) =>
        [profile.full_name, profile.username, profile.bio].some((value) =>
          String(value || "").toLowerCase().includes(search)
        )
      )
      .slice(0, 5)

    return { trades, profiles }
  }, [globalProfiles, globalSearch, initialTrades])

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.read_at
  ).length

  function closeHeaderPanels() {
    setGlobalSearchOpen(false)
    setNotificationsOpen(false)
  }

  function openTradeSearchResult(trade: Trade) {
    setSelectedLedgerTrade(trade)
    setTradeSearch("")
    setActiveView("trades")
    closeHeaderPanels()
  }

  function openProfileSearchResult(profile: DiscoverProfile) {
    setSelectedDiscoverProfile(profile)
    setActiveView("discover")
    closeHeaderPanels()
  }

  async function markNotificationRead(notification: DashboardNotification) {
    if (!notification.read_at) {
      const readAt = new Date().toISOString()

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, read_at: readAt } : item
        )
      )

      await supabase
        .from("notifications")
        .update({ read_at: readAt })
        .eq("id", notification.id)
        .eq("recipient_id", userId)
    }

    if (notification.actor) {
      openProfileSearchResult(notification.actor)
    } else {
      setNotificationsOpen(false)
    }
  }

  async function markAllNotificationsRead() {
    const readAt = new Date().toISOString()

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read_at: notification.read_at || readAt,
      }))
    )

    await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("recipient_id", userId)
      .is("read_at", null)
  }

  async function toggleFollow(profileId: string) {
    setFollowLoadingId(profileId)
    const isFollowing = followingIds.has(profileId)

    const { error } = isFollowing
      ? await supabase
          .from("follows")
          .delete()
          .eq("follower_id", userId)
          .eq("following_id", profileId)
      : await supabase.from("follows").insert({
          follower_id: userId,
          following_id: profileId,
        })

    if (!error) {
      setFollowingIds((current) => {
        const next = new Set(current)
        if (isFollowing) next.delete(profileId)
        else next.add(profileId)
        return next
      })
    } else {
      setDiscoverError(error.message)
    }

    setFollowLoadingId(null)
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSettingsSaving(true)
    setSettingsMessage("")
    setSettingsError("")

    const cleanUsername = settingsUsername
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")

    let avatarUrl = profileAvatarUrl || null

    if (settingsAvatarFile) {
      const extension =
        settingsAvatarFile.name.split(".").pop()?.toLowerCase() || "jpg"
      const avatarPath = `${userId}/avatar.${extension}`

      const { error: uploadError } = await supabase.storage
        .from("profile-avatars")
        .upload(avatarPath, settingsAvatarFile, {
          upsert: true,
          contentType: settingsAvatarFile.type,
          cacheControl: "3600",
        })

      if (uploadError) {
        setSettingsError(uploadError.message)
        setSettingsSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile-avatars")
        .getPublicUrl(avatarPath)

      avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: settingsName.trim(),
      username: cleanUsername || null,
      bio: settingsBio.trim() || null,
      avatar_url: avatarUrl,
      show_public_pnl: settingsShowPublicPnl,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      setSettingsError(
        error.code === "23505"
          ? "That username is already taken."
          : error.message
      )
    } else {
      setSettingsUsername(cleanUsername)
      setProfileAvatarUrl(avatarUrl || "")
      setSettingsAvatarPreview(avatarUrl || "")
      setSettingsAvatarFile(null)
      setSettingsMessage("Your profile has been updated.")
      router.refresh()
    }

    setSettingsSaving(false)
  }

  async function savePrivacy() {
    setSettingsSaving(true)
    setSettingsMessage("")
    setSettingsError("")

    const { error } = await supabase
      .from("profiles")
      .update({
        show_public_pnl: settingsShowPublicPnl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) setSettingsError(error.message)
    else setSettingsMessage("Your privacy settings have been saved.")

    setSettingsSaving(false)
  }

  async function updateAccountEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSecuritySaving(true)
    setSettingsMessage("")
    setSettingsError("")

    const { error } = await supabase.auth.updateUser({
      email: settingsEmail.trim(),
    })

    if (error) setSettingsError(error.message)
    else {
      setSettingsMessage(
        "Check your new email address to confirm the change."
      )
    }

    setSecuritySaving(false)
  }

  async function updateAccountPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSettingsMessage("")
    setSettingsError("")

    if (newPassword.length < 8) {
      setSettingsError("Your new password must contain at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setSettingsError("The passwords do not match.")
      return
    }

    setSecuritySaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) setSettingsError(error.message)
    else {
      setNewPassword("")
      setConfirmPassword("")
      setSettingsMessage("Your password has been updated.")
    }

    setSecuritySaving(false)
  }

  async function signOutOtherSessions() {
    setSecuritySaving(true)
    setSettingsMessage("")
    setSettingsError("")

    const { error } = await supabase.auth.signOut({ scope: "others" })

    if (error) setSettingsError(error.message)
    else setSettingsMessage("Your other active sessions have been signed out.")

    setSecuritySaving(false)
  }

  async function deleteAccount() {
    if (deleteConfirmation !== "DELETE") return

    setDeletingAccount(true)
    setSettingsError("")

    const response = await fetch("/api/account", {
      method: "DELETE",
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      setSettingsError(
        result?.error || "Your account could not be deleted."
      )
      setDeletingAccount(false)
      setDeleteDialogOpen(false)
      return
    }

    await supabase.auth.signOut({ scope: "local" })
    window.location.assign("/?account=deleted")
  }

  async function downloadJournalImage(trade: Trade) {
    setJournalDownloadLoading(true)
    setJournalDownloadError("")

    try {
      const escapeXml = (value: string) =>
        value
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;")
          .replace(/'/g, "&apos;")

      const wrapLines = (value: string, maximumLength = 48) => {
        const words = value.trim().split(/\s+/).filter(Boolean)
        const lines: string[] = []
        let line = ""

        words.forEach((word) => {
          const nextLine = line ? `${line} ${word}` : word
          if (nextLine.length > maximumLength && line) {
            lines.push(line)
            line = word
          } else {
            line = nextLine
          }
        })

        if (line) lines.push(line)
        return lines.length ? lines : ["No journal notes recorded."]
      }

      const blobToDataUrl = (blob: Blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error("Could not read the screenshot."))
          reader.readAsDataURL(blob)
        })

      const fetchAsDataUrl = async (url: string) => {
        const response = await fetch(url)
        if (!response.ok) return ""
        return blobToDataUrl(await response.blob())
      }

      const screenshotUrl = trade.screenshot_path
        ? screenshotUrls[trade.screenshot_path]
        : ""
      const [screenshotDataUrl, logoDataUrl, avatarDataUrl] = await Promise.all([
        screenshotUrl ? fetchAsDataUrl(screenshotUrl) : Promise.resolve(""),
        fetchAsDataUrl(`${window.location.origin}/trademirrorlogo.png`),
        profileAvatarUrl
          ? fetchAsDataUrl(profileAvatarUrl)
          : Promise.resolve(""),
      ])

      const journalLines = wrapLines(
        trade.journal || "No journal notes recorded.",
        68
      )
      const setupLines = wrapLines(
        trade.setup || "No setup recorded.",
        64
      )
      const imageWidth = 1200
      const contentX = 62
      const contentWidth = 1076
      const screenshotY = 178
      const screenshotHeight = 520
      const tradeCardY = screenshotY + screenshotHeight + 38
      const tradeCardHeight = 140
      const setupCardY = tradeCardY + tradeCardHeight + 24
      const setupCardHeight = Math.max(126, 82 + setupLines.length * 31)
      const journalCardY = setupCardY + setupCardHeight + 24
      const journalCardHeight = Math.max(260, 94 + journalLines.length * 32)
      const footerY = journalCardY + journalCardHeight + 66
      const imageHeight = footerY + 68
      const pnl = Number(trade.pnl)
      const pnlText = `${pnl > 0 ? "+" : pnl < 0 ? "-" : ""}$${Math.abs(
        pnl
      ).toLocaleString()}`
      const pnlColor = pnl < 0 ? "#ff7777" : "#64dda4"
      const position = `${trade.direction || "No direction"} · ${
        trade.contracts || 1
      } ${trade.contracts === 1 ? "contract" : "contracts"}`
      const username =
        settingsUsername.trim() ||
        fullName.toLowerCase().replace(/[^a-z0-9_]+/g, "") ||
        "trader"

      const textLines = (
        lines: string[],
        x: number,
        firstY: number,
        color = "#c7d1dc",
        fontSize = 25,
        lineHeight = 32
      ) =>
        lines
          .map(
            (line, index) =>
              `<text x="${x}" y="${firstY + index * lineHeight}" fill="${color}" font-size="${fontSize}" font-family="Arial, sans-serif">${escapeXml(line)}</text>`
          )
          .join("")

      const logoMarkup = logoDataUrl
        ? `<image href="${logoDataUrl}" x="62" y="38" width="270" height="70" preserveAspectRatio="xMinYMid meet"/>`
        : `<text x="62" y="82" fill="#f4f7fb" font-size="42" font-weight="700" font-family="Arial, sans-serif">TradeMirror</text>`
      const avatarMarkup = avatarDataUrl
        ? `<image href="${avatarDataUrl}" x="62" y="${footerY - 24}" width="48" height="48" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)"/>`
        : `<circle cx="86" cy="${footerY}" r="24" fill="#1c3852"/><text x="86" y="${footerY + 8}" text-anchor="middle" fill="#b9d5f5" font-size="23" font-weight="700" font-family="Arial, sans-serif">${escapeXml(firstName.charAt(0).toUpperCase())}</text>`
      const screenshotMarkup = screenshotDataUrl
        ? `<image href="${screenshotDataUrl}" x="${contentX}" y="${screenshotY}" width="${contentWidth}" height="${screenshotHeight}" preserveAspectRatio="xMidYMid meet" clip-path="url(#shotClip)"/>`
        : `<rect x="${contentX}" y="${screenshotY}" width="${contentWidth}" height="${screenshotHeight}" fill="#0a1621"/><text x="600" y="${screenshotY + screenshotHeight / 2}" text-anchor="middle" fill="#71859a" font-size="25" font-family="Arial, sans-serif">No trade screenshot added</text>`

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}" viewBox="0 0 ${imageWidth} ${imageHeight}">
          <defs>
            <linearGradient id="background" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#07131f"/><stop offset="1" stop-color="#081723"/></linearGradient>
            <clipPath id="shotClip"><rect x="${contentX}" y="${screenshotY}" width="${contentWidth}" height="${screenshotHeight}" rx="20"/></clipPath>
            <clipPath id="avatarClip"><circle cx="86" cy="${footerY}" r="24"/></clipPath>
          </defs>
          <rect width="1200" height="${imageHeight}" fill="url(#background)"/>
          ${logoMarkup}
          <text x="62" y="121" fill="#7990a8" font-size="17" font-weight="700" letter-spacing="1.2" font-family="Arial, sans-serif">TRADE JOURNAL</text>
          <text x="1138" y="76" text-anchor="end" fill="#9eacbb" font-size="22" font-family="Arial, sans-serif">${escapeXml(format(new Date(`${trade.trade_date}T12:00:00`), "MMMM d, yyyy"))}</text>
          <rect x="${contentX}" y="${screenshotY}" width="${contentWidth}" height="${screenshotHeight}" rx="20" fill="#0d1d2b" stroke="#263c50" stroke-width="2"/>
          ${screenshotMarkup}
          <rect x="${contentX}" y="${tradeCardY}" width="${contentWidth}" height="${tradeCardHeight}" rx="20" fill="#0d1d2b" stroke="#263c50" stroke-width="2"/>
          <text x="94" y="${tradeCardY + 60}" fill="#f3f6fa" font-size="42" font-weight="700" font-family="Arial, sans-serif">${escapeXml(trade.instrument || "Trade")}</text>
          <text x="94" y="${tradeCardY + 103}" fill="#8294a6" font-size="23" font-family="Arial, sans-serif">${escapeXml(position.toLowerCase())}</text>
          <text x="1104" y="${tradeCardY + 78}" text-anchor="end" fill="${pnlColor}" font-size="38" font-weight="700" font-family="Arial, sans-serif">${escapeXml(pnlText)}</text>
          <rect x="${contentX}" y="${setupCardY}" width="${contentWidth}" height="${setupCardHeight}" rx="20" fill="#0d1d2b" stroke="#263c50" stroke-width="2"/>
          <text x="94" y="${setupCardY + 40}" fill="#7590ab" font-size="17" font-weight="700" letter-spacing="1" font-family="Arial, sans-serif">SETUP</text>
          ${textLines(setupLines, 94, setupCardY + 82, "#c7d1dc", 26, 31)}
          <rect x="${contentX}" y="${journalCardY}" width="${contentWidth}" height="${journalCardHeight}" rx="20" fill="#0d1d2b" stroke="#263c50" stroke-width="2"/>
          <text x="94" y="${journalCardY + 42}" fill="#7590ab" font-size="17" font-weight="700" letter-spacing="1" font-family="Arial, sans-serif">JOURNAL REVIEW</text>
          ${textLines(journalLines, 94, journalCardY + 86, "#c7d1dc", 25, 32)}
          ${avatarMarkup}
          <circle cx="86" cy="${footerY}" r="25" fill="none" stroke="#7e9dba" stroke-width="2"/>
          <text x="124" y="${footerY + 8}" fill="#edf3f8" font-size="22" font-weight="700" font-family="Arial, sans-serif">@${escapeXml(username.replace(/^@/, ""))}</text>
          <text x="600" y="${footerY + 7}" text-anchor="middle" fill="#74899e" font-size="18" font-family="Arial, sans-serif">${escapeXml(trade.emotion || "Not recorded")} · ${escapeXml(trade.execution_rating || "Not rated")} · ${trade.followed_plan === false ? "Plan not followed" : "Plan followed"}</text>
          <text x="1138" y="${footerY + 7}" text-anchor="end" fill="#74899e" font-size="18" font-family="Arial, sans-serif">Review the process. Refine the edge.</text>
        </svg>`

      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)
      const image = new Image()

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error("Could not create the journal image."))
        image.src = svgUrl
      })

      const canvas = document.createElement("canvas")
      canvas.width = imageWidth
      canvas.height = imageHeight
      const context = canvas.getContext("2d")
      if (!context) throw new Error("Image downloads are not supported here.")
      context.drawImage(image, 0, 0)
      URL.revokeObjectURL(svgUrl)

      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      )
      if (!pngBlob) throw new Error("Could not create the journal download.")

      const downloadUrl = URL.createObjectURL(pngBlob)
      const link = document.createElement("a")
      const safeInstrument = (trade.instrument || "trade")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
      link.href = downloadUrl
      link.download = `trademirror-${safeInstrument}-${trade.trade_date}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      setJournalDownloadError(
        error instanceof Error
          ? error.message
          : "Could not download this journal entry."
      )
    } finally {
      setJournalDownloadLoading(false)
    }
  }

  return (
    <main className={`app-dashboard dashboard-view-${activeView}`}>
      <header className="dashboard-mobile-header">
        <a href="/" className="dashboard-mobile-brand" aria-label="TradeMirror home">
          <img src="/trademirrorlogo.png" alt="TradeMirror" />
        </a>

        <SignOutButton />
      </header>

      <aside className="dashboard-sidebar">
        <a href="/" className="dashboard-brand dashboard-logo-link">
          <img
            src="/trademirrorlogo.png"
            alt="TradeMirror"
            className="dashboard-logo-image"
          />
        </a>

        <nav className="dashboard-navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = item.view === activeView

            return (
              <button
                className={isActive ? "dashboard-nav-active" : ""}
                key={item.label}
                onClick={() => {
                  if (
                    item.view === "overview" ||
                    item.view === "trades" ||
                    item.view === "journal" ||
                    item.view === "discover" ||
                    item.view === "settings"
                  ) {
                    setActiveView(item.view)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="dashboard-user">
          <div className={`dashboard-avatar ${profileAvatarUrl ? "has-image" : ""}`}>
            {profileAvatarUrl ? (
              <img src={profileAvatarUrl} alt={`${fullName} profile`} />
            ) : (
              firstName.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <strong>{fullName}</strong>
            <span>Free plan</span>
          </div>
        </div>

        <SignOutButton />
      </aside>

      <section className="dashboard-content">
        {activeView === "overview" ? (
          <>
        <header className="dashboard-header">
          <div className="dashboard-greeting">
            <h1 className="typing-greeting">
              {typedGreeting}
              <span
                className={`typing-cursor ${
                  typingComplete ? "typing-cursor-complete" : ""
                }`}
                aria-hidden="true"
              />
            </h1>
            <p
              className={
                typingComplete ? "greeting-subtitle-visible" : ""
              }
            >
              Here’s how your trading is developing.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              className={`dashboard-icon-button ${
                globalSearchOpen ? "dashboard-icon-button-active" : ""
              }`}
              aria-label="Search TradeMirror"
              aria-expanded={globalSearchOpen}
              onClick={() => {
                setGlobalSearchOpen((open) => !open)
                setNotificationsOpen(false)
              }}
            >
              <Search size={19} />
            </button>

            <button
              className={`dashboard-icon-button notification-button ${
                notificationsOpen ? "dashboard-icon-button-active" : ""
              }`}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((open) => !open)
                setGlobalSearchOpen(false)
              }}
            >
              <Bell size={19} />
              {unreadNotificationCount > 0 && (
                <span className="notification-badge">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              className="log-trade-button"
              onClick={() => openTradeForm(new Date())}
            >
              <Plus size={18} />
              Log a trade
            </button>

            {globalSearchOpen && (
              <div className="header-popover global-search-popover">
                <div className="header-popover-heading">
                  <div>
                    <span>SEARCH</span>
                    <strong>Find anything</strong>
                  </div>
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setGlobalSearchOpen(false)}
                  >
                    <X size={17} />
                  </button>
                </div>

                <label className="global-search-input">
                  <Search size={17} />
                  <input
                    type="search"
                    autoFocus
                    placeholder="Search trades, setups, notes, or traders..."
                    value={globalSearch}
                    onChange={(event) => setGlobalSearch(event.target.value)}
                  />
                </label>

                <div className="header-popover-content">
                  {!globalSearch.trim() ? (
                    <div className="header-popover-empty">
                      Start typing to search TradeMirror.
                    </div>
                  ) : globalSearchResults.trades.length === 0 &&
                    globalSearchResults.profiles.length === 0 ? (
                    <div className="header-popover-empty">
                      No matching trades or traders found.
                    </div>
                  ) : (
                    <>
                      {globalSearchResults.trades.length > 0 && (
                        <section className="search-result-section">
                          <span>YOUR TRADES</span>
                          {globalSearchResults.trades.map((trade) => (
                            <button
                              type="button"
                              className="global-search-result"
                              key={trade.id}
                              onClick={() => openTradeSearchResult(trade)}
                            >
                              <div>
                                <strong>{trade.instrument || "Trade"}</strong>
                                <small>
                                  {format(
                                    new Date(`${trade.trade_date}T12:00:00`),
                                    "MMM d, yyyy"
                                  )}
                                  {trade.setup ? ` · ${trade.setup}` : ""}
                                </small>
                              </div>
                              <b
                                className={
                                  Number(trade.pnl) < 0 ? "loss" : "profit"
                                }
                              >
                                {Number(trade.pnl) > 0
                                  ? "+"
                                  : Number(trade.pnl) < 0
                                    ? "-"
                                    : ""}
                                ${Math.abs(Number(trade.pnl)).toLocaleString()}
                              </b>
                            </button>
                          ))}
                        </section>
                      )}

                      {globalSearchResults.profiles.length > 0 && (
                        <section className="search-result-section">
                          <span>TRADERS</span>
                          {globalSearchResults.profiles.map((profile) => (
                            <button
                              type="button"
                              className="global-search-result trader-result"
                              key={profile.id}
                              onClick={() => openProfileSearchResult(profile)}
                            >
                              <span className="header-result-avatar">
                                {profile.avatar_url ? (
                                  <img
                                    src={profile.avatar_url}
                                    alt=""
                                  />
                                ) : (
                                  (profile.full_name || profile.username || "T")
                                    .charAt(0)
                                    .toUpperCase()
                                )}
                              </span>
                              <div>
                                <strong>{profile.full_name || "Trader"}</strong>
                                <small>
                                  {profile.username
                                    ? `@${profile.username}`
                                    : "Public trader"}
                                </small>
                              </div>
                            </button>
                          ))}
                        </section>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {notificationsOpen && (
              <div className="header-popover notifications-popover">
                <div className="header-popover-heading">
                  <div>
                    <span>ACTIVITY</span>
                    <strong>Notifications</strong>
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      className="mark-all-read"
                      onClick={markAllNotificationsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="header-popover-content">
                  {notificationsLoading ? (
                    <div className="header-popover-empty">
                      <LoaderCircle className="auth-spinner" size={18} />
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="header-popover-empty">
                      <Bell size={22} />
                      You have no notifications yet.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        type="button"
                        className={`notification-item ${
                          notification.read_at ? "" : "notification-unread"
                        }`}
                        key={notification.id}
                        onClick={() => markNotificationRead(notification)}
                      >
                        <span className="header-result-avatar">
                          {notification.actor?.avatar_url ? (
                            <img
                              src={notification.actor.avatar_url}
                              alt=""
                            />
                          ) : (
                            (
                              notification.actor?.full_name ||
                              notification.actor?.username ||
                              "T"
                            )
                              .charAt(0)
                              .toUpperCase()
                          )}
                        </span>
                        <span>
                          <strong>
                            {notification.actor?.full_name ||
                              notification.actor?.username ||
                              "A trader"}
                          </strong>{" "}
                          followed you.
                          <small>
                            {format(new Date(notification.created_at), "MMM d, h:mm a")}
                          </small>
                        </span>
                        {!notification.read_at && (
                          <i aria-label="Unread notification" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="dashboard-metrics">
          <article>
            <div>
              <span>Monthly P&amp;L</span>
              <strong className={totalPnl < 0 ? "loss" : "profit"}>
                {totalPnl >= 0 ? "+" : "-"}$
                {Math.abs(totalPnl).toLocaleString()}
              </strong>
            </div>

            <TrendingUp size={21} />
          </article>

          <article>
            <div>
              <span>Win rate</span>
              <strong>{winRate}%</strong>
            </div>

            <div className="metric-mini-bar">
              <span style={{ width: `${winRate}%` }} />
            </div>
          </article>

          <article>
            <div>
              <span>Profit factor</span>
              <strong>{profitFactor}</strong>
            </div>

            <BarChart3 size={21} />
          </article>

          <article>
            <div>
              <span>Plan followed</span>
              <strong>{planFollowed}%</strong>
            </div>

            <div className="metric-mini-bar">
              <span style={{ width: `${planFollowed}%` }} />
            </div>
          </article>
        </section>

        <section className="dashboard-main-grid">
          <article className="dashboard-calendar">
            <div className="dashboard-card-heading">
              <div>
                <span>P&amp;L CALENDAR</span>
                <h2>{format(currentMonth, "MMMM yyyy")}</h2>
              </div>

              <div className="calendar-month-controls">
                <button
                  aria-label="Previous month"
                  onClick={() => {
                    const previousMonth = subMonths(currentMonth, 1)
                    setCurrentMonth(previousMonth)
                    setSelectedDate(
                      getFirstWeekdayOfMonth(previousMonth)
                    )
                  }}
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  onClick={() => {
                    const today = new Date()
                    setCurrentMonth(today)
                    setSelectedDate(today)
                  }}
                >
                  Today
                </button>

                <button
                  aria-label="Next month"
                  onClick={() => {
                    const nextMonth = addMonths(currentMonth, 1)
                    setCurrentMonth(nextMonth)
                    setSelectedDate(getFirstWeekdayOfMonth(nextMonth))
                  }}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>

            <div className="dashboard-weekdays">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "WEEK P&L"].map(
                (day) => (
                  <span key={day}>{day}</span>
                )
              )}
            </div>

            <div className="dashboard-calendar-grid">
              {calendarWeeks.map(
                ({ days, totalPnl, hasTrades }, weekIndex) => (
                  <div
                    className="dashboard-calendar-week"
                    key={days[0]?.toISOString() || weekIndex}
                  >
                    {days.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd")
                      const isCurrentMonthDay = isSameMonth(
                        day,
                        currentMonth
                      )
                      const isSaturdayDay = day.getDay() === 6
                      const isLoggableDay =
                        isCurrentMonthDay && !isSaturdayDay

                      const dayTrades = isLoggableDay
                        ? initialTrades.filter(
                            (trade) => trade.trade_date === dateKey
                          )
                        : []

                      const latestTrade = [...dayTrades].sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )[0]

                      const dayPnl = latestTrade
                        ? Number(latestTrade.pnl)
                        : 0

                      const selected =
                        isLoggableDay && dateKey === selectedDateKey

                      return (
                        <button
                          className={`dashboard-day ${
                            selected ? "dashboard-selected-day" : ""
                          } ${
                            !isCurrentMonthDay
                              ? "outside-month"
                              : ""
                          } ${
                            isSaturdayDay
                              ? "saturday-disabled"
                              : ""
                          }`}
                          key={day.toISOString()}
                          disabled={!isLoggableDay}
                          onClick={() => {
                            if (isLoggableDay) setSelectedDate(day)
                          }}
                          onDoubleClick={() => {
                            if (isLoggableDay) openTradeForm(day)
                          }}
                        >
                          <span>{format(day, "d")}</span>

                          {latestTrade && (
                            <span
                              className={
                                dayPnl < 0
                                  ? "calendar-day-pnl loss"
                                  : dayPnl > 0
                                    ? "calendar-day-pnl profit"
                                    : "calendar-day-pnl"
                              }
                            >
                              {dayPnl > 0 ? "+" : dayPnl < 0 ? "-" : ""}$
                              {Math.abs(dayPnl).toLocaleString("en-US", {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          )}

                          {dayTrades.length === 0 &&
                            isLoggableDay && (
                              <small
                                className="add-day-entry"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  openTradeForm(day)
                                }}
                              >
                                <Plus size={13} />
                              </small>
                            )}
                        </button>
                      )
                    })}

                    <div
                      className={`dashboard-week-total ${
                        !hasTrades
                          ? "empty"
                          : totalPnl > 0
                            ? "profit"
                            : totalPnl < 0
                              ? "loss"
                              : "neutral"
                      }`}
                    >
                      <span>WEEK P&amp;L</span>
                      <strong>
                        {!hasTrades
                          ? "—"
                          : `${totalPnl > 0 ? "+" : totalPnl < 0 ? "-" : ""}$${Math.abs(
                              totalPnl
                            ).toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}`}
                      </strong>
                    </div>
                  </div>
                )
              )}
            </div>
          </article>

          <aside className="dashboard-review">
            <div className="dashboard-card-heading">
              <div>
                <span>SELECTED DAY</span>
                <h2>{format(selectedDate, "MMMM d, yyyy")}</h2>
              </div>

              <BookOpen size={20} />
            </div>

            {selectedTrades.length === 0 ? (
              <div className="empty-day-review">
                <CalendarDays size={28} />
                <h3>No trades recorded</h3>
                <p>Add a trade or journal entry for this date.</p>

                <button onClick={() => openTradeForm(selectedDate)}>
                  <Plus size={16} />
                  Add trade
                </button>
              </div>
            ) : (
              <div className="selected-trade-list">
                {selectedTrades.map((trade) => (
                  <article key={trade.id}>
                    <div>
                      <strong>{trade.instrument || "Trade"}</strong>
                      <span>
                        {trade.direction || "No direction"} ·{" "}
                        {trade.contracts || 1} contract
                      </span>
                    </div>

                    <b
                      className={
                        Number(trade.pnl) >= 0 ? "profit" : "loss"
                      }
                    >
                      {Number(trade.pnl) >= 0 ? "+" : "-"}$
                      {Math.abs(Number(trade.pnl)).toLocaleString()}
                    </b>

                    {trade.emotion && (
                      <small>{trade.emotion}</small>
                    )}

                    {trade.journal && <p>{trade.journal}</p>}

                    {trade.screenshot_path &&
                      screenshotUrls[trade.screenshot_path] && (
                        <button
                          type="button"
                          className="trade-screenshot-button"
                          onClick={() =>
                            setPreviewScreenshot({
                              url: screenshotUrls[trade.screenshot_path!],
                              instrument: trade.instrument || "Trade",
                            })
                          }
                        >
                          <img
                            src={screenshotUrls[trade.screenshot_path]}
                            alt={`${trade.instrument || "Trade"} chart screenshot`}
                          />
                          <span>Click to enlarge</span>
                        </button>
                      )}

                    <div className="trade-card-actions">
                      <button
                        type="button"
                        onClick={() =>
                          openTradeForm(
                            new Date(`${trade.trade_date}T12:00:00`),
                            trade
                          )
                        }
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-trade-button"
                        disabled={deletingTradeId === trade.id}
                        onClick={() => deleteTrade(trade)}
                      >
                        <Trash2 size={14} />
                        {deletingTradeId === trade.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}

                <button
                  className="add-another-trade"
                  onClick={() => openTradeForm(selectedDate)}
                >
                  <Plus size={15} />
                  Add another trade
                </button>
              </div>
            )}
          </aside>
        </section>
          </>
        ) : activeView === "trades" ? (
          <section className="trades-view">
            <header className="trades-page-header">
              <div>
                <span className="trades-page-eyebrow">TRADE LEDGER</span>
                <h1>Every trade, clearly accounted for.</h1>
                <p>
                  Search, compare, and manage the trades behind your
                  performance.
                </p>
              </div>

              <button
                className="log-trade-button"
                onClick={() => openTradeForm(new Date())}
              >
                <Plus size={18} /> Log a trade
              </button>
            </header>

            <section className="trades-summary-grid">
              <article>
                <span>Total trades</span>
                <strong>{ledgerStats.total}</strong>
                <small>All recorded entries</small>
              </article>
              <article>
                <span>Average winner</span>
                <strong className="profit">
                  +${Math.round(ledgerStats.averageWinner).toLocaleString()}
                </strong>
                <small>Across profitable trades</small>
              </article>
              <article>
                <span>Average loser</span>
                <strong className="loss">
                  -${Math.abs(
                    Math.round(ledgerStats.averageLoser)
                  ).toLocaleString()}
                </strong>
                <small>Across losing trades</small>
              </article>
              <article>
                <span>Best instrument</span>
                <strong>{ledgerStats.bestInstrument?.[0] || "—"}</strong>
                <small>
                  {ledgerStats.bestInstrument
                    ? `${ledgerStats.bestInstrument[1] >= 0 ? "+" : "-"}$${Math.abs(
                        ledgerStats.bestInstrument[1]
                      ).toLocaleString()} net P&L`
                    : "No trades yet"}
                </small>
              </article>
            </section>

            <div className="trades-toolbar">
              <label className="trades-search">
                <Search size={17} />
                <input
                  type="search"
                  placeholder="Search symbol, setup, or notes..."
                  value={tradeSearch}
                  onChange={(event) => setTradeSearch(event.target.value)}
                />
              </label>

              <label>
                <select
                  value={tradeResult}
                  onChange={(event) => setTradeResult(event.target.value)}
                >
                  <option value="all">All results</option>
                  <option value="wins">Wins</option>
                  <option value="losses">Losses</option>
                  <option value="breakeven">Breakeven</option>
                </select>
              </label>

              <label>
                <select
                  value={tradeDirection}
                  onChange={(event) => setTradeDirection(event.target.value)}
                >
                  <option value="all">All sides</option>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </label>

              <label>
                <select
                  value={tradePlan}
                  onChange={(event) => setTradePlan(event.target.value)}
                >
                  <option value="all">Any execution</option>
                  <option value="followed">Plan followed</option>
                  <option value="missed">Plan missed</option>
                </select>
              </label>
            </div>

            <div className="trades-ledger-layout">
              <div className="trades-table-card">
                <div className="trades-table-scroll">
                  <div className="trades-table-header">
                    <span>Date</span>
                    <span>Instrument</span>
                    <span>Side</span>
                    <span>Contracts</span>
                    <span>Setup</span>
                    <span>Plan</span>
                    <span>P&amp;L</span>
                  </div>

                  {filteredLedgerTrades.length === 0 ? (
                    <div className="trades-empty-state">
                      <BarChart3 size={28} />
                      <h2>No trades found</h2>
                      <p>Change your filters or log a new trade.</p>
                    </div>
                  ) : (
                    filteredLedgerTrades.map((trade) => {
                      const pnl = Number(trade.pnl)

                      return (
                        <button
                          type="button"
                          className={`trades-table-row ${
                            selectedLedgerTrade?.id === trade.id
                              ? "trades-table-row-active"
                              : ""
                          }`}
                          key={trade.id}
                          onClick={() => setSelectedLedgerTrade(trade)}
                        >
                          <span>
                            {format(
                              new Date(`${trade.trade_date}T12:00:00`),
                              "MMM d, yyyy"
                            )}
                          </span>
                          <strong>{trade.instrument || "—"}</strong>
                          <span className="trade-side-pill">
                            {trade.direction || "—"}
                          </span>
                          <span>{trade.contracts || 1}</span>
                          <span className="trade-setup-cell">
                            {trade.setup || "—"}
                          </span>
                          <span
                            className={`trade-plan-status ${
                              trade.followed_plan ? "followed" : "missed"
                            }`}
                          >
                            {trade.followed_plan ? "Followed" : "Missed"}
                          </span>
                          <b className={pnl < 0 ? "loss" : "profit"}>
                            {pnl > 0 ? "+" : pnl < 0 ? "-" : ""}$
                            {Math.abs(pnl).toLocaleString()}
                          </b>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              <aside className="trade-ledger-detail">
                {selectedLedgerTrade ? (
                  <>
                    <div className="trade-ledger-detail-heading">
                      <div>
                        <span>TRADE DETAILS</span>
                        <h2>{selectedLedgerTrade.instrument || "Trade"}</h2>
                        <p>
                          {format(
                            new Date(
                              `${selectedLedgerTrade.trade_date}T12:00:00`
                            ),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                      <b
                        className={
                          Number(selectedLedgerTrade.pnl) < 0
                            ? "loss"
                            : "profit"
                        }
                      >
                        {Number(selectedLedgerTrade.pnl) > 0
                          ? "+"
                          : Number(selectedLedgerTrade.pnl) < 0
                            ? "-"
                            : ""}
                        ${Math.abs(Number(selectedLedgerTrade.pnl)).toLocaleString()}
                      </b>
                    </div>

                    <dl className="trade-ledger-facts">
                      <div>
                        <dt>Side</dt>
                        <dd>{selectedLedgerTrade.direction || "—"}</dd>
                      </div>
                      <div>
                        <dt>Contracts</dt>
                        <dd>{selectedLedgerTrade.contracts || 1}</dd>
                      </div>
                      <div>
                        <dt>Emotion</dt>
                        <dd>{selectedLedgerTrade.emotion || "—"}</dd>
                      </div>
                      <div>
                        <dt>Execution</dt>
                        <dd>{selectedLedgerTrade.execution_rating || "—"}</dd>
                      </div>
                    </dl>

                    {selectedLedgerTrade.screenshot_path &&
                      screenshotUrls[selectedLedgerTrade.screenshot_path] && (
                        <button
                          type="button"
                          className="trade-ledger-image"
                          onClick={() =>
                            setPreviewScreenshot({
                              url: screenshotUrls[
                                selectedLedgerTrade.screenshot_path!
                              ],
                              instrument:
                                selectedLedgerTrade.instrument || "Trade",
                            })
                          }
                        >
                          <img
                            src={
                              screenshotUrls[
                                selectedLedgerTrade.screenshot_path
                              ]
                            }
                            alt="Trade chart"
                          />
                          <span>View chart</span>
                        </button>
                      )}

                    <div className="trade-ledger-note">
                      <span>SETUP</span>
                      <p>{selectedLedgerTrade.setup || "No setup recorded."}</p>
                    </div>

                    <div className="trade-ledger-actions">
                      <button
                        type="button"
                        onClick={() =>
                          openTradeForm(
                            new Date(
                              `${selectedLedgerTrade.trade_date}T12:00:00`
                            ),
                            selectedLedgerTrade
                          )
                        }
                      >
                        <Pencil size={15} /> Edit
                      </button>
                      <button
                        type="button"
                        className="delete-trade-button"
                        disabled={deletingTradeId === selectedLedgerTrade.id}
                        onClick={() => deleteTrade(selectedLedgerTrade)}
                      >
                        <Trash2 size={15} />
                        {deletingTradeId === selectedLedgerTrade.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="trades-empty-state">
                    <BarChart3 size={28} />
                    <h2>Select a trade</h2>
                    <p>Choose a row to inspect its details.</p>
                  </div>
                )}
              </aside>
            </div>
          </section>
        ) : activeView === "journal" ? (
          <section className="journal-view">
            <header className="journal-page-header">
              <div>
                <span className="journal-page-eyebrow">TRADE JOURNAL</span>
                <h1>Review the decisions behind every trade.</h1>
                <p>
                  Find patterns in your execution, emotions, and setups—not
                  only your P&amp;L.
                </p>
              </div>

              <button
                className="log-trade-button"
                onClick={() => openTradeForm(new Date())}
              >
                <Plus size={18} />
                New entry
              </button>
            </header>

            <div className="journal-toolbar">
              <label className="journal-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search symbol, setup, emotion, or notes..."
                  value={journalSearch}
                  onChange={(event) => setJournalSearch(event.target.value)}
                />
              </label>

              <label className="journal-result-filter">
                <SlidersHorizontal size={17} />
                <select
                  value={journalResult}
                  onChange={(event) => setJournalResult(event.target.value)}
                >
                  <option value="all">All results</option>
                  <option value="wins">Wins</option>
                  <option value="losses">Losses</option>
                  <option value="breakeven">Breakeven</option>
                </select>
              </label>
            </div>

            <div className="journal-workspace">
              <div className="journal-entry-list">
                <div className="journal-list-heading">
                  <span>RECENT ENTRIES</span>
                  <small>{filteredJournalTrades.length} entries</small>
                </div>

                {filteredJournalTrades.length === 0 ? (
                  <div className="journal-empty-state">
                    <BookOpen size={28} />
                    <h2>No journal entries found</h2>
                    <p>Try another filter or add your first entry.</p>
                  </div>
                ) : (
                  filteredJournalTrades.map((trade) => {
                    const pnl = Number(trade.pnl)

                    return (
                      <button
                        type="button"
                        key={trade.id}
                        className={`journal-entry-row ${
                          selectedJournalTrade?.id === trade.id
                            ? "journal-entry-row-active"
                            : ""
                        }`}
                        onClick={() => setSelectedJournalTrade(trade)}
                      >
                        <span
                          className={`journal-result-dot ${
                            pnl < 0 ? "loss" : pnl > 0 ? "profit" : ""
                          }`}
                        />

                        <span className="journal-entry-main">
                          <strong>{trade.instrument || "Trade"}</strong>
                          <small>
                            {format(
                              new Date(`${trade.trade_date}T12:00:00`),
                              "MMM d, yyyy"
                            )}
                            {trade.setup ? ` · ${trade.setup}` : ""}
                          </small>
                        </span>

                        {trade.emotion && (
                          <span className="journal-emotion-pill">
                            {trade.emotion}
                          </span>
                        )}

                        <b className={pnl < 0 ? "loss" : "profit"}>
                          {pnl > 0 ? "+" : pnl < 0 ? "-" : ""}$
                          {Math.abs(pnl).toLocaleString()}
                        </b>
                      </button>
                    )
                  })
                )}
              </div>

              <aside className="journal-detail-panel">
                {selectedJournalTrade ? (
                  <>
                    <div className="journal-detail-heading">
                      <div>
                        <span>SELECTED ENTRY</span>
                        <h2>
                          {format(
                            new Date(
                              `${selectedJournalTrade.trade_date}T12:00:00`
                            ),
                            "MMMM d, yyyy"
                          )}
                        </h2>
                      </div>

                      <b
                        className={
                          Number(selectedJournalTrade.pnl) < 0
                            ? "loss"
                            : "profit"
                        }
                      >
                        {Number(selectedJournalTrade.pnl) > 0
                          ? "+"
                          : Number(selectedJournalTrade.pnl) < 0
                            ? "-"
                            : ""}
                        ${Math.abs(Number(selectedJournalTrade.pnl)).toLocaleString()}
                      </b>
                    </div>

                    <div className="journal-detail-meta">
                      <span>{selectedJournalTrade.instrument || "Trade"}</span>
                      <span>{selectedJournalTrade.direction || "No direction"}</span>
                      <span>
                        {selectedJournalTrade.contracts || 1} contract
                        {selectedJournalTrade.contracts === 1 ? "" : "s"}
                      </span>
                    </div>

                    {selectedJournalTrade.screenshot_path &&
                      screenshotUrls[selectedJournalTrade.screenshot_path] && (
                        <button
                          type="button"
                          className="journal-detail-image"
                          onClick={() =>
                            setPreviewScreenshot({
                              url: screenshotUrls[
                                selectedJournalTrade.screenshot_path!
                              ],
                              instrument:
                                selectedJournalTrade.instrument || "Trade",
                            })
                          }
                        >
                          <img
                            src={
                              screenshotUrls[
                                selectedJournalTrade.screenshot_path
                              ]
                            }
                            alt="Trade chart"
                          />
                          <span>Open screenshot</span>
                        </button>
                      )}

                    <div className="journal-detail-section">
                      <span>SETUP</span>
                      <p>{selectedJournalTrade.setup || "No setup recorded."}</p>
                    </div>

                    <div className="journal-detail-section">
                      <span>REVIEW</span>
                      <p>
                        {selectedJournalTrade.journal ||
                          "No journal notes were added to this trade."}
                      </p>
                    </div>

                    <div className="journal-detail-tags">
                      {selectedJournalTrade.emotion && (
                        <span>{selectedJournalTrade.emotion}</span>
                      )}
                      {selectedJournalTrade.execution_rating && (
                        <span>{selectedJournalTrade.execution_rating}</span>
                      )}
                      <span>
                        {selectedJournalTrade.followed_plan
                          ? "Plan followed"
                          : "Plan not followed"}
                      </span>
                    </div>

                    <div className="journal-detail-actions">
                      <button
                        type="button"
                        disabled={journalDownloadLoading}
                        onClick={() => downloadJournalImage(selectedJournalTrade)}
                      >
                        {journalDownloadLoading ? (
                          <LoaderCircle className="auth-spinner" size={15} />
                        ) : (
                          <Download size={15} />
                        )}
                        {journalDownloadLoading
                          ? "Creating image..."
                          : "Download journal"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openTradeForm(
                            new Date(
                              `${selectedJournalTrade.trade_date}T12:00:00`
                            ),
                            selectedJournalTrade
                          )
                        }
                      >
                        <Pencil size={15} /> Edit entry
                      </button>
                    </div>
                    {journalDownloadError && (
                      <p className="auth-error">{journalDownloadError}</p>
                    )}
                  </>
                ) : (
                  <div className="journal-empty-state">
                    <BookOpen size={28} />
                    <h2>Select an entry</h2>
                    <p>Choose a trade to open its complete review.</p>
                  </div>
                )}
              </aside>
            </div>
          </section>
        ) : activeView === "discover" ? (
          <section className="discover-view">
            {discoverError && (
              <div className="discover-error">{discoverError}</div>
            )}

            {selectedDiscoverProfile ? (() => {
              const profile = selectedDiscoverProfile
              const trades = discoverTrades.filter(
                (trade) => trade.user_id === profile.id
              )
              const monthTrades = trades.filter((trade) =>
                isSameMonth(
                  new Date(`${trade.trade_date}T12:00:00`),
                  new Date()
                )
              )
              const monthPnl = monthTrades.reduce(
                (sum, trade) => sum + Number(trade.pnl),
                0
              )
              const decidedTrades = monthTrades.filter(
                (trade) => Number(trade.pnl) !== 0
              )
              const winRate = decidedTrades.length
                ? Math.round(
                    (decidedTrades.filter((trade) => Number(trade.pnl) > 0)
                      .length /
                      decidedTrades.length) *
                      100
                  )
                : 0
              const planTrades = monthTrades.filter(
                (trade) => trade.followed_plan !== null
              )
              const planRate = planTrades.length
                ? Math.round(
                    (planTrades.filter((trade) => trade.followed_plan).length /
                      planTrades.length) *
                      100
                  )
                : 0

              return (
                <div className="public-profile-page">
                  <button
                    type="button"
                    className="public-profile-back"
                    onClick={() => setSelectedDiscoverProfile(null)}
                  >
                    <ChevronLeft size={18} /> Back to Discover
                  </button>

                  <header className="public-profile-hero">
                    <div className="public-profile-identity">
                      <div className="discover-avatar public-profile-avatar">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="" />
                        ) : (
                          (profile.full_name || profile.username || "T")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>
                      <div>
                        <span className="discover-page-eyebrow">
                          PUBLIC TRADER PROFILE
                        </span>
                        <h1>{profile.full_name || "TradeMirror Trader"}</h1>
                        <p className="public-profile-username">
                          @{profile.username || "trader"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={
                        followingIds.has(profile.id)
                          ? "discover-following-button"
                          : "discover-follow-button"
                      }
                      disabled={followLoadingId === profile.id}
                      onClick={() => toggleFollow(profile.id)}
                    >
                      {followingIds.has(profile.id) ? (
                        <UserCheck size={16} />
                      ) : (
                        <UserPlus size={16} />
                      )}
                      {followLoadingId === profile.id
                        ? "Saving..."
                        : followingIds.has(profile.id)
                          ? "Following"
                          : "Follow"}
                    </button>
                  </header>

                  <p className="public-profile-bio">
                    {profile.bio || "No bio added yet."}
                  </p>

                  <div className="public-profile-metrics">
                    <article>
                      <span>{format(new Date(), "MMMM")} P&amp;L</span>
                      {profile.show_public_pnl ? (
                        <strong className={monthPnl < 0 ? "loss" : "profit"}>
                          {monthPnl > 0 ? "+" : monthPnl < 0 ? "-" : ""}$
                          {Math.abs(monthPnl).toLocaleString()}
                        </strong>
                      ) : (
                        <strong className="private-metric">
                          <LockKeyhole size={17} /> Private
                        </strong>
                      )}
                    </article>
                    <article>
                      <span>Win rate</span>
                      {profile.show_public_pnl ? (
                        <strong>{winRate}%</strong>
                      ) : (
                        <strong className="private-metric">
                          <LockKeyhole size={17} /> Private
                        </strong>
                      )}
                    </article>
                    <article>
                      <span>Public trades</span>
                      <strong>{trades.length}</strong>
                    </article>
                    <article>
                      <span>Plan followed</span>
                      <strong>{planRate}%</strong>
                    </article>
                  </div>

                  <section className="public-journal-section">
                    <div className="public-journal-heading">
                      <div>
                        <span className="discover-page-eyebrow">
                          PUBLIC JOURNAL
                        </span>
                        <h2>Journaled trades</h2>
                      </div>
                      <small>{trades.length} shared</small>
                    </div>

                    <div className="public-journal-list">
                      {trades.length === 0 ? (
                        <div className="public-journal-empty">
                          <BookOpen size={26} />
                          <h3>No public journal entries yet</h3>
                          <p>This trader has not shared any trades publicly.</p>
                        </div>
                      ) : (
                        trades.map((trade) => {
                          const pnl = Number(trade.pnl)
                          return (
                            <article className="public-journal-entry" key={trade.id}>
                              <div className="public-journal-entry-top">
                                <div>
                                  <span>
                                    {format(
                                      new Date(`${trade.trade_date}T12:00:00`),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                  <h3>{trade.instrument || "Trade"}</h3>
                                </div>
                                {profile.show_public_pnl ? (
                                  <strong className={pnl < 0 ? "loss" : "profit"}>
                                    {pnl > 0 ? "+" : pnl < 0 ? "-" : ""}$
                                    {Math.abs(pnl).toLocaleString()}
                                  </strong>
                                ) : (
                                  <span className="entry-pnl-private">
                                    <LockKeyhole size={14} /> P&amp;L private
                                  </span>
                                )}
                              </div>

                              <div className="public-journal-tags">
                                {trade.direction && <span>{trade.direction}</span>}
                                {trade.emotion && <span>{trade.emotion}</span>}
                                {trade.followed_plan && <span>Plan followed</span>}
                              </div>

                              {trade.setup && (
                                <div className="public-entry-copy">
                                  <b>SETUP</b>
                                  <p>{trade.setup}</p>
                                </div>
                              )}
                              {trade.journal && (
                                <div className="public-entry-copy">
                                  <b>REVIEW</b>
                                  <p>{trade.journal}</p>
                                </div>
                              )}
                            </article>
                          )
                        })
                      )}
                    </div>
                  </section>
                </div>
              )
            })() : discoverLoading ? (
              <div className="discover-loading">
                <LoaderCircle className="auth-spinner" size={24} />
                Loading traders...
              </div>
            ) : discoverCards.length === 0 ? (
              <div className="discover-empty-state">
                <Users size={31} />
                <h2>No public traders yet</h2>
                <p>
                  Profiles will appear here when other TradeMirror users join
                  and share public trades.
                </p>
              </div>
            ) : (
              <>
                <header className="discover-page-header">
                  <div>
                    <span className="discover-page-eyebrow">TRADER DISCOVERY</span>
                    <h1>Find traders worth learning from.</h1>
                    <p>
                      Explore public journals, compare performance, and follow
                      traders whose process matches yours.
                    </p>
                  </div>
                </header>

                <label className="discover-search">
                  <Search size={18} />
                  <input
                    type="search"
                    placeholder="Search by trader name, username, or bio..."
                    value={discoverSearch}
                    onChange={(event) => setDiscoverSearch(event.target.value)}
                  />
                </label>

                <div className="discover-card-grid">
                  {discoverCards.map(
                    ({ profile, publicTrades, totalPnl, winRate }) => (
                      <article
                        className="discover-trader-card"
                        key={profile.id}
                        onClick={() => setSelectedDiscoverProfile(profile)}
                      >
                        <div className="discover-card-top">
                          <div className="discover-avatar">
                            {profile.avatar_url ? (
                              <img src={profile.avatar_url} alt="" />
                            ) : (
                              (profile.full_name || profile.username || "T")
                                .charAt(0)
                                .toUpperCase()
                            )}
                          </div>

                          <button
                            type="button"
                            className={
                              followingIds.has(profile.id)
                                ? "discover-following-button"
                                : "discover-follow-button"
                            }
                            disabled={followLoadingId === profile.id}
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleFollow(profile.id)
                            }}
                          >
                            {followingIds.has(profile.id) ? (
                              <UserCheck size={15} />
                            ) : (
                              <UserPlus size={15} />
                            )}
                            {followLoadingId === profile.id
                              ? "Saving..."
                              : followingIds.has(profile.id)
                                ? "Following"
                                : "Follow"}
                          </button>
                        </div>

                        <h2>{profile.full_name || "TradeMirror Trader"}</h2>
                        <span className="discover-username">
                          @{profile.username || "trader"}
                        </span>
                        <p>{profile.bio || "Building consistency one trade at a time."}</p>

                        <div className="discover-card-stats">
                          <div>
                            <span>Public P&amp;L</span>
                            {profile.show_public_pnl ? (
                              <strong className={totalPnl < 0 ? "loss" : "profit"}>
                                {totalPnl > 0 ? "+" : totalPnl < 0 ? "-" : ""}$
                                {Math.abs(totalPnl).toLocaleString()}
                              </strong>
                            ) : (
                              <strong>Private</strong>
                            )}
                          </div>
                          <div>
                            <span>Win rate</span>
                            <strong>{profile.show_public_pnl ? `${winRate}%` : "Private"}</strong>
                          </div>
                          <div>
                            <span>Trades</span>
                            <strong>{publicTrades.length}</strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="discover-view-profile"
                          onClick={() => setSelectedDiscoverProfile(profile)}
                        >
                          <Eye size={15} /> View public journal
                        </button>
                      </article>
                    )
                  )}
                </div>
              </>
            )}
          </section>
        ) : (
          <section className="settings-view">
            <header className="settings-page-header">
              <div>
                <span className="settings-page-eyebrow">ACCOUNT SETTINGS</span>
                <h1>Settings</h1>
                <p>
                  Manage your public profile, privacy, and account security.
                </p>
              </div>
            </header>

            {settingsError && (
              <div className="settings-alert error">{settingsError}</div>
            )}
            {settingsMessage && (
              <div className="settings-alert success">{settingsMessage}</div>
            )}

            <div className="settings-layout">
              <nav className="settings-section-nav" aria-label="Settings sections">
                <button
                  className={settingsTab === "profile" ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setSettingsTab("profile")
                    setSettingsError("")
                    setSettingsMessage("")
                  }}
                >
                  <UserRound size={18} />
                  <span><strong>Profile</strong><small>Public trader details</small></span>
                </button>
                <button
                  className={settingsTab === "privacy" ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setSettingsTab("privacy")
                    setSettingsError("")
                    setSettingsMessage("")
                  }}
                >
                  <ShieldCheck size={18} />
                  <span><strong>Privacy</strong><small>Sharing controls</small></span>
                </button>
                <button
                  className={settingsTab === "security" ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setSettingsTab("security")
                    setSettingsError("")
                    setSettingsMessage("")
                  }}
                >
                  <LockKeyhole size={18} />
                  <span><strong>Security</strong><small>Login and account</small></span>
                </button>
              </nav>

              <div className="settings-content-column">
                {settingsTab === "profile" && (
                <form className="settings-card settings-panel-card" onSubmit={saveSettings}>
                  <div className="settings-card-heading">
                    <div>
                      <span>PUBLIC PROFILE</span>
                      <h2>Trader information</h2>
                      <p>This information appears when traders find you.</p>
                    </div>
                    <label className="settings-avatar-uploader">
                      <span className="settings-avatar-preview">
                        {settingsAvatarPreview ? (
                          <img
                            src={settingsAvatarPreview}
                            alt="Profile preview"
                          />
                        ) : (
                          settingsName.charAt(0).toUpperCase() || "T"
                        )}
                        <i>Change</i>
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null

                          if (!file) return

                          if (file.size > 5 * 1024 * 1024) {
                            setSettingsError(
                              "Your profile photo must be smaller than 5 MB."
                            )
                            event.target.value = ""
                            return
                          }

                          setSettingsError("")
                          setSettingsAvatarFile(file)
                          setSettingsAvatarPreview(URL.createObjectURL(file))
                        }}
                      />
                    </label>
                  </div>

                  {settingsLoading ? (
                    <div className="settings-loading">
                      <LoaderCircle className="auth-spinner" size={21} />
                      Loading settings...
                    </div>
                  ) : (
                    <div className="settings-form-grid">
                      <label>
                        <span>Full name</span>
                        <input
                          type="text"
                          value={settingsName}
                          onChange={(event) =>
                            setSettingsName(event.target.value)
                          }
                          required
                        />
                      </label>

                      <label>
                        <span>Username</span>
                        <div className="settings-username-field">
                          <i>@</i>
                          <input
                            type="text"
                            value={settingsUsername}
                            placeholder="jaketrades"
                            maxLength={30}
                            onChange={(event) =>
                              setSettingsUsername(event.target.value)
                            }
                          />
                        </div>
                        <small>Letters, numbers, and underscores only.</small>
                      </label>

                      <label className="settings-full-field">
                        <span>Trader bio</span>
                        <textarea
                          value={settingsBio}
                          placeholder="NQ futures trader focused on consistency and execution."
                          maxLength={180}
                          onChange={(event) =>
                            setSettingsBio(event.target.value)
                          }
                        />
                        <small>{settingsBio.length}/180 characters</small>
                      </label>
                    </div>
                  )}

                  <div className="settings-card-actions">
                    <button
                      className="settings-save-button"
                      type="submit"
                      disabled={settingsSaving || settingsLoading}
                    >
                      {settingsSaving ? (
                        <LoaderCircle className="auth-spinner" size={17} />
                      ) : (
                        "Save changes"
                      )}
                    </button>
                  </div>
                </form>
                )}

                {settingsTab === "privacy" && (
                <section className="settings-card settings-panel-card settings-privacy-card">
                  <div className="settings-card-heading">
                    <div>
                      <span>PRIVACY</span>
                      <h2>Sharing controls</h2>
                      <p>
                        Visibility is selected separately whenever you log or
                        edit a trade.
                      </p>
                    </div>
                    <ShieldCheck size={23} />
                  </div>

                  <div className="settings-privacy-note">
                    <strong>Your journal stays private by default.</strong>
                    <p>
                      Discover only displays entries you explicitly mark as
                      Public. Private entries and follower-only entries are not
                      included in public performance totals.
                    </p>
                  </div>

                  <label className="settings-privacy-toggle-row">
                    <div>
                      <strong>Show my public P&amp;L</strong>
                      <p>
                        Display your monthly P&amp;L and win rate on your public
                        trader profile.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsShowPublicPnl}
                      onChange={(event) =>
                        setSettingsShowPublicPnl(event.target.checked)
                      }
                    />
                    <span className="settings-toggle-track" aria-hidden="true">
                      <i />
                    </span>
                  </label>

                  <div className="settings-card-actions privacy-save-actions">
                    <button
                      className="settings-save-button"
                      type="button"
                      disabled={settingsSaving || settingsLoading}
                      onClick={savePrivacy}
                    >
                      {settingsSaving ? (
                        <LoaderCircle className="auth-spinner" size={17} />
                      ) : (
                        "Save privacy"
                      )}
                    </button>
                  </div>
                </section>
                )}

                {settingsTab === "security" && (
                <div className="settings-security-stack">
                <form
                  className="settings-card settings-panel-card"
                  onSubmit={updateAccountEmail}
                >
                  <div className="settings-card-heading">
                    <div>
                      <span>EMAIL ADDRESS</span>
                      <h2>Account email</h2>
                      <p>Change the email address used to sign in.</p>
                    </div>
                    <Mail size={23} />
                  </div>
                  <div className="settings-security-form">
                    <label>
                      <span>Email address</span>
                      <input
                        type="email"
                        value={settingsEmail}
                        onChange={(event) => setSettingsEmail(event.target.value)}
                        autoComplete="email"
                        required
                      />
                    </label>
                  </div>
                  <div className="settings-card-actions">
                    <button
                      className="settings-save-button"
                      type="submit"
                      disabled={securitySaving || settingsLoading}
                    >
                      {securitySaving ? (
                        <LoaderCircle className="auth-spinner" size={17} />
                      ) : (
                        "Update email"
                      )}
                    </button>
                  </div>
                </form>

                <form
                  className="settings-card settings-panel-card"
                  onSubmit={updateAccountPassword}
                >
                  <div className="settings-card-heading">
                    <div>
                      <span>PASSWORD</span>
                      <h2>Change password</h2>
                      <p>Use at least eight characters for your new password.</p>
                    </div>
                    <KeyRound size={23} />
                  </div>
                  <div className="settings-security-form two-column">
                    <label>
                      <span>New password</span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                    </label>
                    <label>
                      <span>Confirm password</span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                    </label>
                  </div>
                  <div className="settings-card-actions">
                    <button
                      className="settings-save-button"
                      type="submit"
                      disabled={securitySaving}
                    >
                      {securitySaving ? (
                        <LoaderCircle className="auth-spinner" size={17} />
                      ) : (
                        "Update password"
                      )}
                    </button>
                  </div>
                </form>

                <section className="settings-card settings-panel-card settings-sessions-card">
                  <div className="settings-card-heading">
                    <div>
                      <span>ACTIVE SESSIONS</span>
                      <h2>Other devices</h2>
                      <p>Sign out TradeMirror sessions on your other devices.</p>
                    </div>
                    <LogOut size={23} />
                  </div>
                  <button
                    type="button"
                    className="settings-secondary-button"
                    disabled={securitySaving}
                    onClick={signOutOtherSessions}
                  >
                    Sign out other sessions
                  </button>
                </section>

                <section className="settings-card settings-panel-card settings-danger-card">
                  <div className="settings-card-heading">
                    <div>
                      <span>DANGER ZONE</span>
                      <h2>Delete account</h2>
                      <p>
                        Permanently delete your profile, trades, journal notes,
                        screenshots, and login.
                      </p>
                    </div>
                    <Trash2 size={23} />
                  </div>

                  <button
                    type="button"
                    className="settings-delete-button"
                    onClick={() => {
                      setDeleteConfirmation("")
                      setDeleteDialogOpen(true)
                    }}
                  >
                    Delete my account
                  </button>
                </section>
                </div>
                )}
              </div>
            </div>
          </section>
        )}
      </section>

      {deleteDialogOpen && (
        <div
          className="delete-account-backdrop"
          onMouseDown={() => !deletingAccount && setDeleteDialogOpen(false)}
        >
          <section
            className="delete-account-dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="delete-account-icon">
              <Trash2 size={22} />
            </div>
            <h2>Permanently delete your account?</h2>
            <p>
              This cannot be undone. Every trade, journal entry, uploaded
              screenshot, follow, and profile detail will be removed.
            </p>

            <label>
              <span>Type DELETE to confirm</span>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(event) =>
                  setDeleteConfirmation(event.target.value)
                }
                autoComplete="off"
                placeholder="DELETE"
              />
            </label>

            <div className="delete-account-actions">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-account-delete"
                disabled={deleteConfirmation !== "DELETE" || deletingAccount}
                onClick={deleteAccount}
              >
                {deletingAccount ? (
                  <>
                    <LoaderCircle className="auth-spinner" size={17} />
                    Deleting...
                  </>
                ) : (
                  "Delete permanently"
                )}
              </button>
            </div>
          </section>
        </div>
      )}

      {formOpen && (
        <div
          className="trade-modal-backdrop"
          onMouseDown={() => {
            setFormOpen(false)
            setEditingTrade(null)
          }}
        >
          <section
            className="trade-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="trade-modal-header">
              <div>
                <span>
                  {editingTrade ? "EDIT JOURNAL ENTRY" : "NEW JOURNAL ENTRY"}
                </span>
                <h2>{format(selectedDate, "MMMM d, yyyy")}</h2>
              </div>

              <button
                aria-label="Close journal form"
                onClick={() => {
                  setFormOpen(false)
                  setEditingTrade(null)
                }}
              >
                <X size={20} />
              </button>
            </header>

            <form className="trade-form" onSubmit={saveTrade}>
              <div className="trade-form-grid">
                <label>
                  <span>P&amp;L</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="420.00 or -180.00"
                    value={form.pnl}
                    onChange={(event) =>
                      setForm({ ...form, pnl: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  <span>Instrument</span>
                  <input
                    type="text"
                    placeholder="NQ"
                    value={form.instrument}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        instrument: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  <span>Direction</span>
                  <select
                    value={form.direction}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        direction: event.target.value,
                      })
                    }
                  >
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                  </select>
                </label>

                <label>
                  <span>Contracts</span>
                  <input
                    type="number"
                    min="1"
                    value={form.contracts}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        contracts: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  <span>Emotion</span>
                  <select
                    value={form.emotion}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        emotion: event.target.value,
                      })
                    }
                  >
                    <option>Focused</option>
                    <option>Calm</option>
                    <option>Confident</option>
                    <option>Hesitant</option>
                    <option>Nervous</option>
                    <option>Scared</option>
                    <option>Frustrated</option>
                    <option>Impulsive</option>
                    <option>Greedy</option>
                  </select>
                </label>

                <label>
                  <span>Followed your plan?</span>
                  <select
                    value={form.followedPlan}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        followedPlan: event.target.value,
                      })
                    }
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>

                <label className="full-form-field">
                  <span>Setup</span>
                  <input
                    type="text"
                    placeholder="Liquidity sweep + IFVG"
                    value={form.setup}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        setup: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="full-form-field">
                  <span>Journal</span>
                  <textarea
                    placeholder="What happened? What went well? What will you improve?"
                    value={form.journal}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        journal: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  <span>Execution rating</span>
                  <select
                    value={form.executionRating}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        executionRating: event.target.value,
                      })
                    }
                  >
                    <option>Great execution</option>
                    <option>Good execution</option>
                    <option>Iffy execution</option>
                    <option>Poor execution</option>
                  </select>
                </label>

                <label>
                  <span>Visibility</span>
                  <select
                    value={form.visibility}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        visibility: event.target.value,
                      })
                    }
                  >
                    <option value="private">Private</option>
                    <option value="followers">Followers</option>
                    <option value="public">Public</option>
                  </select>
                </label>

                <label className="full-form-field">
                  <span>Trade screenshot</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setScreenshot(event.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              {formError && (
                <div className="trade-form-error">{formError}</div>
              )}

              <div className="trade-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false)
                    setEditingTrade(null)
                  }}
                >
                  Cancel
                </button>

                <button type="submit" disabled={saving}>
                  {saving ? (
                    <LoaderCircle className="auth-spinner" size={18} />
                  ) : (
                    <>
                      {editingTrade ? "Save changes" : "Save journal entry"}
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {previewScreenshot && (
        <div
          className="screenshot-preview-backdrop"
          onMouseDown={() => setPreviewScreenshot(null)}
        >
          <div
            className="screenshot-preview-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>TRADE SCREENSHOT</span>
                <h2>{previewScreenshot.instrument}</h2>
              </div>

              <button
                type="button"
                aria-label="Close screenshot"
                onClick={() => setPreviewScreenshot(null)}
              >
                <X size={21} />
              </button>
            </header>

            <img
              src={previewScreenshot.url}
              alt={`${previewScreenshot.instrument} enlarged chart`}
            />
          </div>
        </div>
      )}
    </main>
  )
}