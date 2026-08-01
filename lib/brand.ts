/** Brand voice & content — About, Process, Why-Us, industries, capabilities. */

export const ABOUT = {
  heading: "Creative Team Production",
  lead: "A premium creative agency based in Indore, Madhya Pradesh — specializing in cinematic content creation, branding, photography, videography, social media management, and digital marketing.",
  body: "We don't just create content — we help businesses build their brand with high-quality visuals and strategic content.",
  mission:
    "To help businesses and creators build strong brands through premium visual content and effective digital strategies.",
  vision:
    "To become one of India's leading creative production agencies, known for delivering high-quality cinematic content and helping brands grow through creativity and innovation.",
  promise:
    "We don't just deliver videos and photos. We create content that builds brands, attracts customers, and helps businesses grow.",
};

export const PROCESS = [
  { step: "01", title: "Requirement Discussion", icon: "MessagesSquare", text: "We listen first — goals, audience, references, budget." },
  { step: "02", title: "Content Planning", icon: "PenLine", text: "Concepts, scripts and shot-lists built around your brand." },
  { step: "03", title: "Shoot Scheduling", icon: "CalendarClock", text: "Planned shoot days that respect your calendar." },
  { step: "04", title: "Production", icon: "Clapperboard", text: "Cinema-grade crew, gear and direction on set." },
  { step: "05", title: "Professional Editing", icon: "MonitorPlay", text: "Grade, sound, motion-graphics — the premium finish." },
  { step: "06", title: "Client Review", icon: "SearchCheck", text: "Structured revisions until it feels exactly right." },
  { step: "07", title: "Final Delivery", icon: "PackageCheck", text: "Platform-ready masters, delivered fast." },
  { step: "08", title: "Growth Support", icon: "TrendingUp", text: "Strategy, calendars and analytics that keep you climbing." },
] as const;

export const BOOKING_FLOW = [
  "Choose Service",
  "Select Package",
  "Pick Date & Time",
  "Confirm Booking",
  "Shoot Execution",
  "Editing & Delivery",
] as const;

export const WHY_US = [
  { title: "Cinematic Quality", icon: "Award", text: "Cinema-grade cameras, lenses and lighting on every job." },
  { title: "Creative Storytelling", icon: "Feather", text: "Hooks, arcs and narratives that make people stop scrolling." },
  { title: "Premium Editing", icon: "Gem", text: "Colour grade, sound design and motion graphics done right." },
  { title: "Fast Delivery", icon: "Zap", text: "Photos in 24–48h, reels on schedule — no chasing us." },
  { title: "Modern Content Strategy", icon: "Target", text: "Trend research and formats built for today's algorithms." },
  { title: "Business Growth Focus", icon: "TrendingUp", text: "Content engineered to convert views into customers." },
  { title: "Professional Branding", icon: "Fingerprint", text: "Consistent identity across every frame and post." },
  { title: "End-to-End Solutions", icon: "Layers", text: "From first idea to posted content — one team, zero gaps." },
] as const;

export const INDUSTRIES = [
  { name: "Gyms", icon: "Dumbbell" },
  { name: "Cafés", icon: "Coffee" },
  { name: "Restaurants", icon: "UtensilsCrossed" },
  { name: "Clothing Brands", icon: "Shirt" },
  { name: "Jewellery Brands", icon: "Gem" },
  { name: "Automobile Brands", icon: "CarFront" },
  { name: "Real Estate", icon: "Building2" },
  { name: "Personal Brands", icon: "User" },
  { name: "Influencers", icon: "Megaphone" },
  { name: "Startups", icon: "Rocket" },
  { name: "Local Businesses", icon: "Store" },
  { name: "Corporate Companies", icon: "Briefcase" },
] as const;

export const CAPABILITIES: { group: string; icon: string; items: string[] }[] = [
  {
    group: "Shoots & Production",
    icon: "Clapperboard",
    items: [
      "Cinematic Reel Shoots",
      "Professional Photography",
      "Product Photography",
      "Product Videography",
      "Commercial Ad Shoots",
      "Gym · Café · Restaurant Shoots",
      "Bike & Car Shoots",
      "Podcast Shoot & Editing",
      "YouTube Video Production",
      "Event Coverage (Birthday / Anniversary / Corporate)",
    ],
  },
  {
    group: "Edit & Design",
    icon: "PenTool",
    items: [
      "Video & Reel Editing",
      "Poster Design",
      "Social Media Post Design",
      "Brand Identity & Branding",
    ],
  },
  {
    group: "Growth & Marketing",
    icon: "Rocket",
    items: [
      "Social Media Management",
      "Marketing Strategy",
      "Content Planning",
      "Content Calendar Creation",
      "Website Design & Development",
    ],
  },
];
