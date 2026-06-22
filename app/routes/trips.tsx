import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { apiGet, apiRequest } from "~/lib/api.client";
import { Navbar } from "~/components/navbar";
import {
  MapPin,
  Calendar,
  Wallet,
  Trash2,
  Eye,
  Plus,
  Loader2,
  BookOpen,
  Clock,
} from "lucide-react";

interface SavedItinerary {
  _id: string;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  interests?: string[];
  summary?: string;
  days?: Array<{ day: number; activities: any[] }>;
  hotels?: any[];
  createdAt?: string;
}

const BUDGET_LABELS: Record<string, string> = {
  low: "Hemat",
  mid: "Nyaman",
  high: "Mewah",
};

const BUDGET_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  mid: "bg-blue-100 text-blue-700",
  high: "bg-purple-100 text-purple-700",
};

export default function TripsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { config } = useConfigurables();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<SavedItinerary | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    if (!authLoading && isAuthenticated) {
      loadTrips();
    }
  }, [isAuthenticated, authLoading]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await apiGet<SavedItinerary[]>("/api/itineraries");
      if (res.success && res.data) {
        setTrips(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus itinerary ini?")) return;
    setDeletingId(id);
    try {
      await apiRequest(`/api/itineraries/${id}`, { method: "DELETE" });
      setTrips((prev) => prev.filter((t) => t._id !== id));
      if (selectedTrip?._id === id) setSelectedTrip(null);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalDays = (trip: SavedItinerary) => trip.days?.length ?? 0;
  const totalActivities = (trip: SavedItinerary) =>
    trip.days?.reduce((s, d) => s + (d.activities?.length ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perjalananku</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {trips.length > 0
                ? `${trips.length} itinerary tersimpan`
                : "Belum ada itinerary tersimpan"}
            </p>
          </div>
          <Link
            to="/planner"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Buat Baru
          </Link>
        </div>

        {loading || authLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Belum ada perjalanan tersimpan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Buat itinerary pertamamu dan simpan untuk akses kapan saja
              </p>
            </div>
            <Link
              to="/planner"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Mulai Rencanakan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="group bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card header */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/50 p-5 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground leading-tight line-clamp-2">
                        {trip.title}
                      </h3>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {trip.destination}
                      </p>
                    </div>
                    {trip.budget && (
                      <span
                        className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                          BUDGET_COLORS[trip.budget] ?? "bg-muted text-foreground"
                        }`}
                      >
                        {BUDGET_LABELS[trip.budget] ?? trip.budget}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 pt-3">
                  {/* Dates */}
                  {(trip.startDate || trip.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(trip.startDate)}
                      {trip.endDate && trip.startDate !== trip.endDate && (
                        <> — {formatDate(trip.endDate)}</>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  {trip.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                      {trip.summary}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1 text-xs text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {totalDays(trip)} hari
                    </span>
                    <span className="flex items-center gap-1 text-xs text-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {totalActivities(trip)} aktivitas
                    </span>
                    {trip.hotels && trip.hotels.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-foreground">
                        <Wallet className="w-3.5 h-3.5 text-primary" />
                        {trip.hotels.length} hotel
                      </span>
                    )}
                  </div>

                  {/* Interests */}
                  {trip.interests && trip.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trip.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs px-2 py-0.5 rounded-full bg-accent text-foreground"
                        >
                          {interest}
                        </span>
                      ))}
                      {trip.interests.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{trip.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTrip(trip)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      disabled={deletingId === trip._id}
                      className="p-2 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === trip._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Created at */}
                  {trip.createdAt && (
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      Dibuat {formatDate(trip.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Trip detail modal */}
      {selectedTrip && (
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}
    </div>
  );
}

function TripDetailModal({
  trip,
  onClose,
}: {
  trip: SavedItinerary;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-start justify-center p-4 sm:items-center overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl my-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground">{trip.title}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {trip.destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {trip.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{trip.summary}</p>
          )}

          {trip.days?.map((day) => (
            <div key={day.day} className="mb-5">
              <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {day.day}
                </span>
                Hari {day.day}
              </h3>
              <div className="space-y-2 ml-8">
                {day.activities?.map((act: any, i: number) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="font-mono text-xs text-primary w-12 flex-shrink-0 pt-0.5">
                      {act.time}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{act.title}</p>
                      {act.description && (
                        <p className="text-xs text-muted-foreground">{act.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {trip.hotels && trip.hotels.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-2">Hotel</h3>
              <div className="space-y-2">
                {trip.hotels.map((hotel: any, i: number) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-3 text-sm">
                    <p className="font-semibold text-foreground">{hotel.name}</p>
                    {hotel.priceRange && (
                      <p className="text-xs text-muted-foreground mt-0.5">{hotel.priceRange}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
