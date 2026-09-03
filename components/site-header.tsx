import Link from "next/link"

export default function SiteHeader() {
  return (
    <header className="navbar">
      <Link href="/" className="brand">
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
    </header>
  )
}