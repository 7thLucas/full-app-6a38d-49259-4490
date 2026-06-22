/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TPopularDestination = {
  name: string;
  country: string;
  imageUrl?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  appTagline?: string;
  appDescription?: string;
  heroCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
  chatPlaceholder?: string;
  maxSavedTrips?: number;
  enableMapView?: boolean;
  enableExport?: boolean;
  defaultBudgetLevel?: "low" | "mid" | "high";
  interestCategories?: string[];
  popularDestinations?: TPopularDestination[];
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "WanderMind",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#ffffff",
    foreground:        "#0f172a",
    // Card
    card:              "#f8fafc",
    cardForeground:    "#0f172a",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0f172a",
    // Primary
    primary:           "#0d9488",
    primaryForeground: "#ffffff",
    // Secondary
    secondary:           "#e0f2fe",
    secondaryForeground: "#0369a1",
    // Muted
    muted:           "#f1f5f9",
    mutedForeground: "#64748b",
    // Accent
    accent:           "#ccfbf1",
    accentForeground: "#0d9488",
    // Destructive
    destructive:           "#ef4444",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#e2e8f0",
    input:  "#e2e8f0",
    ring:   "#0d9488",
    // Charts
    chart1: "#0d9488",
    chart2: "#0369a1",
    chart3: "#06b6d4",
    chart4: "#f59e0b",
    chart5: "#8b5cf6",
    // Navbar
    navbarBackground: "#0d9488",
    // Sidebar
    sidebarBackground:        "#f8fafc",
    sidebarForeground:        "#0f172a",
    sidebarPrimary:           "#0d9488",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#ccfbf1",
    sidebarAccentForeground:  "#0d9488",
    sidebarBorder:            "#e2e8f0",
    sidebarRing:              "#0d9488",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
  appTagline: "Deskripsikan perjalananmu, kami yang rencanakan segalanya",
  appDescription: "WanderMind adalah agen perjalanan AI pribadi yang membantu Anda merencanakan perjalanan impian dengan cepat dan mudah.",
  heroCtaLabel: "Mulai Rencanakan",
  heroSecondaryCtaLabel: "Lihat Contoh",
  chatPlaceholder: "Ceritakan perjalanan impianmu... (misal: 3 hari di Bali, budget mid, suka kuliner dan alam)",
  maxSavedTrips: 20,
  enableMapView: true,
  enableExport: true,
  defaultBudgetLevel: "mid",
  interestCategories: ["Kuliner", "Alam", "Budaya", "Petualangan", "Belanja", "Relaksasi", "Sejarah", "Nightlife"],
  popularDestinations: [
    { name: "Bali", country: "Indonesia", imageUrl: "" },
    { name: "Tokyo", country: "Jepang", imageUrl: "" },
    { name: "Paris", country: "Prancis", imageUrl: "" },
    { name: "Bangkok", country: "Thailand", imageUrl: "" },
    { name: "Yogyakarta", country: "Indonesia", imageUrl: "" },
    { name: "Singapore", country: "Singapura", imageUrl: "" },
  ],
  footerText: "© 2026 WanderMind. Semua hak dilindungi.",
};
