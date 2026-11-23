import type { ReactNode } from "react";

const KEYWORDS: Record<string, string[]> = {
  js: ["const", "let", "var", "await", "async", "function", "return", "if", "else", "for", "while", "throw", "new", "try", "catch", "import", "from", "export", "of", "in", "continue", "break", "true", "false", "null", "undefined", "typeof", "class"],
  python: ["import", "from", "def", "return", "if", "else", "elif", "for", "while", "in", "with", "as", "raise", "try", "except", "pass", "None", "True", "False", "not", "and", "or", "class", "async", "await"],
  bash: ["curl", "export", "cd", "npm", "pip", "python", "node", "echo"],
  yaml: ["true", "false", "null"],
  json: ["true", "false", "null"],
};
KEYWORDS["ts"] = [...(KEYWORDS["js"] ?? []), "type", "interface", "as", "readonly"];

function langKey(lang: string) {
  if (lang === "ts" || lang === "typescript" || lang === "tsx") return "ts";
  if (lang === "js" || lang === "javascript" || lang === "mjs") return "js";
  if (lang === "py" || lang === "python") return "python";
  if (lang === "yml" || lang === "yaml") return "yaml";
  if (lang === "json") return "json";
  return "bash";
}

/** Tiny dependency-free highlighter: comments, strings, keys, numbers, keywords and calls. */
export function highlight(code: string, lang: string): ReactNode[] {
  const key = langKey(lang);
  const comment =
    key === "js" || key === "ts" ? String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/` : key === "json" ? "(?!)" : String.raw`(?:^|(?<=\s))#[^\n]*`;
  const re = new RegExp(
    [
      `(?<com>${comment})`,
      String.raw`(?<str>"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|\x60(?:\\.|[^\x60\\])*\x60)`,
      String.raw`(?<num>\b\d[\d_]*(?:\.\d+)?\b)`,
      String.raw`(?<word>[A-Za-z_$][\w$]*)`,
    ].join("|"),
    "gm",
  );
  const kw = new Set(KEYWORDS[key] ?? []);
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of code.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    const text = m[0];
    const g = m.groups ?? {};
    let cls: string | null = null;
    if (g["com"]) cls = "tok-com";
    else if (g["str"]) {
      const after = code.slice(start + text.length).match(/^\s*:/);
      cls = after && (key === "json" || key === "js" || key === "ts" || key === "python") ? "tok-key" : "tok-str";
    } else if (g["num"]) cls = "tok-num";
    else if (g["word"]) {
      if (kw.has(text)) cls = "tok-kw";
      else if (code[start + text.length] === "(") cls = "tok-fn";
    }
    out.push(cls ? <span key={i++} className={cls}>{text}</span> : text);
    last = start + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
