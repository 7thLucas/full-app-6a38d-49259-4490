import { useState } from "react";
import { useNavigate } from "react-router";
import { apiRequest } from "~/lib/api.client";
import type { GeneratedItinerary } from "../use-travel-planner";
import { Save, Loader2, Check } from "lucide-react";

interface SaveItineraryButtonProps {
  itinerary: GeneratedItinerary;
  destination: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  interests?: string[];
  isAuthenticated: boolean;
}

export function SaveItineraryButton({
  itinerary,
  destination,
  startDate,
  endDate,
  budget,
  interests,
  isAuthenticated,
}: SaveItineraryButtonProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await apiRequest("/api/itineraries", {
        method: "POST",
        data: {
          title: itinerary.title,
          destination,
          startDate,
          endDate,
          budget,
          interests,
          days: itinerary.days,
          hotels: itinerary.hotels,
          summary: itinerary.summary,
        },
      });

      if (!res.success) throw new Error(res.message ?? "Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message ?? "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 shadow-sm"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Itinerary"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
