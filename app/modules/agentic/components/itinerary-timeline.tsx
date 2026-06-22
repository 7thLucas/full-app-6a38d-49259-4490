import type { GeneratedItinerary, DayPlan, ActivityItem } from "../use-travel-planner";
import {
  MapPin,
  Clock,
  Utensils,
  Landmark,
  Hotel,
  Bus,
  ShoppingBag,
  Leaf,
  BookOpen,
  Moon,
  Star,
  DollarSign,
} from "lucide-react";

interface ItineraryTimelineProps {
  itinerary: GeneratedItinerary;
  onLocationClick?: (lat: number, lng: number, title: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  food: <Utensils className="w-4 h-4" />,
  attraction: <Landmark className="w-4 h-4" />,
  hotel: <Hotel className="w-4 h-4" />,
  transport: <Bus className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  nature: <Leaf className="w-4 h-4" />,
  culture: <BookOpen className="w-4 h-4" />,
  nightlife: <Moon className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-orange-100 text-orange-700",
  attraction: "bg-blue-100 text-blue-700",
  hotel: "bg-purple-100 text-purple-700",
  transport: "bg-gray-100 text-gray-700",
  shopping: "bg-pink-100 text-pink-700",
  nature: "bg-green-100 text-green-700",
  culture: "bg-yellow-100 text-yellow-700",
  nightlife: "bg-indigo-100 text-indigo-700",
};

function ActivityCard({ activity, onLocationClick }: { activity: ActivityItem; onLocationClick?: (lat: number, lng: number, title: string) => void }) {
  const cat = activity.category ?? "attraction";
  const icon = CATEGORY_ICONS[cat] ?? <Landmark className="w-4 h-4" />;
  const colorClass = CATEGORY_COLORS[cat] ?? "bg-accent text-primary";

  return (
    <div className="flex gap-3 group">
      {/* Time column */}
      <div className="flex flex-col items-center">
        <span className="text-xs font-mono font-semibold text-primary min-w-[3.5rem] text-right leading-tight pt-0.5">
          {activity.time}
        </span>
      </div>

      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>
        <div className="w-0.5 bg-border flex-1 mt-1 min-h-[1.5rem]" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="bg-card rounded-xl border border-border p-3.5 shadow-sm group-hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-foreground leading-tight">{activity.title}</h4>
            {activity.lat && activity.lng && onLocationClick && (
              <button
                onClick={() => onLocationClick(activity.lat!, activity.lng!, activity.title)}
                className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                title="Lihat di peta"
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {activity.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{activity.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {activity.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {activity.location}
              </span>
            )}
            {activity.priceRange && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="w-3 h-3" />
                {activity.priceRange}
              </span>
            )}
            {activity.rating && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <Star className="w-3 h-3 fill-amber-400" />
                {activity.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DaySection({ day, onLocationClick }: { day: DayPlan; onLocationClick?: (lat: number, lng: number, title: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
          D{day.day}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">
            {day.title ?? `Hari ${day.day}`}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(day.date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="ml-2">
        {day.activities.map((activity, idx) => (
          <ActivityCard
            key={idx}
            activity={activity}
            onLocationClick={onLocationClick}
          />
        ))}
      </div>
    </div>
  );
}

export function ItineraryTimeline({ itinerary, onLocationClick }: ItineraryTimelineProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Summary */}
      <div className="bg-accent/40 border border-border rounded-2xl p-4 mb-6">
        <h2 className="font-bold text-lg text-foreground mb-1">{itinerary.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{itinerary.summary}</p>

        {itinerary.tips && itinerary.tips.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-primary mb-1.5">Tips Perjalanan</p>
            <ul className="space-y-1">
              {itinerary.tips.map((tip, i) => (
                <li key={i} className="text-xs text-foreground flex gap-2">
                  <span className="text-primary flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Days */}
      <div>
        {itinerary.days.map((day) => (
          <DaySection key={day.day} day={day} onLocationClick={onLocationClick} />
        ))}
      </div>

      {/* Hotels */}
      {itinerary.hotels.length > 0 && (
        <div className="mt-2 mb-6">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <Hotel className="w-4 h-4 text-primary" />
            Rekomendasi Hotel
          </h3>
          <div className="space-y-2">
            {itinerary.hotels.map((hotel, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground">{hotel.name}</h4>
                  <div className="flex items-center gap-2">
                    {hotel.rating && (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {hotel.rating.toFixed(1)}
                      </span>
                    )}
                    {hotel.lat && hotel.lng && onLocationClick && (
                      <button
                        onClick={() => onLocationClick(hotel.lat!, hotel.lng!, hotel.name)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {hotel.description && (
                  <p className="text-xs text-muted-foreground mt-1">{hotel.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {hotel.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {hotel.location}
                    </span>
                  )}
                  {hotel.priceRange && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      {hotel.priceRange}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
