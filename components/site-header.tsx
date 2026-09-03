"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <header className={`navbar ${menuOpen ? "mobile-menu-open" : ""}`}>
      <Link href="/" className="brand" aria-label="TradeMirror home">
        <img
          src="/trademirrorlogo.png"
          alt="TradeMirror"
          className="navbar-logo-image"
        />
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/product">Product</Link>
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>

      <div className="nav-actions">
        <Link href="/login" className="sign-in">
          Sign in
        </Link>

        <Link href="/signup" className="button button-small">
          Start for free
        </Link>
      </div>

      <button
        type="button"
        className="mobile-menu-button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="mobile-navigation" id="mobile-navigation">
        <nav aria-label="Mobile navigation">
          <Link href="/product">Product</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>

        <div className="mobile-navigation-actions">
          <Link href="/login" className="button mobile-sign-in">
            Sign in
          </Link>
          <Link href="/signup" className="button button-primary">
            Start for free
          </Link>
        </div>
      </div>
    </header>
  )
}