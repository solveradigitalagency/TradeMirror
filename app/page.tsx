import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Play,
  Target,
  TrendingUp,
} from "lucide-react"

import SiteHeader from "@/components/site-header"

const calendarDays = [
  { day: "28" },
  { day: "29" },
  { day: "30" },
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
  { day: "15", pnl: "+$290", result: "profit" },
  { day: "16", pnl: "-$450", result: "loss" },
  { day: "17" },
  { day: "18", pnl: "+$380", result: "profit" },
  { day: "19", pnl: "+$610", result: "profit" },
  { day: "20", pnl: "+$150", result: "profit" },
  { day: "21", pnl: "-$200", result: "loss" },
  { day: "22", pnl: "+$330", result: "profit" },
  { day: "23", pnl: "+$500", result: "profit" },
  { day: "24" },
  { day: "25", pnl: "-$140", result: "loss" },
  { day: "26", pnl: "+$280", result: "profit" },
  { day: "27", pnl: "-$160", result: "loss" },
  { day: "28", pnl: "+$190", result: "profit" },
  {
    day: "29",
    pnl: "+$420",
    result: "profit",
    selected: true,
  },
  { day: "30" },
  { day: "31" },
  { day: "1" },
]

export default function Home() {
  return (
    <main className="landing-page">
      <SiteHeader />

      <section className="hero hero-premium">
        <div className="ambient-light ambient-one" />
        <div className="ambient-light ambient-two" />

        <div className="market-backdrop" aria-hidden="true">
          <div className="market-candles">
            {[34, 48, 43, 66, 58, 82, 72, 96, 88, 112].map(
              (height, index) => (
                <span
                  key={index}
                  style={{
                    height: `${height}px`,
                    transform: `translateY(${-index * 15}px)`,
                  }}
                >
                  <i />
                </span>
              )
            )}
          </div>
          <div className="market-flow market-flow-one" />
          <div className="market-flow market-flow-two" />
        </div>

        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Your trading, reflected clearly
          </div>

          <h1>
            Build an edge you can <span>actually see.</span>
          </h1>

          <p className="hero-description">
            Track every result, review every decision, and turn your
            trading history into better habits.
          </p>

          <div className="hero-actions">
            <a href="/signup" className="button button-primary">
              Start journaling free
              <ArrowRight size={18} />
            </a>

            <a href="/dashboard" className="button button-secondary">
              <Play size={16} fill="currentColor" />
              View dashboard
            </a>
          </div>
        </div>

        <div className="product-scene" id="product">
          <div className="chart-panel floating-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-label">PERFORMANCE</span>
                <h3>Account overview</h3>
              </div>

              <span className="period-pill">1M</span>
            </div>

            <div className="chart">
              <div className="chart-value-labels" aria-hidden="true">
                <span>+$6K</span>
                <span>+$3K</span>
                <span>$0</span>
              </div>
              <div className="chart-session-labels" aria-hidden="true">
                <span>London</span>
                <span>New York</span>
                <span>Close</span>
              </div>
              <div className="chart-grid">
                <span />
                <span />
                <span />
              </div>

              <svg
                viewBox="0 0 600 150"
                preserveAspectRatio="none"
                aria-label="Account performance chart"
              >
                <defs>
                  <linearGradient
                    id="chartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#7297c8"
                      stopOpacity=".32"
                    />

                    <stop
                      offset="100%"
                      stopColor="#7297c8"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  className="chart-area"
                  d="M0,122 C42,120 55,96 92,101 C130,106 145,75 184,83 C223,91 246,51 286,66 C325,80 349,43 390,54 C434,67 455,29 491,46 C530,65 554,32 600,17 L600,150 L0,150 Z"
                />

                <path
                  className="chart-line"
                  d="M0,122 C42,120 55,96 92,101 C130,106 145,75 184,83 C223,91 246,51 286,66 C325,80 349,43 390,54 C434,67 455,29 491,46 C530,65 554,32 600,17"
                />
              </svg>
            </div>
          </div>

          <div className="calendar-panel floating-panel">
            <div className="calendar-top">
              <div>
                <span className="panel-label">
                  P&amp;L CALENDAR
                </span>

                <h3>May 2026</h3>
              </div>

              <button className="today-button">Today</button>
            </div>

            <div className="weekdays">
              {[
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT",
                "SUN",
              ].map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((date, index) => (
                <div
                  key={`${date.day}-${index}`}
                  className={`calendar-day ${
                    date.selected ? "selected-day" : ""
                  }`}
                >
                  <span className="day-number">{date.day}</span>

                  {date.pnl && (
                    <span className={`day-pnl ${date.result}`}>
                      {date.pnl}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="journal-panel floating-panel">
            <div className="journal-heading">
              <div className="journal-icon">
                <BookOpen size={17} />
              </div>

              <div>
                <span className="panel-label">
                  JOURNAL REVIEW
                </span>

                <h3>May 29, 2026</h3>
              </div>
            </div>

            <div className="journal-result">
              <span>NQ · Long setup</span>
              <strong>+$420</strong>
            </div>

            <div className="journal-entry">
              <span>SETUP</span>

              <p>
                Breakout above prior high with volume confirmation.
              </p>
            </div>

            <div className="journal-entry">
              <span>WHAT WENT WELL</span>

              <p>
                Waited for confirmation and managed risk as planned.
              </p>
            </div>

            <div className="emotion-row">
              <span className="emotion active">Focused</span>
              <span className="emotion">Calm</span>
            </div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-card">
            <div className="metric-icon">
              <TrendingUp size={19} />
            </div>

            <div>
              <span>Monthly P&amp;L</span>
              <strong>+$3,620</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon blue">
              <Target size={19} />
            </div>

            <div>
              <span>Win rate</span>
              <strong>68%</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>Plan followed</span>
              <strong>84%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading">
          <span className="section-label">
            EVERYTHING IN ONE PLACE
          </span>

          <h2>Understand more than your P&amp;L</h2>

          <p>
            TradeMirror helps you connect your results with the
            decisions and emotions behind them.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">
              <CalendarDays size={23} />
            </div>

            <h3>See every trading day</h3>

            <p>
              View profits and losses in a clear calendar that makes
              patterns easy to recognize.
            </p>
          </article>

          <article className="feature-card featured">
            <div className="feature-icon">
              <BookOpen size={23} />
            </div>

            <h3>Review your decisions</h3>

            <p>
              Add screenshots, setups, notes, and emotions to
              understand why a trade worked—or didn’t.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={23} />
            </div>

            <h3>Build real consistency</h3>

            <p>
              Measure execution and discipline separately from
              whether a trade happened to win.
            </p>
          </article>
        </div>
      </section>

      <section className="cta-section" id="pricing">
        <div>
          <span className="section-label">START FOR FREE</span>

          <h2>Your next trade deserves a better review.</h2>
        </div>

        <a href="/signup" className="button button-primary">
          Create your journal
          <ArrowRight size={18} />
        </a>
      </section>
    </main>
  )
}