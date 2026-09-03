import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"

import SiteHeader from "@/components/site-header"

const calendarDays = [
  { day: "31" },
  { day: "1", pnl: "+$320", result: "profit" },
  { day: "2", pnl: "-$150", result: "loss" },
  { day: "3", pnl: "+$410", result: "profit" },
  { day: "4", pnl: "+$280", result: "profit" },
  { day: "5" },
  { day: "6" },
  { day: "7", pnl: "+$510", result: "profit" },
  { day: "8", pnl: "-$220", result: "loss" },
  { day: "9", pnl: "+$300", result: "profit" },
  { day: "10", pnl: "+$620", result: "profit" },
  { day: "11", pnl: "-$180", result: "loss" },
  { day: "12" },
  { day: "13" },
  { day: "14", pnl: "+$410", result: "profit" },
  { day: "15", pnl: "+$290", result: "profit" },
  { day: "16", pnl: "-$340", result: "loss" },
  { day: "17", pnl: "+$560", result: "profit" },
  { day: "18", pnl: "+$230", result: "profit" },
  { day: "19" },
  { day: "20" },
  { day: "21", pnl: "-$120", result: "loss" },
  { day: "22", pnl: "+$370", result: "profit" },
  { day: "23", pnl: "+$650", result: "profit" },
  { day: "24", pnl: "-$200", result: "loss" },
  { day: "25", pnl: "+$310", result: "profit" },
  { day: "26" },
  { day: "27" },
  { day: "28", pnl: "+$540", result: "profit" },
  { day: "29", pnl: "+$260", result: "profit", selected: true },
  { day: "30", pnl: "+$130", result: "profit" },
  { day: "1" },
  { day: "2" },
  { day: "3" },
  { day: "4" },
]

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: CalendarDays, label: "Calendar" },
  { icon: BarChart3, label: "Trades" },
  { icon: BookOpen, label: "Journal" },
  { icon: Users, label: "Discover" },
  { icon: Settings, label: "Settings" },
]

export default function ProductPage() {
  return (
    <main>
      <SiteHeader />

      <section className="product-page-hero">
        <h1>
          One place to understand
          <span> every trade.</span>
        </h1>

        <div className="product-hero-actions">
          <Link href="/signup" className="button button-primary">
            Start journaling free
            <ArrowRight size={18} />
          </Link>

          <a href="#dashboard-preview" className="button button-secondary">
            View the product
          </a>
        </div>
      </section>

      <section className="dashboard-stage" id="dashboard-preview">
        <div className="dashboard-window">
          <aside className="preview-sidebar">
            <Link href="/" className="preview-brand">
              <span>T</span>
              TradeMirror
            </Link>

            <div className="preview-navigation">
              {sidebarLinks.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    className={`preview-nav-item ${
                      item.active ? "preview-nav-active" : ""
                    }`}
                    key={item.label}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="preview-user">
              <div>AT</div>
              <span>
                <strong>Alex Trader</strong>
                Free plan
              </span>
            </div>
          </aside>

          <div className="preview-main">
            <header className="preview-header">
              <div>
                <h2>Good morning, Alex</h2>
                <p>Here’s how your trading is developing.</p>
              </div>

              <button>
                <Plus size={17} />
                Log a trade
              </button>
            </header>

            <div className="preview-metrics">
              <div className="preview-metric">
                <span>Monthly P&amp;L</span>
                <strong>+$3,620</strong>
                <TrendingUp size={18} />
              </div>

              <div className="preview-metric">
                <span>Win rate</span>
                <strong>68%</strong>
                <Target size={18} />
              </div>

              <div className="preview-metric">
                <span>Profit factor</span>
                <strong>1.84</strong>
                <BarChart3 size={18} />
              </div>

              <div className="preview-metric">
                <span>Plan followed</span>
                <strong>84%</strong>
                <Check size={18} />
              </div>
            </div>

            <div className="preview-dashboard-grid">
              <div className="preview-calendar-card">
                <div className="preview-card-heading">
                  <div>
                    <span>P&amp;L CALENDAR</span>
                    <h3>September 2026</h3>
                  </div>

                  <div className="preview-filter">All instruments</div>
                </div>

                <div className="preview-weekdays">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}
                </div>

                <div className="preview-calendar-grid">
                  {calendarDays.map((date, index) => (
                    <div
                      className={`preview-day ${
                        date.selected ? "preview-selected-day" : ""
                      }`}
                      key={`${date.day}-${index}`}
                    >
                      <span>{date.day}</span>

                      {date.pnl && (
                        <strong className={date.result}>{date.pnl}</strong>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-review-card">
                <div className="preview-card-heading">
                  <div>
                    <span>DAILY REVIEW</span>
                    <h3>September 29</h3>
                  </div>

                  <BookOpen size={19} />
                </div>

                <div className="review-progress-heading">
                  <span>Journal completion</span>
                  <strong>6 of 8</strong>
                </div>

                <div className="review-progress">
                  <span />
                </div>

                <div className="review-question">
                  How did you feel during your trading?
                </div>

                <div className="review-emotions">
                  <span className="active">Focused</span>
                  <span>Calm</span>
                  <span>Hesitant</span>
                </div>

                <div className="review-notes">
                  <span>NOTES PREVIEW</span>
                  <p>
                    Took two clean setups during the morning session and
                    managed risk well.
                  </p>
                </div>

                <button>Finish review</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-workflow">
        <div className="workflow-heading">
          <h2>A simple routine built around improvement.</h2>
        </div>

        <div className="workflow-grid">
          <article className="workflow-card">
            <div className="workflow-number">01</div>

            <div className="workflow-icon">
              <CalendarDays size={23} />
            </div>

            <h3>Log the result</h3>
            <p>
              Select a trading day and enter your P&amp;L, instrument, setup,
              and trade direction.
            </p>

            <div className="workflow-example log-example">
              <div>
                <span>Daily P&amp;L</span>
                <strong>+$420</strong>
              </div>

              <div>
                <span>Instrument</span>
                <strong>NQ</strong>
              </div>
            </div>
          </article>

          <article className="workflow-card raised-workflow-card">
            <div className="workflow-number">02</div>

            <div className="workflow-icon">
              <BookOpen size={23} />
            </div>

            <h3>Review the decision</h3>
            <p>
              Add notes, screenshots, emotions, and whether you followed your
              trading plan.
            </p>

            <div className="workflow-example review-example">
              <div>
                <Check size={16} />
                Followed my trading plan
              </div>

              <div>
                <Camera size={16} />
                Chart screenshot attached
              </div>
            </div>
          </article>

          <article className="workflow-card">
            <div className="workflow-number">03</div>

            <div className="workflow-icon">
              <TrendingUp size={23} />
            </div>

            <h3>Find the pattern</h3>
            <p>
              Use your calendar and analytics to recognize what helps or hurts
              your performance.
            </p>

            <div className="workflow-example pattern-example">
              <div>
                <Search size={16} />
                Best setup
              </div>

              <strong>Liquidity sweep + IFVG</strong>
              <span>72% win rate</span>
            </div>
          </article>
        </div>
      </section>

      <section className="product-bottom-cta">
        <div>
          <h2>Build your journal before your next trade.</h2>
        </div>

        <Link href="/signup" className="button button-primary">
          Start for free
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  )
}