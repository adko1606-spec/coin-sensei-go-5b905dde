import { useState } from "react";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

interface AIQuestionHelperProps {
  questionText: string;
  explanation: string;
  onClose: () => void;
}

const AIQuestionHelper = ({ questionText, explanation, onClose }: AIQuestionHelperProps) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const systemContext = `Quiz question: "${questionText}"\nExplanation: "${explanation}"`;
    const userMsg = { role: "user" as const, content: msg };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `${t("ai.systemPrompt")} ${systemContext}` },
            ...allMsgs,
          ],
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Error");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMsgs.length) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: `❌ ${t("ai.connectionError")}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="mt-3 rounded-2xl border border-accent/20 bg-accent/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Bot className="h-4 w-4 text-accent" />
          <span className="text-xs font-bold text-accent">{t("ai.help")}</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {[t("ai.explainQuestion"), t("ai.whyCorrect"), t("ai.realExample")].map((q) => (
            <button key={q} onClick={() => send(q)}
              className="text-[11px] rounded-full bg-accent/10 px-2.5 py-1 text-accent hover:bg-accent/20 font-semibold transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
          {messages.map((m, i) => (
            <div key={i} className={`text-xs ${m.role === "user" ? "text-right text-foreground font-semibold" : "text-muted-foreground"}`}>
              {m.content}
            </div>
          ))}
          {loading && <Loader2 className="h-3 w-3 animate-spin text-accent" />}
        </div>
      )}

      <div className="flex gap-1.5">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("ai.askPlaceholder")}
          className="flex-1 rounded-lg bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="rounded-lg bg-accent/20 p-1.5 text-accent disabled:opacity-50">
          <Send className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default AIQuestionHelper;
