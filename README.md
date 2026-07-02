# Text Classifier API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://text-classifier.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Classify text into categories with confidence scores, readability analysis, and content type detection. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "text-classifier": {
      "url": "https://text-classifier.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://text-classifier.api.klymax402.com/api/classify" \
  -H "Content-Type: application/json" \
  -d '{"text":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `text_classify_content` | POST | `/api/classify` | $0.005 | Classify text content into categories with confidence scores and readability metrics |

### `text_classify_content`

Use this when you need to categorize text into topic categories (tech, finance, health, sports, politics, entertainment, science, business). Returns top 3 categories with confidence scores, detected language, Flesch-Kincaid readability level, and content type (article/review/tutorial/news). Ideal for content organization, tagging, and routing. Do NOT use for sentiment — use text_analyze_sentiment. Do NOT use for summarization — use ai_summarize_text.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `text` | string | yes | The text content to classify (min 50 characters for accurate results) |
| `categories` | array | no | Optional custom categories to classify against. Default: tech, finance, health, sports, politics, entertainment, science, business |

## Example agent prompts

- "Categorize text into topic categories (tech, finance, health, sports, politics, entertainment, science, business)"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
