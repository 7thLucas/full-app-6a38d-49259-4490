import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { Navbar } from "~/components/navbar";
import {
  Compass,
  MessageSquare,
  CalendarDays,
  MapPin,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const { config, loading } = useConfigurables();
  const { isAuthenticated } = useAuth();

  const appName = config?.appName ?? "WanderMind";
  const tagline = config?.appTagline ?? "Deskripsikan perjalananmu, kami yang rencanakan segalanya";
  const description = config?.appDescription ?? "Agen perjalanan AI pribadi yang membuat itinerary lengkap dari satu percakapan.";
  const heroCtaLabel = config?.heroCtaLabel ?? "Mulai Rencanakan";
  const heroSecondaryCtaLabel = config?.heroSecondaryCtaLabel ?? "Lihat Contoh";
  const popularDestinations = config?.popularDestinations ?? [];
  const footerText = config?.footerText ?? `© 2026 ${appName}. Semua hak dilindungi.`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/30 py-20 sm:py-28 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/30 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-border text-sm font-medium text-primary mb-6">
            <Zap className="w-3.5 h-3.5" />
            Didukung AI Terdepan
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Perjalanan Impianmu,{" "}
            <span className="text-primary">Direncanakan AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            {tagline}. {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/planner" : "/auth/register"}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl text-base font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <Compass className="w-5 h-5" />
              {heroCtaLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/planner"
              className="flex items-center gap-2 px-8 py-3.5 bg-card border border-border text-foreground rounded-2xl text-base font-semibold hover:bg-muted transition-all"
            >
              {heroSecondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Cara Kerjanya
            </h2>
            <p className="text-muted-foreground">Dari ide ke itinerary dalam hitungan detik</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <MessageSquare className="w-6 h-6 text-primary" />,
                title: "Ceritakan Perjalananmu",
                desc: "Pilih destinasi, tanggal, budget, dan minatmu. Tambahkan catatan spesifik jika ada.",
              },
              {
                step: "02",
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: "AI Merancang Itinerary",
                desc: "WanderMind AI membuat jadwal hari per hari lengkap dengan rekomendasi hotel dan aktivitas.",
              },
              {
                step: "03",
                icon: <CalendarDays className="w-6 h-6 text-primary" />,
                title: "Simpan & Jelajahi",
                desc: "Sesuaikan itinerary lewat chat, simpan, dan mulai petualanganmu!",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-muted-foreground/50">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-muted-foreground">Fitur lengkap untuk perjalanan yang sempurna</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <MessageSquare className="w-5 h-5" />,
                title: "Chat AI Interaktif",
                desc: "Ngobrol dengan AI travel agent untuk menyesuaikan rencana sesuai keinginanmu.",
              },
              {
                icon: <CalendarDays className="w-5 h-5" />,
                title: "Timeline Harian",
                desc: "Jadwal visual hari per hari dengan waktu dan slot aktivitas yang detail.",
              },
              {
                icon: <MapPin className="w-5 h-5" />,
                title: "Peta Interaktif",
                desc: "Semua lokasi rekomendasi dipetakan untuk navigasi yang mudah.",
              },
              {
                icon: <Star className="w-5 h-5" />,
                title: "Rekomendasi Hotel",
                desc: "Hotel terpilih sesuai budget dengan rating dan ulasan terpercaya.",
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "Destinasi Global",
                desc: "Ribuan destinasi di seluruh dunia, dari Indonesia hingga Eropa.",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "Simpan & Akses",
                desc: "Simpan semua itinerary dan akses kapan saja dari perangkat apapun.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      {popularDestinations.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Destinasi Populer
              </h2>
              <p className="text-muted-foreground">Pilihan favorit traveler WanderMind</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularDestinations.map((dest) => (
                <Link
                  key={dest.name}
                  to={`/planner`}
                  className="group bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/10 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{dest.name}</p>
                  <p className="text-xs text-muted-foreground">{dest.country}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Siap Memulai Petualangan?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Buat itinerary pertamamu gratis. Tidak perlu kartu kredit.
          </p>
          <Link
            to={isAuthenticated ? "/planner" : "/auth/register"}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-foreground text-primary rounded-2xl text-base font-bold hover:opacity-90 transition-all shadow-lg"
          >
            <Compass className="w-5 h-5" />
            {heroCtaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border bg-card text-center">
        <p className="text-sm text-muted-foreground">{footerText}</p>
      </footer>
    </div>
  );
}
