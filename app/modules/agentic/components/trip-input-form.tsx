import { useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import type { TripInput, BudgetLevel } from "../use-travel-planner";
import { MapPin, Calendar, Wallet, Tag, Send, Loader2 } from "lucide-react";

interface TripInputFormProps {
  onSubmit: (input: TripInput) => void;
  loading: boolean;
}

const BUDGET_OPTIONS: { value: BudgetLevel; label: string; desc: string }[] = [
  { value: "low", label: "Hemat", desc: "Budget backpacker" },
  { value: "mid", label: "Nyaman", desc: "Mid-range" },
  { value: "high", label: "Mewah", desc: "Luxury" },
];

export function TripInputForm({ onSubmit, loading }: TripInputFormProps) {
  const { config } = useConfigurables();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<BudgetLevel>(
    (config?.defaultBudgetLevel as BudgetLevel) ?? "mid"
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const interests = config?.interestCategories ?? [
    "Kuliner", "Alam", "Budaya", "Petualangan", "Belanja", "Relaksasi",
  ];

  const placeholder = config?.chatPlaceholder ?? "Ceritakan perjalanan impianmu...";

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;
    onSubmit({
      destination,
      startDate,
      endDate,
      budget,
      interests: selectedInterests,
      additionalNotes: notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Destination */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          Destinasi
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Contoh: Bali, Tokyo, Paris..."
          required
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Berangkat
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground opacity-0">Pulang</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Budget */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Wallet className="w-4 h-4 text-primary" />
          Budget
        </label>
        <div className="grid grid-cols-3 gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setBudget(opt.value)}
              className={`flex flex-col items-center py-2.5 px-2 rounded-xl border text-center transition-all ${
                budget === opt.value
                  ? "border-primary bg-accent text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              }`}
            >
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Tag className="w-4 h-4 text-primary" />
          Minat (opsional)
        </label>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedInterests.includes(interest)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground">
          Cerita lebih (opsional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !destination || !startDate || !endDate}
        className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Membuat itinerary...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Buat Itinerary
          </>
        )}
      </button>
    </form>
  );
}
