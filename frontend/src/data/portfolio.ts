export const navigation = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Blog",
  "Contact",
] as const;
export type Section = (typeof navigation)[number];
export const profile = {
  github: "https://github.com/harshazzzz",
  linkedin: "https://www.linkedin.com/in/harshana-karunarathna-2a93163b3/",
  email: "harshanakarunarathna2@gmail.com",
  telephone: "+94715442353",
  whatsapp: "https://wa.me/94715442353",
  cv: "/Harshana-Karunarathna-CV.pdf",
};
export const personal = {
  name: "Harshana Karunarathna",
  fullName: "Yasas Sri Harshana Karunarathna",
  birthday: "2005-08-01",
  birthdayLabel: "1 August 2005",
  age: 21,
  telephone: profile.telephone,
  introduction:
    "I'm Yasas Sri Harshana Karunarathna, a software engineering student at NIBM with a passion for building practical web and mobile applications. I enjoy solving real-world problems, exploring new technologies, and improving my skills through hands-on projects. I'm working toward a career where I can create thoughtful, reliable software and keep learning every day.",
  titles: [
    "Software Engineering Student",
    "Full Stack Developer",
    "Mobile Application Developer",
  ],
  education: "Higher National Diploma (HND) in Software Engineering",
  institute: "National Institute of Business Management (NIBM)",
  internships: [
    "Software Engineer Intern",
    "Full Stack Developer Intern",
    "Backend Developer Intern",
    "Flutter Developer Intern",
    "QA Engineer Intern",
    "DevOps Intern",
  ],
};
export const skills = {
  Frontend: ["React.js", "Next.js", "HTML5", "CSS3", "Bootstrap", "TypeScript"],
  Backend: ["Node.js", "Express.js", "Laravel", "REST APIs"],
  Mobile: ["Flutter", "Dart", "Android Development"],
  Database: ["MySQL", "MongoDB", "Firebase"],
  Tools: ["Git", "GitHub", "VS Code", "Android Studio", "Postman", "Figma"],
};
export const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Flutter",
  "Firebase",
  "MongoDB",
];

export const about = {
  technologies: [
    "React.js",
    "Next.js",
    "Node.js",
    "Laravel",
    "Flutter",
    "SQL",
    "MongoDB",
    "Firebase",
  ],
  areas: [
    "Web Development",
    "Mobile Application Development",
    "Backend Systems",
    "Database Systems",
    "IoT Solutions",
  ],
  education: [
    {
      year: "2022",
      title: "Foundation Programme in Software Engineering",
      institution: "NIBM",
      description:
        "The first step: exploring programming and the foundations of software engineering.",
    },
    {
      year: "2024",
      title: "Diploma in Software Engineering",
      institution: "NIBM",
      description:
        "Deepening my knowledge and connecting software concepts with practical development.",
    },
    {
      year: "2025 - Present",
      title: "Higher National Diploma in Software Engineering",
      institution: "NIBM",
      description:
        "Continuing to learn, build, and grow as a software engineer.",
      current: true,
    },
  ],
};
