import type { Hono } from "hono";

// --------------- Category keyword lists (~50 per category) ---------------
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  tech: [
    "software", "ai", "algorithm", "api", "app", "artificial intelligence", "automation",
    "backend", "blockchain", "browser", "bug", "cloud", "code", "compiler", "computer",
    "cpu", "cybersecurity", "data", "database", "debug", "deploy", "developer", "devops",
    "digital", "docker", "encryption", "engineering", "firmware", "framework", "frontend",
    "gpu", "hack", "hardware", "internet", "javascript", "kubernetes", "linux", "machine learning",
    "microservice", "network", "neural", "node", "open source", "operating system", "platform",
    "programming", "python", "react", "robot", "saas", "server", "startup", "tech", "typescript",
  ],
  finance: [
    "stock", "market", "trading", "investment", "portfolio", "dividend", "bond", "equity",
    "fund", "hedge", "etf", "forex", "cryptocurrency", "bitcoin", "earnings", "revenue",
    "profit", "loss", "balance sheet", "income", "debt", "credit", "loan", "mortgage",
    "interest rate", "inflation", "gdp", "economy", "bank", "fintech", "payment", "insurance",
    "valuation", "ipo", "merger", "acquisition", "asset", "capital", "venture", "wealth",
    "pension", "retirement", "tax", "fiscal", "monetary", "bear", "bull", "yield", "spread",
    "liquidity", "volatility",
  ],
  health: [
    "medical", "doctor", "patient", "hospital", "disease", "treatment", "therapy", "diagnosis",
    "symptom", "medicine", "drug", "pharmaceutical", "clinical", "surgery", "vaccine", "virus",
    "bacteria", "infection", "mental health", "wellness", "nutrition", "diet", "exercise",
    "fitness", "obesity", "cancer", "diabetes", "heart", "brain", "immune", "dna", "gene",
    "biotech", "research", "trial", "fda", "healthcare", "telemedicine", "chronic", "acute",
    "prescription", "dosage", "side effect", "rehabilitation", "organ", "blood", "cell",
    "protein", "vitamin", "supplement",
  ],
  sports: [
    "game", "team", "player", "coach", "score", "championship", "tournament", "league",
    "match", "season", "win", "loss", "goal", "touchdown", "basket", "home run", "athlete",
    "olympic", "fifa", "nba", "nfl", "mlb", "soccer", "football", "basketball", "baseball",
    "tennis", "golf", "boxing", "mma", "ufc", "racing", "swimming", "track", "field",
    "stadium", "referee", "penalty", "draft", "transfer", "injury", "roster", "playoff",
    "world cup", "super bowl", "medal", "record", "training", "fitness", "competition",
  ],
  politics: [
    "government", "president", "congress", "senate", "election", "vote", "democrat", "republican",
    "party", "policy", "law", "legislation", "bill", "regulation", "supreme court", "constitution",
    "campaign", "candidate", "ballot", "poll", "diplomat", "foreign", "domestic", "liberal",
    "conservative", "progressive", "reform", "tax", "budget", "military", "defense", "nato",
    "united nations", "sanctions", "treaty", "immigration", "border", "rights", "freedom",
    "protest", "activism", "lobbying", "corruption", "scandal", "impeach", "administration",
    "executive", "judiciary", "legislature",
  ],
  entertainment: [
    "movie", "film", "tv", "show", "series", "actor", "actress", "director", "music", "song",
    "album", "concert", "band", "singer", "streaming", "netflix", "disney", "hbo", "spotify",
    "celebrity", "star", "award", "oscar", "grammy", "emmy", "box office", "trailer", "release",
    "premiere", "review", "critic", "comedy", "drama", "action", "horror", "animation",
    "podcast", "youtube", "tiktok", "viral", "influencer", "gaming", "video game", "esports",
    "playstation", "xbox", "nintendo", "fiction", "novel", "book", "bestseller",
  ],
  science: [
    "research", "experiment", "hypothesis", "theory", "physics", "chemistry", "biology",
    "astronomy", "space", "nasa", "planet", "galaxy", "quantum", "particle", "atom",
    "molecule", "evolution", "ecology", "climate", "environment", "fossil", "geology",
    "ocean", "marine", "telescope", "microscope", "laboratory", "scientist", "discovery",
    "journal", "peer review", "publication", "study", "data", "observation", "equation",
    "formula", "energy", "matter", "gravity", "relativity", "stem", "engineering",
    "mathematics", "statistics", "genome", "species", "ecosystem", "biodiversity",
  ],
  business: [
    "company", "ceo", "startup", "entrepreneur", "management", "strategy", "marketing",
    "sales", "revenue", "growth", "product", "service", "customer", "client", "b2b", "b2c",
    "ecommerce", "retail", "supply chain", "logistics", "operations", "hr", "hiring",
    "employee", "leadership", "innovation", "disruption", "scalability", "partnership",
    "contract", "deal", "negotiation", "brand", "advertising", "roi", "kpi", "metric",
    "analytics", "forecast", "quarterly", "annual", "shareholder", "stakeholder", "board",
    "corporate", "industry", "sector", "market share", "competitive", "franchise",
  ],
};

// --------------- Content type detection ---------------
const CONTENT_TYPE_PATTERNS: Record<string, RegExp[]> = {
  tutorial: [/\b(step \d|how to|guide|tutorial|instructions|follow|first|then|next|finally)\b/i, /\d\.\s/],
  review: [/\b(review|rating|pros|cons|verdict|recommend|star|score|tested|compared)\b/i],
  news: [/\b(today|yesterday|announced|breaking|reported|according to|sources say|update)\b/i],
  article: [/\b(analysis|opinion|perspective|argument|conclusion|therefore|furthermore|however)\b/i],
};

function detectContentType(text: string): string {
  const scores: Record<string, number> = {};
  for (const [type, patterns] of Object.entries(CONTENT_TYPE_PATTERNS)) {
    scores[type] = patterns.reduce((s, p) => s + (p.test(text) ? 1 : 0), 0);
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "article";
}

// --------------- Readability (Flesch-Kincaid) ---------------
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function fleschKincaid(text: string): { score: number; grade: string; level: string } {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const sentenceCount = Math.max(sentences.length, 1);
  const wordCount = Math.max(words.length, 1);

  const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount);
  const gradeLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59;

  let level: string;
  if (score >= 90) level = "very_easy";
  else if (score >= 80) level = "easy";
  else if (score >= 70) level = "fairly_easy";
  else if (score >= 60) level = "standard";
  else if (score >= 50) level = "fairly_difficult";
  else if (score >= 30) level = "difficult";
  else level = "very_difficult";

  return {
    score: Math.round(score * 10) / 10,
    grade: `Grade ${Math.round(Math.max(0, gradeLevel))}`,
    level,
  };
}

// --------------- Language detection (simple) ---------------
function detectLanguage(text: string): string {
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return "ja";
  if (/[\uac00-\ud7af]/.test(text)) return "ko";
  if (/[\u0600-\u06ff]/.test(text)) return "ar";
  if (/[\u0900-\u097f]/.test(text)) return "hi";
  if (/[а-яА-ЯёЁ]/.test(text)) return "ru";

  // Latin-script language detection by common words
  const fr = /\b(le|la|les|est|dans|pour|avec|des|une|que)\b/gi;
  const de = /\b(der|die|das|und|ist|ein|nicht|mit|auf|den)\b/gi;
  const es = /\b(el|la|los|las|que|para|por|con|del|una)\b/gi;

  const frCount = (text.match(fr) || []).length;
  const deCount = (text.match(de) || []).length;
  const esCount = (text.match(es) || []).length;

  const max = Math.max(frCount, deCount, esCount);
  if (max > 3) {
    if (frCount === max) return "fr";
    if (deCount === max) return "de";
    if (esCount === max) return "es";
  }
  return "en";
}

// --------------- Classification logic ---------------

function classifyText(
  text: string,
  categories: string[] = Object.keys(CATEGORY_KEYWORDS)
): {
  topCategories: { category: string; confidence: number }[];
  language: string;
  readability: { score: number; grade: string; level: string };
  contentType: string;
  wordCount: number;
} {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const wordCount = words.length;

  // Score each category
  const scores: Record<string, number> = {};
  for (const category of categories) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (!keywords) {
      scores[category] = 0;
      continue;
    }

    let matchCount = 0;
    for (const keyword of keywords) {
      if (keyword.includes(" ")) {
        // Multi-word keyword
        if (lowerText.includes(keyword)) matchCount += 2;
      } else {
        // Single word — check word boundaries
        const regex = new RegExp(`\\b${keyword}\\b`, "i");
        if (regex.test(lowerText)) matchCount += 1;
      }
    }
    scores[category] = matchCount;
  }

  // Normalize to confidence scores
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0) || 1;
  const ranked = Object.entries(scores)
    .map(([category, score]) => ({
      category,
      confidence: Math.round((score / totalScore) * 100) / 100,
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  // Ensure at least some confidence
  if (ranked[0] && ranked[0].confidence === 0) {
    ranked[0].confidence = 0.1;
  }

  return {
    topCategories: ranked,
    language: detectLanguage(text),
    readability: fleschKincaid(text),
    contentType: detectContentType(text),
    wordCount,
  };
}

// --------------- Routes ---------------

export function registerRoutes(app: Hono) {
  app.post("/api/classify", async (c) => {
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { text, categories } = body;

    if (!text || typeof text !== "string") {
      return c.json({
        error: "Missing required parameter 'text'",
        example: { text: "Your text content here...", categories: ["tech", "finance", "health"] },
      }, 400);
    }

    if (text.length < 20) {
      return c.json({ error: "Text too short. Minimum 20 characters for classification." }, 400);
    }

    const validCategories = categories && Array.isArray(categories) ? categories : undefined;

    try {
      const result = classifyText(text, validCategories);
      return c.json({
        ...result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return c.json({ error: "Classification failed", details: err.message }, 500);
    }
  });
}
