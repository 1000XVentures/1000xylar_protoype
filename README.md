You are building a web prototype for Xylar — a Mutual Fund portfolio intelligence 
platform used by Relationship Managers (RMs) to showcase portfolio analysis to 
high-net-worth clients. This is a frontend-only prototype. No backend. All data 
is mocked but must feel real and precise.

The person reviewing this prototype has 11+ years in fintech and banking. 
They will know immediately if something feels off. Every number, every label, 
every spacing decision matters.

─────────────────────────────────────────
TECH STACK
─────────────────────────────────────────
- React + Vite
- Tailwind CSS (no component libraries — no shadcn, no MUI, no Ant Design)
- Recharts for all charts
- React Router for navigation
- Framer Motion for transitions only (no decorative animations)
- All data in /src/data/ as static JSON files

─────────────────────────────────────────
DESIGN SYSTEM — NON NEGOTIABLE
─────────────────────────────────────────
Define these as CSS variables and use them everywhere. 
Never hardcode a colour anywhere in the codebase.

:root {
  --bg:        #F7F5F1;   /* warm off-white, base of everything */
  --surface:   #FFFFFF;   /* cards, panels */
  --border:    #E4E1DB;   /* all borders */
  --text-primary:   #1A1A1A;
  --text-secondary: #6B6860;
  --text-muted:     #A09D97;
  --accent:    #2C4A6E;   /* slate blue — only accent colour */
  --accent-light: #EEF2F7;
  --positive:  #2D6A4F;   /* gains — muted green, never bright */
  --negative:  #9B2335;   /* loss — muted red, never bright */
  --warning:   #92622A;   /* amber — for signals */
  --radius:    6px;
  --radius-lg: 12px;
}

Typography:
- Headings: "Playfair Display", serif — weight 600
- Body + Data: "Inter", sans-serif — weight 400/500
- Numbers/figures: "Inter" tabular-nums — always use font-variant-numeric: tabular-nums

Spacing:
- Base unit is 4px
- Section padding: 40px
- Card padding: 28px
- Never let content touch an edge

─────────────────────────────────────────
COMPONENT RULES
─────────────────────────────────────────
Every component must follow these rules without exception:

1. No shadows except: box-shadow: 0 1px 3px rgba(0,0,0,0.06)
2. No gradients anywhere
3. Borders use var(--border) only
4. Hover states: background shifts to var(--accent-light), nothing else moves
5. All charts: no grid lines except one horizontal baseline, 
   no border around chart container, recharts CartesianGrid set to 
   strokeDasharray="0" stroke="transparent" except bottom axis line
6. Chart tooltip: white background, 1px var(--border) border, 
   12px Inter, no drop shadow
7. Loading state for any data: a single thin 2px line 
   animating left to right in var(--accent-light), nothing else

─────────────────────────────────────────
DATA FILES — CREATE THESE FIRST
─────────────────────────────────────────
Before building any screen, create these files in /src/data/

/src/data/portfolios.json
Three portfolios:
{
  "conservative": {
    "id": "conservative",
    "label": "Conservative Portfolio",
    "description": "Capital preservation with moderate growth",
    "funds": [
      { "name": "HDFC Short Term Debt Fund", "category": "Short Duration", 
        "allocation": 35, "invested": 500000, "currentValue": 612000,
        "xirr": 8.2, "units": 4821, "nav": 126.94, "planType": "Direct" },
      { "name": "ICICI Pru Balanced Advantage Fund", "category": "Dynamic Asset Allocation",
        "allocation": 30, "invested": 430000, "currentValue": 561000,
        "xirr": 10.4, "units": 12043, "nav": 46.58, "planType": "Direct" },
      { "name": "Mirae Asset Large Cap Fund", "category": "Large Cap",
        "allocation": 20, "invested": 285000, "currentValue": 341000,
        "xirr": 11.2, "units": 6821, "nav": 49.99, "planType": "Direct" },
      { "name": "Parag Parikh Flexi Cap Fund", "category": "Flexi Cap",
        "allocation": 15, "invested": 215000, "currentValue": 247000,
        "xirr": 9.8, "units": 4102, "nav": 60.22, "planType": "Direct" }
    ],
    "summary": {
      "totalInvested": 1430000,
      "currentValue": 1761000,
      "xirr_actual": 9.6,
      "xirr_xylar": 12.1,
      "alpha": 1.8,
      "signals": ["allocation_drift"]
    }
  },
  "growth": { ... },      // build similarly — 5 funds, balanced equity/debt
  "aggressive": { ... }   // build similarly — 6 funds, heavy equity, overlap signals fire
}

/src/data/marketInsights.json
{
  "schemeProlif": [
    {"year": "2015", "funds": 1624},
    {"year": "2016", "funds": 1812},
    {"year": "2017", "funds": 2044},
    {"year": "2018", "funds": 2335},
    {"year": "2019", "funds": 2596},
    {"year": "2020", "funds": 2891},
    {"year": "2021", "funds": 3180},
    {"year": "2022", "funds": 3401},
    {"year": "2023", "funds": 3624},
    {"year": "2024", "funds": 3892}
  ],
  "sipVsLumpsum": [
    {"category": "Large Cap",    "sip_xirr": 13.2, "lumpsum_xirr": 9.8},
    {"category": "Mid Cap",      "sip_xirr": 18.4, "lumpsum_xirr": 11.2},
    {"category": "Flexi Cap",    "sip_xirr": 15.6, "lumpsum_xirr": 12.1},
    {"category": "Short Duration","sip_xirr": 7.8,  "lumpsum_xirr": 7.1}
  ]
}

/src/data/evidenceWidgets.json
Signals for aggressive portfolio:
{
  "overlap": {
    "label": "Fund Overlap Detected",
    "impact": 84000,
    "impactBps": 210,
    "what": "3 funds in your portfolio hold Infosys, HDFC Bank and Reliance as top-5 holdings simultaneously.",
    "why": "Overlap creates the illusion of diversification. In a market correction, these funds move together — not independently.",
    "xylarAction": "Replace one large-cap with a mid-cap or sector fund with less than 30% holdings overlap.",
    "chartData": [
      {"fund": "Mirae Large Cap", "overlap": 68},
      {"fund": "HDFC Flexi Cap",  "overlap": 71},
      {"fund": "Axis Bluechip",   "overlap": 74}
    ]
  },
  "drift": { ... },
  "entryTiming": { ... },
  "tax": { ... }
}

─────────────────────────────────────────
SCREENS — BUILD IN THIS ORDER
─────────────────────────────────────────

── SCREEN 1: Login (/login)
Layout: full screen, vertically and horizontally centred card (440px wide)

Top of card:
- Xylar wordmark in Playfair Display, 28px, var(--text-primary)
- Below wordmark: "Relationship Manager Portal" in Inter 12px var(--text-muted), 
  letter-spacing 0.08em, uppercase

Form fields (styled inputs, no library):
- Label above each input, 11px uppercase, var(--text-muted)
- Input: full width, 44px height, var(--border) border, var(--radius)
- On focus: border becomes var(--accent), no glow, no shadow
- RM ID field placeholder: "RM — 00001"
- Password field with show/hide toggle, eye icon right-aligned inside input

Login button:
- Full width, 44px height, background var(--accent), white text
- Inter 13px font-weight 500
- No border radius change from standard
- Hover: opacity 0.92, no transform

Trust strip (below button, above page bottom):
- 1px top border var(--border)
- padding-top: 20px
- Three items in a row, centred, gap-8:
  Each item: small icon (12px) + text in Inter 11px var(--text-muted)
  Items: "SEBI Registered" | "Data via CAMS" | "256-bit Encrypted"
  Use simple inline SVG icons — shield, database, lock

Bottom of full page (not inside card):
- Inter 11px var(--text-muted) centred:
  "Xylar operates under RBI's Account Aggregator (AA) framework. 
   Client data never leaves the consent boundary."


── SCREEN 2: RM Home (/home)
Top navigation bar:
- Height 56px, background white, 1px bottom border var(--border)
- Left: Xylar wordmark 18px Playfair Display
- Right: RM name "Arjun Mehta" + a small circle avatar with initials "AM"
  + a thin vertical separator + "Sign out" in 12px var(--text-muted)

Centre of page (vertically centred):
- "Good morning, Arjun." — Playfair Display 32px var(--text-primary)
- Below it 8px: "Ready to start a client session." — Inter 14px var(--text-muted)
- Below 40px: One card, 480px wide, centred:
  padding 28px, border var(--border), border-radius var(--radius-lg)
  Left-aligned content inside:
    "New Client Session" — Inter 15px font-weight 600
    "Select a portfolio and walk through the full analysis." — 13px var(--text-muted)
  Right side of card: arrow icon →
  Full card is clickable → goes to /onboarding
- Below card in small text: "10 demo sessions available this month"

Trust badge row at bottom of page:
- Same 3 items as login screen trust strip
- Centred, same styling


── SCREEN 3: Portfolio Selection (/onboarding)
Page header:
- "Select a Portfolio" — Playfair Display 24px
- Below: "Choose a sample portfolio to begin, or upload the client's 
   Consolidated Account Statement (CAS)." — 13px var(--text-muted)

Three portfolio cards in a row (equal width, gap-6):
Each card:
- Border var(--border), radius var(--radius-lg), padding 28px
- Top: portfolio label in Inter 15px font-weight 600
- Below: description in 12px var(--text-muted)
- Below: 3 stat rows:
    "Funds" — number
    "Horizon" — "5+ years" / "7+ years" / "10+ years"  
    "Risk Profile" — "Low–Medium" / "Medium–High" / "High"
- Bottom of card: a thin top-bordered section:
    Total Invested: ₹X,XX,XXX — Inter 13px, number in var(--accent) font-weight 600
- Selected state: border becomes 2px var(--accent), background var(--accent-light)
- Hover: background var(--accent-light) — subtle

Below the three cards:
- Horizontal rule with "or" centred in it (standard divider)
- CAS Upload section:
    Dashed border box, full width, 80px tall, centred content:
    Upload icon + "Upload CAS Statement (PDF)" in 13px
    Below: "Includes complete transaction history and zero holdings" in 11px var(--text-muted)
    Clicking it triggers a file input (accept=".pdf") — on upload, 
    show filename and a green checkmark. No actual parsing.

Continue button:
- Bottom right aligned
- Same button style as login
- Disabled state: opacity 0.4, cursor not-allowed — until a portfolio is selected


── SCREEN 4: Act 1 — Global MF Intelligence (/insights)
This screen has NO client data. It is about the market.

Page header section (48px padding top):
- Label above heading: "ACT 1" — 10px uppercase Inter var(--accent) letter-spacing 0.12em
- Heading: "The Mutual Fund Landscape" — Playfair Display 28px
- Subheading: "Before we look at your portfolio, here is what the data 
   says about how the industry actually works." — 14px var(--text-muted) max-width 560px

Three insight panels stacked vertically (full width, gap-8):

Panel 1 — Scheme Proliferation:
- Card with padding 36px
- Left column (40% width):
    Insight label: "01" in 11px var(--text-muted) uppercase
    Heading: "More funds have not meant better outcomes." — Playfair Display 20px
    Body: "The Indian Mutual Fund market has grown from 1,624 schemes 
    in 2015 to 3,892 in 2024 — across the same 36 SEBI categories. 
    Most of this growth is duplication, not innovation." — 13px var(--text-secondary) 
    line-height 1.7
- Right column (60% width):
    Recharts LineChart — data from marketInsights.schemeProlif
    X: year, Y: funds
    Line: stroke var(--accent) strokeWidth 2, no dots
    No gridlines, only bottom axis
    Y-axis label: "Number of Schemes"
    Axis tick style: 11px Inter var(--text-muted)

Panel 2 — What Actually Drives Alpha:
- Card with padding 36px
- Two column layout inside:
  Left: "What investors track" — header in 12px uppercase var(--text-muted)
    List of 4 items, each with a subtle ✕ prefix in var(--negative):
    1-year returns | Star ratings | Fund house brand | Recent NAV highs
  Right: "What actually drives alpha" — header in 12px uppercase var(--accent)
    List of 4 items, each with a subtle ✓ prefix in var(--positive):
    Return consistency | Drawdown recovery speed | 
    Portfolio overlap contribution | Sector drift stability
  Visual: a thin vertical separator line between columns

Panel 3 — SIP vs Lumpsum XIRR:
- Card with padding 36px
- Left column (40%): Same label/heading/body structure as Panel 1
    Heading: "Discipline in entry timing matters more than timing the market."
    Body: "Across every equity category, systematic SIP (Systematic Investment Plan) 
    entries have consistently outperformed random lumpsum entries 
    by 2 to 7 percentage points in XIRR."
- Right column (60%):
    Recharts BarChart — grouped bars, data from marketInsights.sipVsLumpsum
    Two bars per category: SIP XIRR (var(--accent)) and Lumpsum XIRR (#A09D97)
    Bar radius: 3px top corners only
    Legend: simple text labels below chart

Bottom of page:
- Right-aligned button: "View Portfolio Analysis →"
- Below it in 11px var(--text-muted): "Using: [selected portfolio name]"


── SCREEN 5: Act 2 — Lifetime Waterfall (/analysis)
This is the main screen. Maximum information, minimum noise.

Top stats row — 4 metric cards in a row:
Each card:
- Label: 11px uppercase Inter var(--text-muted)
- Value: 28px Playfair Display var(--text-primary)
- Sub-value: 12px var(--text-secondary)

Cards:
1. "Total Invested" — ₹14,30,000
2. "Current Value" — ₹17,61,000
3. "Your XIRR" — 9.6% — sub: "Actual return rate"
4. "Xylar XIRR" — 12.1% — sub: "Policy-based projection"
   This card: border-left: 3px solid var(--accent)

Between card 3 and 4: a small column showing "+2.5%" in var(--positive) 
with a tiny arrow ↑ — the gap is the story

Waterfall Timeline (main section):
- Horizontal scrollable timeline
- Base line: 1px var(--border) horizontal line
- Each investment event: a vertical stem + a circle at top
  Large lumpsums: 16px circle, var(--accent) filled
  SIP entries: 6px circle, var(--border) filled var(--accent-light)
  On hover: tooltip showing fund name, amount, date, XIRR at entry
- Ghost line: Xylar's projected trajectory — dashed, 1px, var(--text-muted)
  runs parallel above the actual value line
- Actual value line: solid 2px var(--accent)

Signal chips row (below timeline):
4 chips in a row — each chip:
- Background var(--accent-light), border 1px var(--accent) at 30% opacity
- 11px Inter, var(--accent), padding 6px 14px, border-radius 20px
- A small coloured dot before label:
  var(--warning) for Allocation Drift and Entry Timing
  var(--negative) for Overlap
  var(--text-muted) for Tax Exposure
- Clicking any chip → opens right panel (Screen 6)

Evidence panel slides in from right (480px wide):
- Does not push content — overlays with a backdrop blur(0px) and 
  a 1px left border var(--border)
- Close button top-right: ✕ 14px var(--text-muted)
- Content follows strict order (always):
  1. Signal label — 11px uppercase var(--warning) or var(--negative)
  2. Heading — Playfair Display 20px — one sentence
  3. Impact line — "₹84,000 in opportunity cost (210 bps)" — 
     Inter 15px font-weight 600 var(--negative)
  4. Explanation — 2 sentences max, 13px var(--text-secondary) line-height 1.7
  5. Chart — appropriate recharts chart, same styling rules
  6. Xylar recommendation — 1 line in var(--accent) with a → prefix
  7. "Review" button — outline style, var(--accent) border and text, 
     full width of panel


── SCREEN 6: Current Portfolio Intelligence (/portfolio)
Accessible from a tab or link on Screen 5.

Header:
- "Current Portfolio" — Playfair Display 22px
- "Showing top issues by priority" — 12px var(--text-muted)

Problem cards (max 5, stacked):
Each card:
- padding 24px, border var(--border), radius var(--radius)
- Left border 3px: var(--warning) for medium, var(--negative) for high priority
- Problem name: Inter 14px font-weight 600
- One-line description: 12px var(--text-secondary)
- Right side: impact amount in var(--negative) font-weight 600
- Expand arrow — clicking shows the evidence panel (same as Screen 5 panel)

Fund holdings table below problem cards:
- Clean table, no background on header row — just a bottom border
- Columns: Fund Name | Category | Allocation % | XIRR | Current Value
- Row hover: background var(--accent-light)
- Alternating rows: no background change — clean white throughout
- Allocation % shown as text + a thin inline bar (max 80px) 
  in var(--accent-light) with var(--accent) fill


── SCREEN 7: PDF Export
Not a screen — a function.
On click of "Export Analysis" button (visible on Screen 5 and Screen 6):
- Use window.print() with a print-specific CSS stylesheet
- Print stylesheet hides: navigation, buttons, signal chips interaction
- Shows: all stats, the timeline (static), the problem cards
- Page header in print: Xylar wordmark left + date right + 
  "Confidential — RM Use Only" in 11px centred below

─────────────────────────────────────────
ROUTING
─────────────────────────────────────────
/login           → Screen 1
/home            → Screen 2 (protected — redirect to /login if no session)
/onboarding      → Screen 3
/insights        → Screen 4
/analysis        → Screen 5
/portfolio       → Screen 6

Session: store selected portfolio in React Context. 
No localStorage. No cookies. Context only.

─────────────────────────────────────────
NAVIGATION COMPONENT
─────────────────────────────────────────
From Screen 4 onwards, a persistent top nav:
- Height 56px, white background, 1px bottom border var(--border)
- Left: Xylar wordmark
- Centre: breadcrumb — "MF Intelligence → Portfolio Analysis" in 12px var(--text-muted)
- Right: selected portfolio name chip + "Change" link in var(--accent) 12px
  + separator + RM name

─────────────────────────────────────────
WHAT NOT TO DO — READ THIS
─────────────────────────────────────────
- No card hover transforms (translateY, scale) — nothing moves
- No loading spinners — use the thin line animation or nothing
- No toast notifications — errors show inline, quietly
- No modal dialogs — side panels only
- No colour outside the design system — not even for chart series colours, 
  use: var(--accent), #6B8CAE, #A8BECE as your only 3 chart colours
- No border-radius above var(--radius-lg) anywhere
- No font sizes below 11px
- No font sizes above 32px except the RM greeting on Screen 2
- Never use font-weight 700 — maximum is 600
- No placeholder text in charts — if data is available, show it

─────────────────────────────────────────
START HERE — EXACT ORDER
─────────────────────────────────────────
1. Create /src/data/ files with all mock data
2. Set up React Router with all routes
3. Create the design system in index.css (CSS variables + base styles)
4. Build the shared Nav component
5. Build Screen 1 (Login) — get the trust strip right
6. Build Screen 2 (RM Home)
7. Build Screen 3 (Portfolio Selection) — get card selection state right
8. Build Screen 4 (Market Insights) — get charts right
9. Build Screen 5 (Waterfall Analysis) — this is the hero screen
10. Build the Evidence Panel as a shared component used by Screen 5 and 6
11. Build Screen 6 (Portfolio Intelligence)
12. Add print stylesheet for PDF export

Do not move to the next screen until the current one matches 
the spec exactly. Quality over speed.