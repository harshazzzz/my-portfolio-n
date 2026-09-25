export type EducationItem = {
  id: string;
  qualification: string;
  institute?: string;
  stream?: string;
  period: string;
  status: string;
  description: string;
  current: boolean;
};

const nibm = "National Institute of Business Management (NIBM)";

// Earlier qualifications have no supplied grades or completion status.
// School names are intentionally omitted until provided.
export const education: readonly EducationItem[] = [
  {
    id: "hnd",
    qualification: "Higher National Diploma (HND) in Software Engineering",
    institute: nibm,
    period: "2025 - Present",
    status: "Currently Studying",
    current: true,
    description:
      "Continuing my software engineering journey through advanced study and practical development.",
  },
  {
    id: "diploma",
    qualification: "Diploma in Software Engineering",
    institute: nibm,
    period: "2024",
    status: "Previous Study",
    current: false,
    description:
      "Developing my software engineering knowledge and connecting concepts with practical applications.",
  },
  {
    id: "advanced-level",
    qualification: "G.C.E. Advanced Level",
    stream: "Technology Stream",
    period: "2023",
    status: "Previous Study",
    current: false,
    description:
      "Exploring technology through Advanced Level studies and building a foundation for further technical learning.",
  },
  {
    id: "foundation",
    qualification: "Foundation Programme in Software Engineering",
    institute: nibm,
    period: "2022",
    status: "Previous Study",
    current: false,
    description:
      "Beginning my formal software engineering education and exploring the fundamentals of programming.",
  },
  {
    id: "ordinary-level",
    qualification: "G.C.E. Ordinary Level Examination",
    period: "2021",
    status: "Previous Study",
    current: false,
    description:
      "Building the academic foundations for my next steps in technology and software engineering.",
  },
];
