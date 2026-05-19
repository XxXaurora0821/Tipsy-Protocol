import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const PORT = Number(process.env.PORT || 8787);
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-7";
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("[server] 缺少环境变量 ANTHROPIC_API_KEY，请在 .env.local 中配置");
  process.exit(1);
}

const client = new Anthropic({ apiKey: API_KEY });
const app = express();
app.use(express.json({ limit: "1mb" }));

function buildPrompt(answers, lang) {
  if (lang === "en") {
    return `You are a world-class master mixologist. The user has completed 10 deep personality and sensory questions. Here are the selected traits: ${JSON.stringify(answers)}.

Please provide:
1. One iconic classic world cocktail recommendation.
2. One fully custom cocktail named "Soul Signature" tailored to the user.

Requirements:
- Names should be poetic and premium.
- All text fields (cocktail names, flavor notes, ingredients, instructions, philosophy, and rationale) must be in natural English.
- The "rationale" should synthesize all 10 dimensions.
- Flavor notes should clearly show layered taste profiles.

Return strict JSON only (no markdown, no code block):
{
  "classic": {
    "name": "...",
    "description": "...",
    "ingredients": ["..."],
    "origin": "..."
  },
  "custom": {
    "name": "...",
    "vibe": "...",
    "flavorNotes": "...",
    "ingredients": ["..."],
    "garnish": "...",
    "instructions": "..."
  },
  "rationale": "..."
}`;
  }

  return `你是一位世界顶级的调酒大师。用户刚刚完成了10道深入的性格与感官测试，以下是他们的选择：${JSON.stringify(answers)}。

请根据这些细致的维度进行深度分析，并提供：
1. 推荐一款经典的、极具代表性的世界级鸡尾酒。
2. 专门为用户量身定制一款名为"灵魂签名"的创新鸡尾酒。

要求：
- 名字必须极具诗意，带有高级感。
- 所有的文字描述（包括鸡尾酒名、口感笔记、调制步骤、背后的哲学道理）必须使用中文。
- "灵魂画像"部分需要结合这10个维度的分析，给出一段深刻且优雅的总结。
- 定制款的"风味笔记"要突出层次感。

必须且仅以严谨的 JSON 格式返回，不要包含 markdown 标记（如 code block）：
{
  "classic": {
    "name": "...",
    "description": "...",
    "ingredients": ["..."],
    "origin": "..."
  },
  "custom": {
    "name": "...",
    "vibe": "...",
    "flavorNotes": "...",
    "ingredients": ["..."],
    "garnish": "...",
    "instructions": "..."
  },
  "rationale": "..."
}`;
}

function stripCodeFence(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJson(text) {
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Claude 返回内容不是合法 JSON");
  }
}

function validate(data) {
  if (!data || !data.classic || !data.custom || !data.rationale) {
    throw new Error("AI 返回数据缺字段");
  }
  if (!data.classic.name || !data.custom.name) {
    throw new Error("AI 未生成有效的鸡尾酒名称");
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: MODEL });
});

app.post("/api/cocktail", async (req, res) => {
  const { answers, lang } = req.body || {};
  const locale = lang === "zh" ? "zh" : "en";
  const RETRY_MSG =
    locale === "zh"
      ? "AI 返回的内容格式异常，请重新开始测试"
      : "The AI returned malformed content. Please restart the test.";

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Invalid payload: answers is required (object)" });
  }

  // ---- 上游调用：网络 / 鉴权 / 配额等错误 -> 502 + 原文 ----
  let upstreamText = "";
  try {
    const prompt = buildPrompt(answers, locale);
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });
    const block = message.content.find((b) => b.type === "text");
    upstreamText = block && "text" in block ? block.text : "";
  } catch (err) {
    console.error("[server] upstream Anthropic call failed:", err);
    const message = err instanceof Error ? err.message : "Unknown upstream error";
    return res.status(502).json({ error: message });
  }

  // ---- 解析 / 字段校验：失败时返回友好"请重试" ----
  try {
    const data = extractJson(upstreamText);
    validate(data);
    return res.json(data);
  } catch (err) {
    console.error(
      "[server] failed to parse Claude output:",
      err instanceof Error ? err.message : err,
      "\n--- raw (first 500 chars) ---\n",
      upstreamText.slice(0, 500)
    );
    return res.status(502).json({ error: RETRY_MSG });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Soul Spirits API listening on http://127.0.0.1:${PORT}`);
  console.log(`[server] model: ${MODEL}`);
});
