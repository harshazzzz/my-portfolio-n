export type Project = {
  id: string;
  slug?: string;
  images?: readonly string[];
  title: string;
  role: string;
  category: string;
  technologies: readonly string[];
  description: string;
  features: readonly string[];
  introduction: string;
  benefits: readonly string[];
  accent: "cyan" | "purple" | "orange";
  preview: "pos" | "mobile" | "library" | "iot" | "generic";
  image: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  featured?: boolean;
};

// Replace null URLs and images with verified project links and screenshots.
export const projects: readonly Project[] = [
  {
    id: "wadiya-pos",
    title: "Wadiya POS System",
    introduction:
      "Wadiya POS brings everyday business operations into a single full-stack application. I developed a responsive React interface and REST APIs with Node.js and Express.js, using MongoDB to support inventory, sales tracking, and monthly sales prediction.",
    benefits: [
      "Keeps inventory and sales information together for easier day-to-day management.",
      "Helps users review sales activity and understand business trends.",
      "Supports planning with monthly sales predictions.",
    ],
    role: "Full Stack Developer",
    category: "FULL STACK / BUSINESS",
    technologies: ["MongoDB", "Express.js", "React.js", "Node.js"],
    description:
      "Developed a full-stack Point of Sale system for business operations.",
    features: [
      "Responsive frontend interface",
      "Backend REST APIs",
      "Inventory management",
      "Sales tracking",
      "Monthly sales prediction",
    ],
    accent: "cyan",
    preview: "pos",
    image: null,
    githubUrl: "https://github.com/harshazzzz/Wadiya-POS",
    demoUrl: null,
    featured: true,
  },
  {
    id: "autocare",
    title: "AutoCare Mobile Application",
    introduction:
      "AutoCare is a cross-platform roadside assistance application built with Flutter and Dart. It connects vehicle owners with nearby mechanics and service providers through a mobile experience designed around finding help when it is needed.",
    benefits: [
      "Makes nearby roadside assistance easier to discover.",
      "Connects vehicle owners and service providers through one application.",
      "Uses a shared Flutter codebase to support cross-platform development.",
    ],
    role: "Flutter Developer",
    category: "MOBILE / ROADSIDE ASSISTANCE",
    technologies: ["Flutter", "Dart"],
    description:
      "A cross-platform roadside assistance application connecting vehicle owners with nearby mechanics and service providers.",
    features: [],
    accent: "purple",
    preview: "mobile",
    image: null,
    githubUrl: null,
    demoUrl: null,
  },
  {
    id: "library",
    title: "Library Management System",
    introduction:
      "This PHP and MySQL application brings book records, member information, borrowing, returns, and reservations into one library management workflow. It is designed to make routine library operations easier to organize and follow.",
    benefits: [
      "Centralizes book and member records for easier administration.",
      "Helps staff track borrowing, returns, and reservations.",
      "Reduces reliance on scattered manual records for everyday library tasks.",
    ],
    role: "Software Developer",
    category: "WEB / MANAGEMENT",
    technologies: ["PHP", "MySQL"],
    description:
      "A library management application supporting book and member management, borrowing, returning, and reservations.",
    features: [
      "Book management",
      "Member management",
      "Borrowing and returning",
      "Reservations",
    ],
    accent: "orange",
    preview: "library",
    image: null,
    githubUrl: "https://github.com/harshazzzz/Library-Management-System-",
    demoUrl: "http://smartlibrary.fwh.is/",
  },
  {
    id: "alfa-iot",
    title: "Alfa Community Smart IoT Solution",
    introduction:
      "Alfa Community explores how connected devices can support community automation and safety. The project focuses on smart IoT concepts that connect physical environments with digital systems.",
    benefits: [
      "Explores automation for routine community activities.",
      "Demonstrates how connected systems can support safety awareness.",
      "Provides a foundation for developing further smart-community ideas.",
    ],
    role: "IoT Developer",
    category: "IoT / SMART COMMUNITY",
    technologies: ["IoT"],
    description:
      "A smart community IoT solution focused on automation and safety concepts.",
    features: [],
    accent: "cyan",
    preview: "iot",
    image: null,
    githubUrl: null,
    demoUrl: null,
  },
];
