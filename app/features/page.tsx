import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  LockKeyhole,
  Search,
  Users,
} from "lucide-react"

import SiteHeader from "@/components/site-header"

const calendarDays = [
  { day: "1", pnl: "+$320", result: "profit" },
  { day: "2", pnl: "-$180", result: "loss" },
  { day: "3" },
  { day: "4", pnl: "+$260", result: "profit" },
  { day: "5", pnl: "+$540", result: "profit" },
  { day: "6", pnl: "-$120", result: "loss" },
  { day: "7", pnl: "+$310", result: "profit" },
  { day: "8", pnl: "+$410", result: "profit" },
  { day: "9", pnl: "-$230", result: "loss" },
  { day: "10" },
  { day: "11", pnl: "+$670", result: "profit" },
  { day: "12", pnl: "+$430", result: "profit" },
  { day: "13", pnl: "-$310", result: "loss" },
  { day: "14", pnl: "+$720", result: "profit" },
]

export default function FeaturesPage() {
  return (
    <main>
      <SiteHeader />

      <section className="features-hero">
        <h1>
          More than numbers.
          <span> Better trading habits.</span>
        </h1>
      </section>

      <section className="features-showcase">
        <article className="showcase-card showcase-calendar">
          <div className="showcase-copy">
            <div className="showcase-icon">
              <CalendarDays size={22} />
            </div>

            <span className="showcase-label">P&amp;L CALENDAR</span>
            <h2>See every trading day clearly.</h2>

            <p>
              Recognize winning streaks, losing patterns, and your monthly
              performance at a glance.
            </p>
          </div>

          <div className="mini-calendar">
            <div className="mini-calendar-header">
              <strong>May 2026</strong>
              <span>+$3,620</span>
            </div>

            <div className="mini-weekdays">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            <div className="mini-calendar-grid">
              {calendarDays.map((date, index) => (
                <div className="mini-day" key={`${date.day}-${index}`}>
                  <span>{date.day}</span>

                  {date.pnl && (
                    <strong className={date.result}>{date.pnl}</strong>
                  )}
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="showcase-card showcase-journal">
          <div className="showcase-copy">
            <div className="showcase-icon">
              <BookOpen size={22} />
            </div>

            <span className="showcase-label">TRADE JOURNAL</span>
            <h2>Review more than the outcome.</h2>

            <p>
              Save your reasoning, lessons, setups, and mistakes alongside each
              trade.
            </p>
          </div>

          <div className="journal-example">
            <div className="journal-example-top">
              <div>
                <span>NQ · LONG</span>
                <strong>May 29, 2026</strong>
              </div>

              <div className="example-profit">+$420</div>
            </div>

            <div className="example-field">
              <span>WHAT WENT WELL</span>
              <p>
                Waited for confirmation and managed risk according to my plan.
              </p>
            </div>

            <div className="emotion-example">
              <span className="selected-emotion">Focused</span>
              <span>Calm</span>
              <span>Confident</span>
            </div>
          </div>
        </article>

        <article className="showcase-card showcase-emotions">
          <div className="showcase-icon">
            <BarChart3 size={22} />
          </div>

          <span className="showcase-label">EXECUTION</span>
          <h2>Separate results from discipline.</h2>

          <p>
            A winning trade can still be poorly executed. Track whether you
            actually followed your plan.
          </p>

          <div className="discipline-preview">
            <div className="discipline-score">
              <strong>84%</strong>
              <span>Plan followed</span>
            </div>

            <div className="discipline-bars">
              <div>
                <span>Risk management</span>
                <div className="preview-bar">
                  <span style={{ width: "91%" }} />
                </div>
              </div>

              <div>
                <span>Entry patience</span>
                <div className="preview-bar">
                  <span style={{ width: "76%" }} />
                </div>
              </div>

              <div>
                <span>Trade management</span>
                <div className="preview-bar">
                  <span style={{ width: "86%" }} />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="showcase-card showcase-screenshots">
          <div className="showcase-icon">
            <Camera size={22} />
          </div>

          <span className="showcase-label">SCREENSHOTS</span>
          <h2>Save what you saw.</h2>

          <p>
            Attach your chart to a trading day so you can review the exact setup
            later.
          </p>

          <div className="chart-screenshot-preview">
            <div className="fake-chart-grid" />

            <svg viewBox="0 0 500 150" preserveAspectRatio="none">
              <path d="M0 120 L45 105 L90 112 L135 80 L180 88 L225 48 L270 62 L315 35 L360 51 L405 22 L450 38 L500 10" />
            </svg>

            <div className="chart-entry-marker">Entry</div>
          </div>
        </article>

        <article className="showcase-card showcase-community">
          <div className="community-heading">
            <div>
              <div className="showcase-icon">
                <Users size={22} />
              </div>

              <span className="showcase-label">TRADER PROFILES</span>
              <h2>Learn from other traders.</h2>

              <p>
                Search public profiles and view the results and journal entries
                traders choose to share.
              </p>
            </div>

            <Search size={21} />
          </div>

          <div className="trader-search">
            <Search size={17} />
            <span>Search traders by name or @username</span>
          </div>

          <div className="trader-results">
            <div className="trader-result">
              <div className="trader-avatar">JM</div>
              <div>
                <strong>Jordan Markets</strong>
                <span>@jordantrades · NQ &amp; ES</span>
              </div>
              <button>Follow</button>
            </div>

            <div className="trader-result">
              <div className="trader-avatar purple">AT</div>
              <div>
                <strong>Alex Trades</strong>
                <span>@alextrades · Futures</span>
              </div>
              <button>Follow</button>
            </div>
          </div>
        </article>

        <article className="showcase-card showcase-privacy">
          <div className="showcase-icon">
            <LockKeyhole size={22} />
          </div>

          <span className="showcase-label">PRIVACY</span>
          <h2>You decide what people see.</h2>

          <p>
            Keep everything private, share selected entries, or show percentages
            without revealing exact dollar amounts.
          </p>

          <div className="privacy-options">
            <div>
              <span className="privacy-check">
                <Check size={14} />
              </span>
              Public profile
            </div>

            <div>
              <span className="privacy-check">
                <Check size={14} />
              </span>
              Hide dollar amounts
            </div>

            <div>
              <span className="privacy-check">
                <Check size={14} />
              </span>
              Approve followers
            </div>
          </div>
        </article>
      </section>

      <section className="features-cta">
        <div>
          <h2>Your next trade deserves a better review.</h2>
        </div>

        <Link href="/signup" className="button button-primary">
          Start journaling free
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  )
}