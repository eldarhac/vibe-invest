Coding Agent Prompt: Build a “Vibe Investing” System

You are a senior product-minded full-stack engineer. Your task is to design and implement an MVP for a “Vibe Investing” system: a consumer-friendly investing assistant that lets users express an investment intuition, worldview, trend belief, or “vibe” in plain language, then turns that into an understandable, research-backed, diversified investment idea.

The system should feel simple, calm, trustworthy, and fun — not like a Bloomberg terminal. The core UX goal is:

A normal person should be able to say “I think people will spend more on pets and wellness” or “I believe AI data centers will keep booming” and receive a clear, explainable basket of stocks/ETFs/themes, with risks, rationale, and an easy path to refine it.

This is not meant to execute trades directly in the MVP. It should generate research, portfolio ideas, watchlists, and educational explanations.

1. Product Concept

Build a web app called Vibe Investing.

Users enter a “vibe” such as:

“Remote work is here to stay”

“Women’s sports are going mainstream”

“AI data centers will need massive energy”

“People are going to keep buying premium pet products”

“Cybersecurity will keep growing because AI makes attacks easier”

“I want to invest in companies benefiting from GLP-1 weight-loss drugs”

“I think Gen Z is spending more on beauty, fashion, and wellness”

“I want exposure to nuclear energy and uranium”

“I believe the Indian middle class will grow”

The app should transform this into:

Theme interpretation

Investable angles

Potential stocks and ETFs

Reasoning for each candidate

Risk warnings

Diversified sample basket

Confidence / evidence level

Plain-English explanation

Follow-up refinement questions

The user should never feel like they need to know finance jargon.

2. Important Legal / Safety Framing

This product must not present itself as a registered financial adviser.

Every output should clearly state that it is for educational and research purposes only, not personalized financial advice.

The app should avoid language like:

“You should buy”

“Guaranteed upside”

“Safe investment”

“This will outperform”

“Best stock to buy now”

Use language like:

“Potential exposure”

“Companies commonly associated with this theme”

“A sample research basket”

“This may be worth researching”

“Risks to consider”

“This is not financial advice”

The system should not ask for highly sensitive financial information in the MVP. It can ask simple preference questions, such as:

Risk tolerance: low / medium / high

Time horizon: short / medium / long

Preference: ETFs / individual stocks / both

Geography: US only / global / emerging markets

Sector concentration comfort

Do not make personalized suitability recommendations. Phrase outputs as educational examples.

3. Core User Flow

Landing Page

The landing page should be extremely simple.

Primary headline:

Invest in what you believe is happening.

Subheadline:

Describe a trend, cultural shift, technology, behavior, or “vibe” — and get a clear investment research map in seconds.

Main input box placeholder examples:

“AI will create huge demand for electricity”“People are spending more on pets”“I think women’s sports will explode”“Cybersecurity will become more important”

Primary CTA:

Explore this vibe

Secondary CTA:

Try an example

The page should include a few clickable example chips:

AI infrastructure

Pet economy

Longevity

Cybersecurity

Nuclear energy

GLP-1 drugs

Creator economy

India growth

Luxury slowdown

Defense technology

UX should feel modern, minimal, friendly, and slightly playful — but still credible.

4. Vibe Input UX

After the user enters a vibe, show a “clarification layer” only if needed.

Do not overwhelm the user with a long questionnaire.

Ask at most 3 quick questions, each with pill-style options.

Example:

To shape this research map, choose a style:

Question 1: “What kind of exposure do you prefer?”

ETFs only

Stocks only

Mix of both

Not sure

Question 2: “How concentrated should this be?”

Broad and diversified

Balanced

High-conviction / focused

Question 3: “Region?”

US only

Global

Developed markets

Emerging markets

No preference

There should also be a “Skip and generate” button.

The user should never get stuck.

5. Output Page Structure

The output should be organized into a beautiful, readable report.

Use cards, sections, and progressive disclosure. Avoid dense tables at the top.

The top summary should appear first.

A. Vibe Summary Card

Title example:

Vibe: AI Data Centers Need Massive Energy

Show a plain-English interpretation:

You believe the growth of AI computing will increase demand for electricity, grid infrastructure, cooling, semiconductors, and data-center real estate.

Include tags:

AI infrastructure

Energy demand

Semiconductors

Utilities

Data centers

Grid equipment

Include a confidence/evidence indicator:

Evidence level: Medium-High

Do not make this feel like a stock rating. It should indicate how directly investable and evidence-supported the theme is.

B. Investable Angles

Show 3–6 “angles” derived from the vibe.

For example, for “AI data centers need massive energy”:

Data-center operators

Companies that own or operate data-center infrastructure.

Semiconductors and AI hardware

Companies producing GPUs, networking chips, and AI accelerators.

Power generation

Utilities and energy providers that may benefit from increased demand.

Grid equipment

Companies providing transformers, electrical equipment, cables, and grid upgrades.

Cooling and infrastructure

HVAC, thermal management, and industrial infrastructure providers.

Nuclear / clean baseload power

Companies exposed to uranium, nuclear power, or long-term clean power contracts.

Each angle should explain:

Why this angle is connected to the vibe

How direct the exposure is

What could go wrong

Example stocks/ETFs

C. Candidate Investments

Present candidates in a friendly card format, not only a table.

Each candidate card should include:

Ticker

Company or ETF name

Category

Exposure type: Direct / Indirect / Diversified

Why it fits the vibe

Main risk

Market cap or AUM if available

Optional: 1-year chart sparkline placeholder

Optional: “Add to basket” button

Example card:

NVDA — NVIDIA
Category: AI chips
Exposure: Direct

Why it fits:
NVIDIA sells GPUs and networking hardware used in AI data centers.

Main risk:
The stock may already price in very high growth expectations.

Role in basket:
High-conviction growth exposure.

Do not bury users in 50 tickers. The first result should show around 8–15 candidates maximum.

Allow the user to expand:

Show more candidates

D. Sample Basket

Create a sample research basket based on the selected preference.

Example:

Balanced Basket Example
For educational purposes only — not financial advice.

40% Broad thematic ETF exposure
20% AI hardware
15% Data-center infrastructure
15% Power/grid infrastructure
10% speculative satellite exposure

Then show actual example tickers and weights.

Important: weights should always be framed as sample educational allocations, not recommendations.

Each basket should include:

Number of holdings

Concentration score

Theme purity score

Diversification explanation

Risks

Suggested watchlist metrics

The user should be able to toggle basket style:

Conservative

Balanced

Aggressive

ETF-heavy

Stock-heavy

E. Risks and Counterarguments

This section is extremely important.

For every vibe, include a “What could break this thesis?” section.

Examples:

For AI energy demand:

AI model efficiency improves, reducing compute needs.

Companies overbuild data centers.

Regulation slows new energy infrastructure.

Valuations already reflect the boom.

Power bottlenecks hurt data-center growth rather than help all suppliers.

The benefit may accrue to private companies instead of public equities.

This section should be prominent and written clearly.

Use a visual style like:

⚠️ Risks to think about

But do not make the product alarmist.

F. Vibe-to-Investment Map

Create a simple visual or structured map:

Your belief:
AI adoption grows

Leads to:
More compute demand

Requires:
Data centers, chips, networking, power, cooling

Investable areas:
Semiconductors, REITs, utilities, grid equipment, energy

Possible tickers:
NVDA, AMD, AVGO, EQIX, DLR, VRT, ETN, NEE, SMR, URA

This should help users understand the causal chain.

The product should make the “why” very obvious.

G. Follow-Up Refinement

At the bottom, offer conversational refinements.

Example buttons:

Make this more conservative

Show ETF-only version

Remove expensive mega-cap stocks

Add international exposure

Focus on small caps

Explain like I’m new to investing

What would disprove this vibe?

Compare this vibe to another one

Build a watchlist

The app should feel like an interactive research assistant, not a static report.

6. UX Principles

The UX should follow these principles:

1. Plain language first

Use simple explanations before financial terminology.

Bad:

This theme provides exposure to capex beneficiaries in hyperscale infrastructure.

Good:

If AI companies build more data centers, they may need more chips, buildings, electricity, and cooling systems. These are the areas this basket explores.

2. Never make users feel stupid

If the user enters a vague vibe, interpret it generously.

Example user input:

“People are lonely”

The app should not reject it. It should respond:

This could map to several investable themes: dating apps, social media, gaming, pets, mental health, wellness, senior care, and community platforms.

Then ask:

Which direction do you mean?

3. Use progressive disclosure

Show the simple answer first. Let users expand into details.

Default view:

Summary

Angles

Sample basket

Risks

Expandable details:

Valuation data

Revenue exposure

Latest news

Financial metrics

Alternative tickers

Methodology

4. Make risk unavoidable

Do not hide risk warnings in tiny text.

Every basket should include:

Main risk

Concentration risk

Valuation risk

Theme risk

Data freshness note

5. Make uncertainty visible

The system should say when something is indirect, speculative, or hard to invest in.

Example:

This is a culturally strong vibe but not a clean public-market theme. Many beneficiaries may be private companies, so public stock exposure is indirect.

6. Give the user control

The user should be able to say:

“More ETFs”

“Less risky”

“No China”

“Only profitable companies”

“Avoid mega-cap tech”

“More long-term”

“Show me why this could fail”

“Compare with another vibe”

7. Data Model

Use a structured backend representation.

Suggested TypeScript interfaces:

type VibeInput = {
  rawText: string;
  userPreferences?: {
    exposurePreference?: "etfs" | "stocks" | "mixed" | "unsure";
    riskLevel?: "low" | "medium" | "high";
    geography?: "us" | "global" | "developed" | "emerging" | "unsure";
    concentration?: "broad" | "balanced" | "focused";
    timeHorizon?: "short" | "medium" | "long" | "unsure";
  };
};

type VibeAnalysis = {
  title: string;
  plainEnglishInterpretation: string;
  tags: string[];
  evidenceLevel: "low" | "medium" | "medium-high" | "high";
  investabilityScore: number; // 0-100
  themePurityScore: number; // 0-100
  angles: InvestableAngle[];
  candidates: InvestmentCandidate[];
  sampleBaskets: SampleBasket[];
  risks: RiskItem[];
  counterarguments: string[];
  causalMap: CausalMapNode[];
  followUpSuggestions: string[];
  disclaimers: string[];
};

type InvestableAngle = {
  name: string;
  description: string;
  directness: "direct" | "indirect" | "speculative";
  whyConnected: string;
  whatCouldGoWrong: string;
  exampleTickers: string[];
};

type InvestmentCandidate = {
  ticker: string;
  name: string;
  type: "stock" | "etf" | "reit" | "fund";
  category: string;
  exposureType: "direct" | "indirect" | "diversified" | "speculative";
  whyItFits: string;
  mainRisk: string;
  roleInBasket: string;
  region?: string;
  marketCapOrAum?: string;
  confidence?: "low" | "medium" | "high";
};

type SampleBasket = {
  name: string;
  description: string;
  style: "conservative" | "balanced" | "aggressive" | "etf-heavy" | "stock-heavy";
  holdings: BasketHolding[];
  concentrationScore: number; // 0-100
  diversificationNotes: string;
  majorRisks: string[];
};

type BasketHolding = {
  ticker: string;
  name: string;
  weight: number;
  role: string;
};

type RiskItem = {
  title: string;
  explanation: string;
  severity: "low" | "medium" | "high";
};

type CausalMapNode = {
  step: number;
  title: string;
  description: string;
};

8. Backend Architecture

Implement the MVP with a modular architecture.

Suggested stack:

Frontend: Next.js + React + TypeScript

Styling: Tailwind CSS

Backend: Next.js API routes or Node service

LLM layer: abstraction around the model provider

Market data provider: mock provider first, real provider later

Storage: Postgres or SQLite for MVP

Auth: optional for MVP, but design with future accounts in mind

Recommended modules:

/src
  /app
    /page.tsx
    /vibe/[id]/page.tsx
  /components
    VibeInput.tsx
    ExampleVibeChips.tsx
    ClarificationPanel.tsx
    VibeSummaryCard.tsx
    InvestableAngles.tsx
    CandidateCard.tsx
    SampleBasket.tsx
    RiskSection.tsx
    CausalMap.tsx
    FollowUpActions.tsx
  /lib
    vibeParser.ts
    vibeAnalyzer.ts
    basketBuilder.ts
    riskEngine.ts
    marketData.ts
    disclaimers.ts
    prompts.ts
    validators.ts
  /types
    vibe.ts
  /api
    analyze-vibe
    refine-vibe
    market-data

9. LLM Prompting Logic

Create a system that turns raw vibes into structured JSON.

The LLM should not directly produce the final UI copy only. It should produce a structured VibeAnalysis object that the UI renders.

The LLM prompt should instruct the model to:

Interpret the user’s vibe generously.

Identify public-market investment angles.

Distinguish direct exposure from indirect exposure.

Include ETFs when possible.

Include risks and counterarguments.

Avoid investment advice language.

Avoid making up financial data.

Mark uncertain or speculative links clearly.

Return valid JSON matching the schema.

Example internal LLM prompt:

You are an investment research assistant for an educational product called Vibe Investing.

The user will provide a plain-English belief, trend, intuition, cultural observation, or “vibe.”

Your job is to translate that vibe into a structured investment research map.

Rules:
- Do not give personalized financial advice.
- Do not say “buy,” “sell,” “hold,” “guaranteed,” or “safe.”
- Use educational phrasing.
- Prefer clear, plain English.
- Identify multiple investable angles.
- Include both stocks and ETFs when appropriate.
- Explain direct vs indirect exposure.
- Include risks and counterarguments prominently.
- If the theme is not cleanly investable, say so.
- Do not invent market caps, AUM, prices, performance, or financial metrics.
- If specific financial data is unavailable, use null or “data unavailable.”
- Return only valid JSON matching the provided schema.

User vibe:
{{rawVibe}}

User preferences:
{{preferences}}

Return a complete VibeAnalysis object.

10. Basket Construction Logic

Do not let the LLM freely invent random weights without constraints.

Implement a deterministic basketBuilder function that takes candidate investments and user preferences, then creates baskets.

Basic rules:

ETF-heavy basket

60–90% ETFs

10–40% individual stocks

Maximum single stock weight: 10%

Maximum single ETF weight: 40%

Balanced basket

30–60% ETFs

40–70% individual stocks

Maximum single stock weight: 15%

Include at least 5 holdings if available

Aggressive basket

More individual stocks

More direct exposure

May include speculative names

Maximum single stock weight: 20%

Must show high concentration warning

Conservative basket

Prefer broad ETFs

Avoid speculative candidates

Avoid highly indirect moonshot names

Include clear caveat that conservative does not mean risk-free

The basket builder should:

Avoid duplicate exposures where possible

Prevent excessive concentration in one mega-cap unless user explicitly asks

Prefer candidates with clearer exposure

Include at least one diversified instrument if available

Add warnings when the theme is narrow

11. Market Data Handling

For MVP, you may use mocked market data or a placeholder provider.

Create a clean provider interface:

type MarketData = {
  ticker: string;
  name: string;
  price?: number;
  marketCap?: number;
  aum?: number;
  expenseRatio?: number;
  oneYearReturn?: number;
  sector?: string;
  region?: string;
  lastUpdated?: string;
};

interface MarketDataProvider {
  getTickerData(ticker: string): Promise<MarketData | null>;
  searchTickers(query: string): Promise<MarketData[]>;
}

UX requirement:

If data is missing, do not break the UI. Show:

Market data unavailable

or

Data not loaded yet

Never show fake numbers as if they are real.

12. Trust and Transparency Features

Add a “How this was built” section.

It should explain:

We interpreted your vibe as a possible investment theme.
We mapped the theme to public-market sectors and companies.
We separated direct exposure from indirect exposure.
We generated an educational sample basket.
This is not financial advice and does not consider your personal financial situation.

Add a “Data freshness” label:

Generated on: [date]
Market data last updated: [date or unavailable]

Add a “Why am I seeing this?” explanation for each candidate.

Example:

Why this appears:
This company is included because it has business exposure to power infrastructure used by data centers.

13. Empty / Difficult State Handling

The system should gracefully handle vague or non-investable vibes.

Example: “I think people are lonely”

Response:

This vibe can map to several possible investment themes. Choose the direction closest to what you mean:

1. Pets and companionship
2. Dating and social apps
3. Gaming and virtual worlds
4. Mental health and wellness
5. Senior care
6. Community platforms

Example: “I want to invest in happiness”

Response:

“Happiness” is broad, so here are possible investable interpretations:
- Travel and leisure
- Entertainment
- Wellness
- Pets
- Gaming
- Alcohol and social venues
- Mental health platforms

Which one should we explore?

Example: “I want to invest in world peace”

Response:

This is a meaningful idea, but it is not a clean public-market investment theme. Some adjacent areas could include international development finance, infrastructure, renewable energy, education, or defense de-escalation technologies. Public equity exposure may be indirect.

The user should feel guided, not rejected.

14. UI Components

VibeInput

Requirements:

Large textarea

Placeholder examples rotating every few seconds

Submit button disabled only when input is empty

Keyboard shortcut: Cmd/Ctrl + Enter to submit

Example chips below

Friendly microcopy:

No finance jargon needed. Just describe what you think is happening.

VibeSummaryCard

Show:

Vibe title

Plain-English interpretation

Tags

Evidence level

Investability score

Educational disclaimer

InvestableAngles

Show cards with:

Angle name

Why it matters

Directness badge

Example tickers

Risk note

CandidateCard

Show:

Ticker and name

Type badge

Exposure badge

Why it fits

Main risk

Add/remove from basket button

Expandable details

SampleBasket

Show:

Basket style

Holdings and weights

Visual allocation bar

Diversification note

Risk warning

Button: “Adjust basket”

RiskSection

Must be visually prominent.

Show:

Key risks

Counterarguments

What would disprove the vibe

FollowUpActions

Clickable prompts:

More conservative

More aggressive

ETF-only

Stock-only

Explain simply

Show counterargument

Compare another vibe

Save to watchlist

15. Visual Design Direction

The app should feel:

Friendly

Clean

Calm

Slightly futuristic

Not intimidating

More like Spotify/Notion than a brokerage app

Less like a trading terminal

Use:

Rounded cards

Plenty of whitespace

Soft backgrounds

Clear typography

Badges for exposure/risk/directness

Small icons only where helpful

Subtle animations

Skeleton loading states

Avoid:

Flashing red/green trading colors

Aggressive “buy now” CTAs

Overly dense stock tables

Meme-stock energy

Casino-like UX

Day-trading aesthetics

16. Example Output

For input:

AI data centers will create a huge need for electricity.

Expected output should resemble:

Vibe: AI Data Centers Need Power

Interpretation:
You believe AI adoption will increase demand for data centers, which may increase demand for electricity, grid infrastructure, cooling systems, and specialized chips.

Investable angles:
1. AI chips
2. Data-center operators
3. Power generation
4. Grid infrastructure
5. Cooling systems
6. Nuclear and clean baseload power

Example candidates:
- NVDA — AI chips, direct but valuation-sensitive
- AMD — AI accelerators, direct but competitive
- AVGO — networking and custom chips, direct/indirect
- EQIX — data-center REIT, infrastructure exposure
- DLR — data-center REIT, infrastructure exposure
- VRT — cooling and power infrastructure
- ETN — electrical equipment and grid infrastructure
- NEE — renewable utility exposure
- URA — uranium ETF, thematic but indirect
- GRID — smart grid ETF, diversified grid exposure

Sample balanced basket:
- 20% GRID
- 15% EQIX
- 15% VRT
- 15% ETN
- 10% NVDA
- 10% AVGO
- 10% NEE
- 5% URA

Risks:
- AI infrastructure demand may be overestimated.
- Valuations may already reflect expected growth.
- Utilities may face regulatory pressure.
- Data-center power bottlenecks may slow growth.
- Efficiency improvements could reduce compute intensity.
- Some beneficiaries may be private companies.

Again, all of this should be framed as educational research, not advice.

17. MVP Scope

Build the MVP with the following features:

Must have

Landing page with vibe input

Example vibe chips

Clarification panel

Vibe analysis API

Structured output page

Investable angles

Candidate investment cards

Sample basket

Risk section

Follow-up refinement buttons

Basic loading states

Error handling

Educational disclaimer

Nice to have

Save vibe to local storage

Watchlist builder

Compare two vibes

Export to PDF

Shareable link

Light/dark mode

Sparkline charts

Real market data integration

User accounts

Do not overbuild. Prioritize a delightful core experience.

18. Refinement Interaction

When the user clicks a refinement button, call the refinement API with:

type RefinementRequest = {
  originalVibe: string;
  currentAnalysis: VibeAnalysis;
  refinementInstruction: string;
};

Examples:

Make this ETF-only.
Make this less risky.
Remove companies with indirect exposure.
Add global exposure.
Explain this to a beginner.
Show what would disprove this thesis.
Compare this with a cybersecurity vibe.

The refinement should update the relevant sections without losing context.

19. Testing Requirements

Write tests for:

Vibe input submission

Empty input validation

Clarification skip flow

API returns valid schema

Basket weights sum to 100

Basket max concentration rules

Candidate cards render missing data gracefully

Risk section always appears

Disclaimer always appears

ETF-only refinement removes individual stocks

Conservative basket excludes speculative candidates

Vague vibe produces clarification options

20. Acceptance Criteria

The MVP is successful if:

A user can enter a plain-English vibe.

The system creates a clear investment research map.

The output is understandable to a non-finance user.

The output includes risks and counterarguments.

The app does not imply guaranteed returns or personalized financial advice.

The sample basket is visibly educational.

The user can refine the result easily.

The UI feels polished, calm, and trustworthy.

The app handles vague vibes gracefully.

The app never invents market data.

21. Final Product Philosophy

This product is not a trading app.

It is a translation layer between:

“I think the world is moving in this direction”

and

“Here are public-market ways people might research that idea, here is how direct or indirect they are, and here are the risks.”

The best version of this product makes users feel:

Smarter

Calmer

More in control

Less intimidated by investing

More aware of uncertainty

It should not make them feel rushed, hyped, or manipulated.

Build accordingly.
