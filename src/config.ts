import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "text-classifier",
  slug: "text-classifier",
  description: "Classify text into topic categories with confidence scores, readability metrics, and content type detection.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/classify",
      price: "$0.005",
      description: "Classify text content into categories with confidence scores and readability metrics",
      toolName: "text_classify_content",
      toolDescription: `Use this when you need to categorize text into topic categories and assess its readability. Returns top categories with confidence, content type, and Flesch-Kincaid metrics.

1. categories: top 3 matched categories with confidence scores (tech, finance, health, sports, politics, entertainment, science, business)
2. contentType: detected type (article, review, tutorial, news, opinion, documentation)
3. language: detected language of the text
4. readability: Flesch-Kincaid grade level and reading ease score
5. wordCount: total word count of the input

Example output: {"categories":[{"name":"tech","confidence":0.89},{"name":"science","confidence":0.42},{"name":"business","confidence":0.21}],"contentType":"article","language":"en","readability":{"gradeLevel":10.2,"readingEase":55.3},"wordCount":1450}

Use this FOR content tagging, automated routing, CMS organization, or editorial workflows. Essential for classifying incoming content before publishing or distribution.

Do NOT use for sentiment -- use text_analyze_sentiment. Do NOT use for summarization -- use ai_summarize_text. Do NOT use for language detection only -- use text_detect_language.`,
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
      outputSchema: {
          "type": "object",
          "properties": {
            "text": {
              "type": "string",
              "description": "Input text (truncated)"
            },
            "topCategory": {
              "type": "string",
              "description": "Best matching category"
            },
            "confidence": {
              "type": "number",
              "description": "Confidence score"
            },
            "categories": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "category": {
                    "type": "string"
                  },
                  "score": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "required": [
            "topCategory",
            "confidence",
            "categories"
          ]
        },
    },
  ],
};
