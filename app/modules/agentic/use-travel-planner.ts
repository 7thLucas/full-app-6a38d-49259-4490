import { useState, useCallback } from "react";
import { invokeLLM } from "@qb/agentic";

export type BudgetLevel = "low" | "mid" | "high";

export interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  budget: BudgetLevel;
  interests: string[];
  additionalNotes?: string;
}

export interface ActivityItem {
  time: string;
  title: string;
  description?: string;
  location?: string;
  lat?: number;
  lng?: number;
  category?: string;
  priceRange?: string;
  rating?: number;
}

export interface DayPlan {
  day: number;
  date: string;
  title?: string;
  activities: ActivityItem[];
}

export interface HotelRecommendation {
  name: string;
  description?: string;
  priceRange?: string;
  rating?: number;
  location?: string;
  lat?: number;
  lng?: number;
}

export interface GeneratedItinerary {
  title: string;
  destination: string;
  summary: string;
  days: DayPlan[];
  hotels: HotelRecommendation[];
  tips?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useTravelPlanner() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const generateItinerary = useCallback(async (input: TripInput) => {
    setLoading(true);
    setError(null);

    const userMsg = `Tolong buatkan itinerary perjalanan ke ${input.destination} dari ${input.startDate} sampai ${input.endDate}. Budget: ${input.budget}. Minat: ${input.interests.join(", ")}. ${input.additionalNotes ?? ""}`;
    addMessage("user", userMsg);

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        destination: { type: "string" },
        summary: { type: "string" },
        days: {
          type: "array",
          items: {
            type: "object",
            properties: {
              day: { type: "number" },
              date: { type: "string" },
              title: { type: "string" },
              activities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    time: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    location: { type: "string" },
                    lat: { type: "number" },
                    lng: { type: "number" },
                    category: { type: "string" },
                    priceRange: { type: "string" },
                    rating: { type: "number" },
                  },
                  required: ["time", "title"],
                },
              },
            },
            required: ["day", "date", "activities"],
          },
        },
        hotels: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              priceRange: { type: "string" },
              rating: { type: "number" },
              location: { type: "string" },
              lat: { type: "number" },
              lng: { type: "number" },
            },
            required: ["name"],
          },
        },
        tips: { type: "array", items: { type: "string" } },
      },
      required: ["title", "destination", "summary", "days", "hotels"],
    };

    const systemPrompt = `Kamu adalah WanderMind — agen perjalanan AI yang berpengalaman, hangat, dan suka membantu. Kamu tahu banyak destinasi wisata di seluruh dunia, terutama Asia Tenggara.

Tugasmu adalah membuat itinerary perjalanan yang detail, realistis, dan personal sesuai preferensi pengguna.

Panduan:
- Sesuaikan aktivitas dengan budget (low = budget backpacker, mid = comfort travel, high = luxury)
- Sertakan rekomendasi hotel yang sesuai budget
- Tambahkan waktu spesifik (07:00, 09:30, dsb) untuk setiap aktivitas
- Sertakan perkiraan harga jika memungkinkan
- Koordinat lat/lng untuk lokasi penting jika kamu tahu
- Tips perjalanan yang berguna
- Gunakan bahasa Indonesia yang ramah dan informatif
- Kategori aktivitas: "food", "attraction", "hotel", "transport", "shopping", "nature", "culture"
- Buat summary yang menarik dan inspiring

Kembalikan respons dalam format JSON yang valid sesuai schema.`;

    try {
      const result = await invokeLLM({
        message: userMsg,
        schema,
        systemPrompt,
      });

      if (result.status === "ERROR" || !result.response) {
        throw new Error(result.error ?? "AI gagal membuat itinerary");
      }

      const generated = result.response as GeneratedItinerary;
      setItinerary(generated);

      const replyMsg = `Itinerary untuk ${generated.destination} sudah siap! ✈️\n\n${generated.summary}\n\nKamu bisa melihat rencana hari per hari di panel kanan. Mau aku sesuaikan sesuatu?`;
      addMessage("assistant", replyMsg);
    } catch (err: any) {
      const errMsg = err.message ?? "Terjadi kesalahan saat membuat itinerary";
      setError(errMsg);
      addMessage("assistant", `Maaf, ${errMsg}. Coba lagi ya!`);
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  const adjustItinerary = useCallback(async (request: string) => {
    if (!itinerary) return;
    setLoading(true);
    setError(null);
    addMessage("user", request);

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        destination: { type: "string" },
        summary: { type: "string" },
        days: {
          type: "array",
          items: {
            type: "object",
            properties: {
              day: { type: "number" },
              date: { type: "string" },
              title: { type: "string" },
              activities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    time: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    location: { type: "string" },
                    lat: { type: "number" },
                    lng: { type: "number" },
                    category: { type: "string" },
                    priceRange: { type: "string" },
                    rating: { type: "number" },
                  },
                  required: ["time", "title"],
                },
              },
            },
            required: ["day", "date", "activities"],
          },
        },
        hotels: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              priceRange: { type: "string" },
              rating: { type: "number" },
              location: { type: "string" },
            },
            required: ["name"],
          },
        },
        tips: { type: "array", items: { type: "string" } },
      },
      required: ["title", "destination", "summary", "days", "hotels"],
    };

    const systemPrompt = `Kamu adalah WanderMind — agen perjalanan AI. Kamu sebelumnya sudah membuat itinerary ini:

${JSON.stringify(itinerary, null, 2)}

Pengguna meminta penyesuaian. Modifikasi itinerary sesuai permintaan mereka dan kembalikan itinerary yang sudah diperbarui dalam format JSON yang sama. Pertahankan informasi yang tidak perlu diubah.`;

    try {
      const result = await invokeLLM({
        message: request,
        schema,
        systemPrompt,
      });

      if (result.status === "ERROR" || !result.response) {
        throw new Error(result.error ?? "AI gagal menyesuaikan itinerary");
      }

      const updated = result.response as GeneratedItinerary;
      setItinerary(updated);
      addMessage("assistant", `Itinerary sudah diperbarui! ${updated.summary}`);
    } catch (err: any) {
      const errMsg = err.message ?? "Terjadi kesalahan";
      setError(errMsg);
      addMessage("assistant", `Maaf, ${errMsg}. Coba lagi ya!`);
    } finally {
      setLoading(false);
    }
  }, [itinerary, addMessage]);

  const clearAll = useCallback(() => {
    setMessages([]);
    setItinerary(null);
    setError(null);
  }, []);

  return {
    messages,
    itinerary,
    loading,
    error,
    generateItinerary,
    adjustItinerary,
    clearAll,
  };
}
