export const MAIN_DISCLAIMER =
  "This is for educational and research purposes only, not personalized financial advice. Always consult a qualified financial adviser before making investment decisions.";

export const BASKET_DISCLAIMER =
  "Sample educational allocation — not a recommendation. Weights are illustrative only.";

export const DATA_FRESHNESS_NOTE = (date: Date): string =>
  `Generated on: ${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. Market data: unavailable in this version.`;

export const HOW_THIS_WAS_BUILT = [
  "We interpreted your vibe as a possible investment theme.",
  "We mapped the theme to public-market sectors and companies.",
  "We separated direct exposure from indirect exposure.",
  "We generated an educational sample basket.",
  "This is not financial advice and does not consider your personal financial situation.",
];

export const EXAMPLE_VIBES = [
  "AI infrastructure",
  "Pet economy",
  "Longevity",
  "Cybersecurity",
  "Nuclear energy",
  "GLP-1 drugs",
  "Creator economy",
  "India growth",
  "Luxury slowdown",
  "Defense technology",
];

export const ROTATING_PLACEHOLDERS = [
  "AI will create huge demand for electricity",
  "People are spending more on pets",
  "I think women's sports will explode",
  "Cybersecurity will become more important",
  "Remote work is here to stay",
  "The Indian middle class will grow",
  "I want exposure to nuclear energy",
  "GLP-1 drugs will reshape healthcare",
];

export const REFINEMENT_SUGGESTIONS = [
  "Make this more conservative",
  "Show ETF-only version",
  "Remove expensive mega-cap stocks",
  "Add international exposure",
  "Focus on small caps",
  "Explain like I'm new to investing",
  "What would disprove this vibe?",
  "Compare this vibe to another one",
];
