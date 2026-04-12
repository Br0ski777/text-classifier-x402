import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "text-classifier",
  slug: "text-classifier",
  description: "Classify text into categories with confidence scores, readability analysis, and content type detection.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/classify",
      price: "$0.005",
      description: "Classify text content into categories with confidence scores and readability metrics",
      toolName: "text_classify_content",
      toolDescription:
        "Use this when you need to categorize text into topic categories (tech, finance, health, sports, politics, entertainment, science, business). Returns top 3 categories with confidence scores, detected language, Flesch-Kincaid readability level, and content type (article/review/tutorial/news). Ideal for content organization, tagging, and routing. Do NOT use for sentiment — use text_analyze_sentiment. Do NOT use for summarization — use ai_summarize_text.",
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The text content to classify (min 50 characters for accurate results)",
          },
          categories: {
            type: "array",
            description: "Optional custom categories to classify against. Default: tech, finance, health, sports, politics, entertainment, science, business",
          },
        },
        required: ["text"],
      },
    },
  ],
};
