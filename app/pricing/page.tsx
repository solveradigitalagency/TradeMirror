import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Check,
  Cloud,
  Database,
  Sparkles,
  Zap,
} from "lucide-react"

import SiteHeader from "@/components/site-header"

const freeFeatures = [
  "Manual P&L calendar",
  "Daily trade journal",
  "Screenshot uploads",
  "Emotion and discipline tracking",
  "Basic performance analytics",
  "Public or private trader profile",
  "Trader search and following",
]

const proFeatures = [
  "AI trade capture",
  "Automatic trade imports",
  "Weekly AI reviews",
  "Advanced performance analytics",
  "Multiple trading accounts",
  "Payout and expense tracking",
  "Tax-ready exports",
  "Expanded screenshot storage",
]

export default function PricingPage() {
  return (
    <main>
      <SiteHeader />

      <section className="pricing-page">
        <div className="pricing-heading">
          <h1>
            Start free.
            <span> Upgrade when you’re ready.</span>
          </h1>
        </div>

        <div className="pricing-grid-v2">
          <article className="plan-card free-plan">
            <div className="plan-glow" />

            <div className="plan-header">
              <div className="plan-icon">
                <BarChart3 size={23} />
              </div>

              <div>
                <span className="plan-type">AVAILABLE NOW</span>
                <h2>TradeMirror Free</h2>
              </div>
            </div>

            <div className="plan-price">
              <strong>$0</strong>

              <div>
                <span>forever</span>
                <small>No credit card required</small>
              </div>
            </div>

            <p className="plan-description">
              Everything you need to begin tracking, reviewing, and
              understanding your trades.
            </p>

            <Link
              href="/signup"
              className="button button-primary plan-button"
            >
              Start journaling free
              <ArrowRight size={18} />
            </Link>

            <div className="plan-divider" />

            <div className="plan-includes">
              <span>WHAT’S INCLUDED</span>

              <div className="plan-feature-grid">
                {freeFeatures.map((feature) => (
                  <div className="plan-feature" key={feature}>
                    <span className="feature-check">
                      <Check size={14} />
                    </span>

                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="plan-card pro-plan">
            <div className="pro-badge">
              <Sparkles size={14} />
              COMING LATER
            </div>

            <div className="plan-header">
              <div className="plan-icon pro-icon">
                <Zap size={23} />
              </div>

              <div>
                <span className="plan-type">
                  FOR CONNECTED TRADERS
                </span>

                <h2>TradeMirror Pro</h2>
              </div>
            </div>

            <div className="coming-price">
              <strong>Coming soon</strong>
              <span>Pricing will be announced before launch.</span>
            </div>

            <p className="plan-description">
              Automatic trade importing, verified results, and deeper
              performance insights.
            </p>

            <button
              className="button pro-plan-button"
              type="button"
              disabled
            >
              Not available yet
            </button>

            <div className="plan-divider" />

            <div className="plan-includes">
              <span>PLANNED FOR PRO</span>

              <div className="plan-feature-grid">
                {proFeatures.map((feature) => (
                  <div className="plan-feature" key={feature}>
                    <span className="feature-check pro-check">
                      <Check size={14} />
                    </span>

                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="pricing-benefits">
          <div>
            <Cloud size={19} />
            <span>Your journal is available across your devices.</span>
          </div>

          <div>
            <Database size={19} />
            <span>Your trading data remains under your control.</span>
          </div>

          <div>
            <Sparkles size={19} />
            <span>The free plan stays useful without upgrading.</span>
          </div>
        </div>
      </section>
    </main>
  )
}