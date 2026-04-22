export type Mentor = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  skills: string[];
  rating: number;
  reviewsCount: number;
  bio: string;
  smartMatchReason?: string;
};

export const MENTORS: Mentor[] = [
  {
    id: "m1",
    name: "Sarah Chen",
    avatar: "https://picsum.photos/seed/sarah/200/200",
    role: "Senior Product Manager",
    company: "TechFlow",
    skills: ["Product Strategy", "UX Design", "Growth"],
    rating: 4.9,
    reviewsCount: 124,
    bio: "Ex-Google PM passionate about helping early-career product managers navigate complex challenges and build user-centric products.",
    smartMatchReason: "Recommended based on your interest in UX Design",
  },
  {
    id: "m2",
    name: "David Kumar",
    avatar: "https://picsum.photos/seed/david/200/200",
    role: "Staff Software Engineer",
    company: "CloudScale",
    skills: ["React", "System Design", "Cloud Architecture"],
    rating: 4.8,
    reviewsCount: 89,
    bio: "10+ years scaling distributed systems. I love doing mock interviews and reviewing system design architecture.",
    smartMatchReason: "Recommended based on your interest in System Design",
  },
  {
    id: "m3",
    name: "Elena Rodriguez",
    avatar: "https://picsum.photos/seed/elena/200/200",
    role: "Design Lead",
    company: "CreativeApp",
    skills: ["UI/UX", "Figma", "Design Systems"],
    rating: 4.9,
    reviewsCount: 201,
    bio: "Building inclusive design systems. Happy to review portfolios, provide career advice, or deep-dive into Figma techniques.",
  },
  {
    id: "m4",
    name: "James Wilson",
    avatar: "https://picsum.photos/seed/james/200/200",
    role: "Data Science Manager",
    company: "DataDrive",
    skills: ["Machine Learning", "Python", "Data Strategy"],
    rating: 4.7,
    reviewsCount: 56,
    bio: "Bridging the gap between business and data. I can help you transition into data science or level up your machine learning models.",
  },
  {
    id: "m5",
    name: "Aisha Patel",
    avatar: "https://picsum.photos/seed/aisha/200/200",
    role: "Engineering Manager",
    company: "InnovateCorp",
    skills: ["Leadership", "Agile", "Career Growth"],
    rating: 5.0,
    reviewsCount: 42,
    bio: "Passionate about engineering leadership and building high-performing teams. Let's talk about your transition to management.",
  }
];
