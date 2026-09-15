export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  capabilities: string[];
};

export type CaseMetric = {
  value: string;
  label: string;
};

export type CaseStudy = {
  slug: string;
  number: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  headlineMetric: string;
  headlineLabel: string;
  metrics: CaseMetric[];
  services: string[];
  palette: string;
  coverImage?: string;
  heroImage?: string;
};

export const siteConfig = {
  name: "Hadid Creatives",
  description:
    "Hadid Creatives helps established brands grow their digital presence through professional content creation, social media management, paid amplification, website design, and consultancy.",
  email: "hello@hadidcreatives.com",
  whatsappNumber: "+251 94 802 7407",
  whatsappHref:
    "https://wa.me/251948027407?text=Hello%20Hadid%20Creatives%2C%20I%27d%20like%20to%20discuss%20growing%20our%20digital%20presence.",
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/hadidcreatives/",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hadid-creatives-683406363/",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@hadid.creatives",
    },
  ],
  navigation: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Insights", href: "/insights" },
    { label: "Behind the work", href: "/behind-the-work" },
    { label: "About", href: "/about" },
  ],
};

export const mediaConfig = {
  hero: "/media/hero/hero-production-placeholder.png",
  cameraRig: "/media/bts/camera-rig-placeholder.png",
  editingSuite: "/media/bts/editing-suite-placeholder.png",
  brandMark: "/media/brand/hadid-mark.svg",
};

export const services: Service[] = [
  {
    id: "01",
    title: "Professional content creation",
    short: "Ideas, captured with intent.",
    description:
      "From the first line of a script to the final color pass, we build high-finish social content around what the brand needs to achieve.",
    capabilities: [
      "Professional filming",
      "Creative concepts and scripts",
      "Direction and photography",
      "Editing and motion graphics",
      "Brand-consistent content",
      "Production-grade equipment",
    ],
  },
  {
    id: "02",
    title: "Social media management",
    short: "A consistent presence, run with clarity.",
    description:
      "We turn scattered publishing into an organized content system with a clear rhythm, purpose, and feedback loop.",
    capabilities: [
      "Social strategy",
      "Content calendars",
      "Publishing",
      "Community management",
      "Performance monitoring",
      "Reporting and optimization",
    ],
  },
  {
    id: "03",
    title: "Paid social & boosting",
    short: "Put strong content in front of the right people.",
    description:
      "Campaigns are planned around the business objective, then tested and refined against real platform performance.",
    capabilities: [
      "Campaign planning",
      "Targeted advertising",
      "Brand awareness",
      "Lead-generation support",
      "Audience testing",
      "Performance optimization",
    ],
  },
  {
    id: "04",
    title: "Website design",
    short: "Digital spaces that make the next action clear.",
    description:
      "We design responsive, conversion-minded websites that extend the brand beyond the feed and into a complete digital presence.",
    capabilities: [
      "Strategy and structure",
      "UX and UI design",
      "Responsive websites",
      "Campaign landing pages",
      "Performance and usability",
    ],
  },
  {
    id: "05",
    title: "Consultancy & training",
    short: "Build capability inside the business.",
    description:
      "Practical guidance for teams that need a clearer strategy, a better system, or the skills to operate with confidence.",
    capabilities: [
      "Digital presence audits",
      "Strategy workshops",
      "In-house team training",
      "Content-system development",
      "Platform guidance",
      "Practical consultation",
    ],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "gm-furniture",
    number: "01",
    client: "GM Furniture",
    industry: "Furniture",
    summary:
      "Growing an established furniture brand's social audience and translating attention into measurable commercial response.",
    challenge:
      "Strengthen GM Furniture's digital presence and support demand through social media marketing.",
    approach:
      "Hadid supported the brand with a focused combination of content production, social distribution, and platform-led iteration.",
    outcome:
      "The audience grew more than tenfold, while social media activity contributed to more than ETB 8 million in reported revenue over six months.",
    headlineMetric: "10.2x",
    headlineLabel: "audience growth",
    metrics: [
      { value: "3K", label: "Starting followers" },
      { value: "30.8K", label: "Followers after growth" },
      { value: "> ETB 8M", label: "Reported revenue" },
      { value: "6 months", label: "Timeframe" },
    ],
    services: ["Content creation", "Social management", "Paid social"],
    palette: "blue",
    coverImage: "/media/work/cover-gm-furniture.jpg",
  },
  {
    slug: "worthy-homes",
    number: "02",
    client: "Worthy Homes",
    industry: "Real estate",
    summary:
      "Expanding reach for a real-estate brand and supporting sales through a stronger social presence.",
    challenge:
      "Increase audience attention around the brand's property offering and help social activity contribute to sales.",
    approach:
      "Hadid built a more consistent social presence around content designed to make the offering visible and easier to engage with.",
    outcome:
      "The audience increased from 16.7K to 23.2K, with approximately four homes sold through social media activity.",
    headlineMetric: "4",
    headlineLabel: "homes sold via social",
    metrics: [
      { value: "16.7K", label: "Starting followers" },
      { value: "23.2K", label: "Followers after growth" },
      { value: "+6.5K", label: "Audience increase" },
      { value: "~4", label: "Homes sold" },
    ],
    services: ["Content creation", "Social management", "Paid social"],
    palette: "lime",
    coverImage: "/media/work/cover-worthy-homes.jpg",
  },
  {
    slug: "habesha-brothers",
    number: "03",
    client: "Habesha Brothers Catering",
    industry: "Food & beverage",
    summary:
      "Scaling a catering brand's TikTok audience while increasing its visibility, reach, and engagement.",
    challenge:
      "Create sustained platform momentum for a food and beverage business in an attention-heavy category.",
    approach:
      "Hadid supported a consistent, social-first content presence built for the rhythm and discovery behavior of TikTok.",
    outcome:
      "TikTok followers grew from 19K to 108K over nine months, establishing a significantly larger audience for the brand.",
    headlineMetric: "+89K",
    headlineLabel: "TikTok followers",
    metrics: [
      { value: "19K", label: "Starting followers" },
      { value: "108K", label: "Followers after growth" },
      { value: "5.7x", label: "Audience growth" },
      { value: "9 months", "label": "Timeframe" },
    ],
    services: ["Content creation", "Social management", "Platform strategy"],
    palette: "orange",
    coverImage: "/media/work/cover-habesha-brothers.jpg",
  },
  {
    slug: "daily-water",
    number: "04",
    client: "Daily Water",
    industry: "Beverage",
    summary:
      "Launching a new social presence from zero and building the first layer of audience awareness.",
    challenge:
      "Establish a credible digital starting point for a beverage brand with no existing social audience.",
    approach:
      "Hadid supported the launch with an initial content and publishing foundation designed to begin audience discovery.",
    outcome:
      "The brand launched from scratch and built an initial audience of approximately 2,000 followers.",
    headlineMetric: "0→2K",
    headlineLabel: "launch audience",
    metrics: [
      { value: "0", label: "Starting audience" },
      { value: "~2K", label: "Followers built" },
      { value: "Launch", label: "Starting stage" },
      { value: "Organic", label: "Audience foundation" },
    ],
    services: ["Launch strategy", "Content creation", "Social management"],
    palette: "aqua",
    coverImage: "/media/work/cover-daily-water.jpg",
  },
];

export type ProcessStep = {
  id: string;
  title: string;
  text: string;
};

export const process: ProcessStep[] = [
  { id: "01", title: "Discover", text: "Clarify the brand, audience, offer, and result the work must achieve." },
  { id: "02", title: "Strategize", text: "Turn the brief into a practical channel, content, and production plan." },
  { id: "03", title: "Create", text: "Concept, film, design, edit, and finish every asset as one system." },
  { id: "04", title: "Launch", text: "Publish and amplify the work with timing, context, and audience in mind." },
  { id: "05", title: "Improve", text: "Read performance, learn quickly, and make the next cycle sharper." },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

