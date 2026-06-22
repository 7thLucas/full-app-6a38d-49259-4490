import { useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { useTravelPlanner } from "~/modules/agentic/use-travel-planner";
import { TripInputForm } from "~/modules/agentic/components/trip-input-form";
import { ChatPanel } from "~/modules/agentic/components/chat-panel";
import { ItineraryTimeline } from "~/modules/agentic/components/itinerary-timeline";
import { SaveItineraryButton } from "~/modules/agentic/components/save-itinerary-button";
import { Navbar } from "~/components/navbar";
import {
  MapPin,
  MessageSquare,
  CalendarDays,
  RefreshCw,
  Map as MapIcon,
} from "lucide-react";
import type { TripInput } from "~/modules/agentic/use-travel-planner";

type ViewTab = "form" | "chat" | "timeline" | "map";

export default function PlannerPage() {
  const { config } = useConfigurables();
  const { isAuthenticated } = useAuth();
  const {
    messages,
    itinerary,
    loading,
    generateItinerary,
    adjustItinerary,
    clearAll,
  } = useTravelPlanner();

  const [activeTab, setActiveTab] = useState<ViewTab>("form");
  const [tripInput, setTripInput] = useState<TripInput | null>(null);

  const handleGenerateItinerary = async (input: TripInput) => {
    setTripInput(input);
    await generateItinerary(input);
    // After generation, switch to timeline view
    setActiveTab("timeline");
  };

  const handleAdjust = async (message: string) => {
    await adjustItinerary(message);
  };

  const handleReset = () => {
    clearAll();
    setTripInput(null);
    setActiveTab("form");
  };

  const enableMapView = config?.enableMapView ?? true;
  const enableExport = config?.enableExport ?? true;

  const tabs = [
    { id: "form" as ViewTab, label: "Rencanakan", icon: <MapPin className="w-4 h-4" /> },
    { id: "chat" as ViewTab, label: "Chat", icon: <MessageSquare className="w-4 h-4" />, badge: messages.length > 0 ? messages.length : undefined },
    { id: "timeline" as ViewTab, label: "Itinerary", icon: <CalendarDays className="w-4 h-4" />, disabled: !itinerary },
  ];

  if (enableMapView) {
    tabs.push({ id: "map" as ViewTab, label: "Peta", icon: <MapIcon className="w-4 h-4" />, disabled: !itinerary });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Desktop: Split Layout | Mobile: Tabbed */}
      <main className="flex-1 flex flex-col">
        {/* Mobile tabs */}
        <div className="md:hidden border-b border-border bg-card">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : tab.disabled
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="absolute top-2 right-1/4 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="flex-1 flex md:grid md:grid-cols-[380px_1fr] overflow-hidden">
          {/* Left panel — always visible on desktop */}
          <div
            className={`flex flex-col border-r border-border bg-card overflow-hidden ${
              activeTab === "form" || activeTab === "chat" ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border flex-shrink-0">
              <div className="flex gap-1">
                {["form", "chat"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as ViewTab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === t
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {t === "form" ? "Rencanakan" : "Chat AI"}
                  </button>
                ))}
              </div>
              {itinerary && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-hidden">
              {activeTab !== "chat" ? (
                <div className="h-full overflow-y-auto p-5">
                  <TripInputForm onSubmit={handleGenerateItinerary} loading={loading} />
                </div>
              ) : (
                <ChatPanel
                  messages={messages}
                  loading={loading}
                  onSendMessage={handleAdjust}
                  hasItinerary={!!itinerary}
                />
              )}
            </div>
          </div>

          {/* Right panel — Itinerary / Map */}
          <div
            className={`flex-1 flex flex-col overflow-hidden ${
              activeTab === "timeline" || activeTab === "map" ? "flex" : "hidden md:flex"
            }`}
          >
            {itinerary ? (
              <>
                {/* Right panel header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card flex-shrink-0">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveTab("timeline")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab !== "map"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" />
                        Jadwal
                      </span>
                    </button>
                    {enableMapView && (
                      <button
                        onClick={() => setActiveTab("map")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === "map"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <MapIcon className="w-4 h-4" />
                          Peta
                        </span>
                      </button>
                    )}
                  </div>
                  {enableExport && (
                    <SaveItineraryButton
                      itinerary={itinerary}
                      destination={tripInput?.destination ?? itinerary.destination}
                      startDate={tripInput?.startDate}
                      endDate={tripInput?.endDate}
                      budget={tripInput?.budget}
                      interests={tripInput?.interests}
                      isAuthenticated={isAuthenticated}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-background">
                  {activeTab !== "map" ? (
                    <ItineraryTimeline
                      itinerary={itinerary}
                      onLocationClick={(lat, lng, title) => {
                        setActiveTab("map");
                      }}
                    />
                  ) : (
                    <MapPlaceholder itinerary={itinerary} />
                  )}
                </div>
              </>
            ) : (
              <EmptyState loading={loading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
      <div className="text-center max-w-sm">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Membuat itinerary...</p>
              <p className="text-sm text-muted-foreground mt-1">
                AI sedang merencanakan perjalananmu
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center">
              <CalendarDays className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">Itinerary akan muncul di sini</p>
              <p className="text-sm text-muted-foreground mt-1">
                Isi form di kiri untuk memulai perencanaan perjalananmu
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MapPlaceholder({ itinerary }: { itinerary: any }) {
  // Extract all locations with coordinates
  const locations: Array<{ name: string; lat: number; lng: number; type: string }> = [];

  for (const day of itinerary.days ?? []) {
    for (const activity of day.activities ?? []) {
      if (activity.lat && activity.lng) {
        locations.push({
          name: activity.title,
          lat: activity.lat,
          lng: activity.lng,
          type: activity.category ?? "attraction",
        });
      }
    }
  }

  for (const hotel of itinerary.hotels ?? []) {
    if (hotel.lat && hotel.lng) {
      locations.push({
        name: hotel.name,
        lat: hotel.lat,
        lng: hotel.lng,
        type: "hotel",
      });
    }
  }

  if (locations.length === 0) {
    // Show OpenStreetMap embed for the destination
    const destination = encodeURIComponent(itinerary.destination ?? "");
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${destination}`;

    return (
      <div className="w-full h-full flex flex-col">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik`}
          className="w-full flex-1 border-0"
          title="Map"
          loading="lazy"
        />
        <div className="p-4 bg-card border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Koordinat lokasi belum tersedia. Peta interaktif memerlukan data koordinat dari itinerary.
          </p>
        </div>
      </div>
    );
  }

  const centerLat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
  const centerLng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;

  return (
    <div className="w-full h-full flex flex-col">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.1},${centerLat - 0.1},${centerLng + 0.1},${centerLat + 0.1}&layer=mapnik`}
        className="w-full flex-1 border-0"
        title="Map"
        loading="lazy"
      />
      <div className="p-3 bg-card border-t border-border">
        <div className="flex flex-wrap gap-2">
          {locations.slice(0, 6).map((loc, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent text-foreground"
            >
              <MapPin className="w-3 h-3 text-primary" />
              {loc.name}
            </span>
          ))}
          {locations.length > 6 && (
            <span className="text-xs text-muted-foreground py-1">
              +{locations.length - 6} lokasi lainnya
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
