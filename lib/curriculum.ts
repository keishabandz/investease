export type Lesson = {
  id: string;
  title: string;
  objective: string;
  activities: string[];
  masterySignals: string[];
};

export type TrainingCard = {
  title: string;
  detail: string;
};

export type WorkedExample = {
  business: string;
  revenueModel: string;
  costShape: string;
  customer: string;
  riskSignal: string;
};

export type OpenSourceTask = {
  source: string;
  url: string;
  task: string;
  whyItMatters: string;
};

export type CheckpointQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type ModuleTrainingContent = {
  overview: string[];
  frameworkCards: TrainingCard[];
  workedExamples: WorkedExample[];
  openSourceTasks: OpenSourceTask[];
  checkpoint: CheckpointQuestion[];
};

export type LessonTaxonomy = {
  moduleTags: string[];
  activityTags: string[][];
  assessmentTags: string[];
  evidenceSourceTags: string[];
};

export type GovernanceMeta = {
  version: string;
  lastUpdated: string;
};

export type SourceOfTruthLink = {
  label: string;
  url: string;
  sourceType: "filing" | "economic-data" | "labor-data" | "industry-data" | "policy" | "method";
};

export type ActivityEvidenceMap = {
  activityIndex: number;
  links: SourceOfTruthLink[];
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

export const moduleTrainingContent: Partial<Record<string, ModuleTrainingContent>> = {
  "business-models": {
    overview: [
      "A business model map should connect value creation (what is sold), value capture (how cash is earned), and durability (why the model can defend returns).",
      "Do not score a model on growth alone. Score repeatability, unit economics stability, and exposure to external shocks.",
      "Use evidence from filings and public datasets, then separate facts from assumptions in your write-up."
    ],
    frameworkCards: [
      {
        title: "Revenue Engine",
        detail: "Identify if revenue is transactional, subscription, usage-based, or contract-based. Document concentration risk and renewal behavior."
      },
      {
        title: "Cost Structure",
        detail: "Classify costs into fixed vs variable. High fixed-cost models need capacity utilization discipline to protect margins."
      },
      {
        title: "Customer Dependency",
        detail: "Map who pays, who uses, and who influences purchase decisions. Misalignment between these three often raises churn risk."
      },
      {
        title: "Industry Pressure",
        detail: "Score buyer power, supplier power, substitution, and rivalry from 1 (low pressure) to 5 (high pressure)."
      }
    ],
    workedExamples: [
      {
        business: "Business A (Recurring Service)",
        revenueModel: "Monthly subscription with annual contracts",
        costShape: "Moderate fixed platform costs, low marginal serving cost",
        customer: "Small and mid-sized teams with moderate switching friction",
        riskSignal: "Price pressure if low-cost alternatives improve quality"
      },
      {
        business: "Business B (Transaction Marketplace)",
        revenueModel: "Take-rate per completed transaction",
        costShape: "Marketing-heavy variable costs and support operations",
        customer: "Two-sided participants with mixed loyalty",
        riskSignal: "Volume drops quickly in weak demand cycles"
      },
      {
        business: "Business C (Asset-Heavy Producer)",
        revenueModel: "Unit sales tied to production capacity",
        costShape: "High fixed assets, input-sensitive operating costs",
        customer: "B2B contracts with periodic rebids",
        riskSignal: "Margin compression from input inflation or oversupply"
      }
    ],
    openSourceTasks: [
      {
        source: "SEC EDGAR APIs",
        url: "https://www.sec.gov/edgar/sec-api-documentation",
        task: "Pull the last three annual filings for one listed business and extract segment/revenue disclosures.",
        whyItMatters: "Gives primary-source evidence for revenue model and concentration analysis."
      },
      {
        source: "FRED API",
        url: "https://fred.stlouisfed.org/docs/api/fred/fred/",
        task: "Fetch one macro series tied to demand or financing conditions for your sector and chart trend direction.",
        whyItMatters: "Links business model resilience to economic regime changes."
      },
      {
        source: "BLS Public Data API",
        url: "https://www.bls.gov/bls/api_features.htm",
        task: "Retrieve one labor or producer-price series relevant to the company cost base.",
        whyItMatters: "Provides external signal for cost pressure analysis."
      },
      {
        source: "Census BDS Explorer",
        url: "https://www.census.gov/data/data-tools/bds-explorer.html",
        task: "Check establishment birth/death trends in the target industry to estimate competitive intensity.",
        whyItMatters: "Helps quantify entry/exit pressure rather than relying on narrative only."
      }
    ],
    checkpoint: [
      {
        question: "Which model usually has the highest operating leverage once scaled?",
        options: [
          "Purely transactional model with no retention",
          "Recurring subscription model with low incremental serving cost",
          "Asset-heavy model with volatile input costs"
        ],
        correctIndex: 1,
        explanation: "Low incremental cost plus recurring revenue typically improves margin leverage at scale."
      },
      {
        question: "If buyer power rises materially, which metric is most likely to weaken first?",
        options: [
          "Gross margin and pricing stability",
          "Share count",
          "Cash tax rate"
        ],
        correctIndex: 0,
        explanation: "Stronger buyers can negotiate price, contract terms, or discounts, which pressures gross margin first."
      },
      {
        question: "Why combine filings with external datasets in this module?",
        options: [
          "To replace company disclosures completely",
          "To cross-check assumptions and reduce single-source bias",
          "To avoid writing any reasoning"
        ],
        correctIndex: 1,
        explanation: "Cross-source evidence reduces bias and improves reliability of your structural advantage conclusion."
      }
    ]
  }
};

export const taxonomyByLessonId: Record<string, LessonTaxonomy> = {
  "business-models": {
    moduleTags: ["fundamental-analysis", "industry-structure", "durability"],
    activityTags: [
      ["revenue-modeling", "cost-structure", "customer-segmentation"],
      ["five-forces", "competitive-pressure", "market-dynamics"],
      ["barriers-to-entry", "moat-analysis", "risk-reasoning"]
    ],
    assessmentTags: ["checkpoint-quiz", "evidence-based-judgement", "structural-advantage"],
    evidenceSourceTags: ["sec-filings", "macro-data", "labor-and-cost-data", "industry-demographics"]
  },
  "management-quality": {
    moduleTags: ["leadership-analysis", "capital-allocation"],
    activityTags: [
      ["decision-quality", "communication-clarity"],
      ["reinvestment-policy", "balance-sheet-policy"],
      ["governance-rubric", "transparency"]
    ],
    assessmentTags: ["case-comparison", "evidence-quality"],
    evidenceSourceTags: ["management-disclosures", "historical-capital-returns"]
  },
  "portfolio-management": {
    moduleTags: ["portfolio-construction", "risk-management"],
    activityTags: [
      ["sector-exposure", "concentration-risk"],
      ["position-sizing", "probability-weighting"],
      ["rebalance-rules", "thesis-monitoring"]
    ],
    assessmentTags: ["portfolio-map", "risk-trigger-design"],
    evidenceSourceTags: ["holdings-data", "volatility-data"]
  },
  "fair-value": {
    moduleTags: ["valuation", "scenario-analysis"],
    activityTags: [
      ["base-case", "bull-bear-cases"],
      ["value-range", "margin-of-safety"],
      ["assumption-documentation", "model-explainability"]
    ],
    assessmentTags: ["valuation-rationale", "assumption-integrity"],
    evidenceSourceTags: ["historical-financials", "macro-assumptions"]
  },
  "idea-discovery": {
    moduleTags: ["idea-generation", "opportunity-filtering"],
    activityTags: [
      ["screening", "sector-diversification"],
      ["quick-triage", "risk-scoring"],
      ["decision-framework", "research-prioritization"]
    ],
    assessmentTags: ["watchlist-quality", "decision-discipline"],
    evidenceSourceTags: ["screening-data", "sector-data"]
  },
  "investor-psychology": {
    moduleTags: ["behavioral-finance", "decision-hygiene"],
    activityTags: [
      ["bias-identification", "error-review"],
      ["checklist-design", "pre-commitment"],
      ["decision-journaling", "post-mortem"]
    ],
    assessmentTags: ["bias-mitigation", "process-discipline"],
    evidenceSourceTags: ["journal-data", "behavior-patterns"]
  }
};

export const governanceByLessonId: Record<string, GovernanceMeta> = {
  "business-models": { version: "1.3.0", lastUpdated: "2026-02-10" },
  "management-quality": { version: "1.1.0", lastUpdated: "2026-02-10" },
  "portfolio-management": { version: "1.1.0", lastUpdated: "2026-02-10" },
  "fair-value": { version: "1.1.0", lastUpdated: "2026-02-10" },
  "idea-discovery": { version: "1.0.1", lastUpdated: "2026-02-10" },
  "investor-psychology": { version: "1.0.1", lastUpdated: "2026-02-10" }
};

export const sourceOfTruthByLessonId: Record<string, ActivityEvidenceMap[]> = {
  "business-models": [
    {
      activityIndex: 0,
      links: [
        {
          label: "SEC EDGAR API Docs",
          url: "https://www.sec.gov/edgar/sec-api-documentation",
          sourceType: "filing"
        },
        {
          label: "SEC Company Filings Search",
          url: "https://www.sec.gov/edgar/search/",
          sourceType: "filing"
        }
      ]
    },
    {
      activityIndex: 1,
      links: [
        {
          label: "Census Business Dynamics Statistics",
          url: "https://www.census.gov/data/data-tools/bds-explorer.html",
          sourceType: "industry-data"
        },
        {
          label: "FRED API Documentation",
          url: "https://fred.stlouisfed.org/docs/api/fred/",
          sourceType: "economic-data"
        }
      ]
    },
    {
      activityIndex: 2,
      links: [
        {
          label: "BLS Public Data API",
          url: "https://www.bls.gov/bls/api_features.htm",
          sourceType: "labor-data"
        }
      ]
    }
  ],
  "management-quality": [
    {
      activityIndex: 0,
      links: [
        {
          label: "SEC Filings Search",
          url: "https://www.sec.gov/edgar/search/",
          sourceType: "filing"
        }
      ]
    }
  ],
  "portfolio-management": [],
  "fair-value": [],
  "idea-discovery": [],
  "investor-psychology": []
};
