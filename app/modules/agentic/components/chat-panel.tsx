import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../use-travel-planner";
import { Send, Loader2, Bot, User } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (message: string) => void;
  hasItinerary: boolean;
}

const QUICK_REPLIES = [
  "Kurangi museum, tambah kuliner",
  "Cari hotel yang lebih murah",
  "Tambah aktivitas malam",
  "Sesuaikan untuk keluarga dengan anak",
  "Tambah hari wisata alam",
];

export function ChatPanel({ messages, loading, onSendMessage, hasItinerary }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Halo! Isi form di atas untuk membuat itinerary perjalananmu.
              Setelah itu, kamu bisa minta perubahan di sini.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-primary"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {hasItinerary && !loading && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr}
              onClick={() => {
                onSendMessage(qr);
              }}
              className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-accent/60 hover:bg-accent transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {hasItinerary && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Minta perubahan itinerary..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      )}
    </div>
  );
}
