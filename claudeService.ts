import { CocktailRecommendation, Locale } from "./types";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";
const ENDPOINT = `${API_BASE}/api/cocktail`;

const ERROR_TEXT: Record<Locale, { unknown: string; network: string; invalidData: string; invalidName: string }> = {
  en: {
    unknown: "Unknown error",
    network: "Cannot reach the local API. Did you start the backend? (./start.sh)",
    invalidData: "AI returned incomplete data, please try again",
    invalidName: "AI did not generate a valid cocktail name, please try again",
  },
  zh: {
    unknown: "未知错误",
    network: "无法连接本地后端，是否已经启动？（./start.sh）",
    invalidData: "AI 返回的数据不完整，请重试",
    invalidName: "AI 未生成有效的鸡尾酒名称，请重试",
  },
};

export async function getCocktailRecommendation(
  answers: Record<string, string>,
  lang: Locale = "en"
): Promise<CocktailRecommendation> {
  const err = ERROR_TEXT[lang];

  let resp: Response;
  try {
    resp = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, lang }),
    });
  } catch {
    throw new Error(err.network);
  }

  if (!resp.ok) {
    let detail = "";
    try {
      const data = await resp.json();
      detail = data?.error || "";
    } catch {
      detail = await resp.text().catch(() => "");
    }
    throw new Error(detail || `HTTP ${resp.status}: ${err.unknown}`);
  }

  const data = (await resp.json()) as CocktailRecommendation;
  if (!data || !data.classic || !data.custom || !data.rationale) {
    throw new Error(err.invalidData);
  }
  if (!data.classic.name || !data.custom.name) {
    throw new Error(err.invalidName);
  }
  return data;
}

export function getUnknownErrorLabel(lang: Locale): string {
  return ERROR_TEXT[lang].unknown;
}
