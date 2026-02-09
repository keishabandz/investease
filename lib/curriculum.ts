export type Lesson = {
  id: string;
  title: string;
  objective: string;
  activities: string[];
  masterySignals: string[];
};

export const foundationalChecklist = [
  "Select one listed business and map what it sells, who buys it, and how it makes money.",
  "Identify major revenue streams, major costs, and one long-term growth driver.",
  "Document competitive pressure, barriers to entry, and key business risks.",
  "Write one reflection on how evidence changed your original assumption."
];

export const intermediateLessons: Lesson[] = [
  {
    id: "business-models",
    title: "Business Models and Industry Forces",
    objective: "Compare three listed businesses and explain which has stronger structural advantages.",
    activities: [
      "Map each business model: revenue sources, cost base, and customer type.",
      "Score industry forces: buyer power, supplier power, substitution risk, and rivalry.",
      "Rate barriers to entry as high, medium, or low with reasoning."
    ],
    masterySignals: [
      "Complete a 3-business comparison worksheet.",
      "Explain one durable advantage and one possible erosion risk."
    ]
  },
  {
    id: "management-quality",
    title: "Assessing Leadership and Capital Allocation",
    objective: "Evaluate leadership quality from decisions, communication, and ownership alignment.",
    activities: [
      "Collect examples of clear and unclear decision-making from investor updates.",
      "Review reinvestment choices, debt usage, and return goals.",
      "Score transparency using a reusable rubric."
    ],
    masterySignals: [
      "Provide one positive and one negative leadership case with three evidence points each."
    ]
  },
  {
    id: "portfolio-management",
    title: "Portfolio Construction and Risk Positioning",
    objective: "Position holdings according to conviction, downside risk, and diversification need.",
    activities: [
      "Identify highest and lowest sector exposure.",
      "Set target position sizes using probability-weighted risk/reward.",
      "Create rebalance rules for new information and thesis breaks."
    ],
    masterySignals: ["Submit a portfolio map with risk notes and action triggers."]
  },
  {
    id: "fair-value",
    title: "Estimating Fair Value",
    objective: "Use simple valuation assumptions to classify opportunities as fair, high, or low priced.",
    activities: [
      "Build baseline, optimistic, and conservative cases.",
      "Estimate value range and margin of safety.",
      "Document assumptions in plain language."
    ],
    masterySignals: ["Label three opportunities with valuation rationale."]
  },
  {
    id: "idea-discovery",
    title: "Discovering New Ideas",
    objective: "Expand beyond current holdings into underrepresented sectors.",
    activities: [
      "Use screeners to find one opportunity in an unfamiliar segment.",
      "Run a quick quality and risk triage.",
      "Decide whether to watch, research deeper, or reject."
    ],
    masterySignals: ["Add at least one new sector exposure to watchlist or portfolio plan."]
  },
  {
    id: "investor-psychology",
    title: "Investor Psychology",
    objective: "Reduce bias-driven decisions with a personal checklist.",
    activities: [
      "Identify one previous mistake and the bias behind it.",
      "Build a pre-buy checklist for evidence quality, position sizing, and downside planning.",
      "Practice journaling before and after decisions."
    ],
    masterySignals: ["Submit a personal anti-bias checklist and one reflection entry."]
  }
];
