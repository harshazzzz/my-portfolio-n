export type SkillCategory = {
  id:
    | "languages"
    | "frontend"
    | "design"
    | "state"
    | "backend"
    | "iot"
    | "ai"
    | "mobile"
    | "algorithms"
    | "tools"
    | "database"
    | "concepts";
  title: string;
  description: string;
  accent: "cyan" | "purple" | "orange";
  items: readonly string[];
};

export const skillCategories = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "The foundations behind every solution.",
    accent: "cyan",
    items: ["Java", "JavaScript", "TypeScript", "Dart", "Python", "PHP", "SQL"],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    description:
      "Responsive, component-driven web interfaces built with modern React tooling.",
    accent: "cyan",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Inertia.js",
      "Tailwind CSS",
      "Vite",
      "HTML5",
      "CSS3",
      "Bootstrap",
    ],
  },
  {
    id: "design",
    title: "UI/UX & Motion Design",
    description:
      "Interactive interfaces, reusable components, forms, and responsive product flows.",
    accent: "purple",
    items: [
      "Responsive Web Development",
      "Reusable Component Design",
      "Interactive UI Development",
      "Form Validation",
      "React Hook Form",
      "Framer Motion",
      "Radix UI",
      "Figma",
    ],
  },
  {
    id: "state",
    title: "State & Data Management",
    description:
      "Client state, server data, REST integrations, and debugging across application flows.",
    accent: "cyan",
    items: [
      "Zustand",
      "TanStack Query",
      "Axios",
      "REST APIs",
      "Client-Side Routing",
      "Browser/Network Debugging",
    ],
  },
  {
    id: "backend",
    title: "Backend & Databases",
    description:
      "Backend-supported workflows, APIs, database operations, authentication, and validation.",
    accent: "purple",
    items: [
      "Laravel",
      "NestJS",
      "Node.js",
      "FastAPI",
      "PHP",
      "Python",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase Realtime Database",
      "Supabase",
      "Prisma ORM",
      "Eloquent ORM",
      "Authentication & Authorization",
      "RBAC",
      "File Upload & Validation",
      "Express.js",
      "REST APIs",
    ],
  },
  {
    id: "iot",
    title: "IoT & Smart Systems",
    description:
      "ESP32-based telemetry systems, sensor data, and agriculture-focused dashboards.",
    accent: "orange",
    items: [
      "ESP32",
      "C/C++",
      "Sensor Integration",
      "Real-time Telemetry",
      "Firebase Sync",
      "OpenWeatherMap API",
      "React Three Fiber",
      "Smart Agriculture",
    ],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    description:
      "Applied AI concepts used in smart agriculture validation and decision-support work.",
    accent: "purple",
    items: [
      "Machine Learning Concepts",
      "Random Forest Models",
      "Explainable AI (XAI)",
      "Data Visualization",
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Mobile UI development and cross-platform application exploration.",
    accent: "orange",
    items: [
      "Flutter",
      "Dart",
      "Kotlin",
      "Android",
      "Mobile UI Layouts",
      "Android Development",
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms & Data Structures",
    description:
      "Practical DSA implementations used in route-planning and dispatch workflows.",
    accent: "cyan",
    items: [
      "Graph & Adjacency Lists",
      "Dijkstra Algorithm",
      "Queue (FIFO)",
      "Stack (LIFO / Undo)",
      "Merge Sort",
    ],
  },
  {
    id: "tools",
    title: "Tools & Workflow",
    description:
      "Collaborative development, testing, debugging, and deployment workflow tools.",
    accent: "cyan",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Postman",
      "VS Code",
      "Jira",
      "Manual QA",
      "Regression Testing",
      "Responsive Testing",
      "Real-Device Testing",
      "Docker",
      "GitHub Actions",
      "GHCR",
      "Netlify",
      "Render",
      "Android Studio",
      "Figma",
    ],
  },
  {
    id: "database",
    title: "Database",
    description: "Organizing the data behind the experience.",
    accent: "orange",
    items: ["MySQL", "MongoDB", "Firebase"],
  },
  {
    id: "concepts",
    title: "Software Concepts",
    description: "The thinking that brings good software together.",
    accent: "purple",
    items: ["OOP", "SDLC", "Agile", "UML", "UI/UX", "Software Testing"],
  },
] as const satisfies readonly SkillCategory[];

export const orbitTechnologies = [
  { name: "Next.js", symbol: "N", color: "#e4faff" },
  { name: "React", symbol: "R", color: "#61dafb" },
  { name: "Flutter", symbol: "F", color: "#65cfff" },
  { name: "Node.js", symbol: "JS", color: "#91d781" },
  { name: "Firebase", symbol: "F", color: "#ffb36b" },
  { name: "MongoDB", symbol: "M", color: "#70dba4" },
  { name: "TypeScript", symbol: "TS", color: "#8aaaff" },
] as const;
