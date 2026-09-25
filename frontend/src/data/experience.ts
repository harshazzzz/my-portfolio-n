export type JourneyItem = {
  id: "society" | "academic" | "independent";
  title: string;
  organization?: string;
  category: string;
  /** Exact years can be added when confirmed; these are not employment dates. */
  period: string;
  description: string;
  highlights: readonly string[];
  accent: "cyan" | "purple" | "orange";
};

export const experience: readonly JourneyItem[] = [
  {
    id: "society",
    title: "NIBM IT Society Member",
    organization: "National Institute of Business Management",
    category: "COMMUNITY & COLLABORATION",
    period: "During studies",
    description:
      "Participated in technical workshops and software development activities, working collaboratively with students on technology-related projects.",
    highlights: ["Teamwork", "Communication", "Leadership"],
    accent: "cyan",
  },
  {
    id: "academic",
    title: "Academic Project Experience",
    category: "LEARNING THROUGH BUILDING",
    period: "During studies",
    description:
      "Developed software projects during my Software Engineering studies, turning classroom concepts into practical development experience.",
    highlights: [
      "Full Stack Development",
      "Mobile Application Development",
      "Database Design",
      "Software Testing",
      "Team Collaboration",
    ],
    accent: "purple",
  },
  {
    id: "independent",
    title: "Independent Developer",
    category: "PERSONAL EXPLORATION",
    period: "Ongoing",
    description:
      "Building personal software projects to improve my development skills, explore new technologies, and learn by solving practical problems.",
    highlights: [
      "Web Applications",
      "Mobile Applications",
      "IoT Solutions",
      "AI-powered Applications",
    ],
    accent: "orange",
  },
];
