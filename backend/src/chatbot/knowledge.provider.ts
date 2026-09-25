import { Injectable } from '@nestjs/common';
import type { AIProvider } from './ai-provider.js';
const topics = [
  {
    pattern: /\b(wadiya|pos|inventory|sales)\b/i,
    answer:
      'Wadiya POS System is a MongoDB, Express.js, React.js, and Node.js project. It supports inventory management, sales tracking, backend REST APIs, and monthly sales prediction. GitHub: https://github.com/harshazzzz/Wadiya-POS',
  },
  {
    pattern: /\b(autocare|roadside|mechanic)\b/i,
    answer:
      'AutoCare is a cross-platform mobile application built with Flutter and Dart. It connects vehicle owners with nearby mechanics and service providers for roadside assistance.',
  },
  {
    pattern: /\b(library|books|borrowing)\b/i,
    answer:
      'The Library Management System uses PHP and MySQL for book and member management, borrowing, returning, and reservations. GitHub: https://github.com/harshazzzz/Library-Management-System- . Demo: http://smartlibrary.fwh.is/',
  },
  {
    pattern: /\b(iot|alfa|automation)\b/i,
    answer:
      'Alfa Community Smart IoT Solution is an academic project exploring community automation and safety concepts.',
  },
  {
    pattern: /\b(projects?|built|portfolio)\b/i,
    answer:
      "Harshana's projects include Wadiya POS System, AutoCare Mobile Application, Library Management System, and Alfa Community Smart IoT Solution. Ask about any project to learn its technologies and purpose.",
  },
  {
    pattern: /\b(education|study|studying|hnd|nibm|qualification|diploma)\b/i,
    answer:
      'Harshana is studying for a Higher National Diploma in Software Engineering at the National Institute of Business Management (NIBM), from 2025 to present. His education also includes a Diploma in Software Engineering (2024) and Foundation Programme (2022) at NIBM.',
  },
  {
    pattern:
      /\b(skills?|technolog(?:y|ies)|stack|react|next|typescript|node|flutter|firebase|mongodb|languages?)\b/i,
    answer:
      'His skills include React, Next.js, TypeScript, Node.js, Flutter, Firebase, and MongoDB. He works on web applications, mobile applications, backend systems, database systems, and IoT solutions.',
  },
  {
    pattern:
      /\b(contact|email|phone|whatsapp|hire|reach|linkedin|github|cv|resume)\b/i,
    answer:
      'Email: harshanakarunarathna2@gmail.com. Mobile: +94715442353. WhatsApp: https://wa.me/94715442353 . LinkedIn: https://www.linkedin.com/in/harshana-karunarathna-2a93163b3/ . GitHub: https://github.com/harshazzzz . Download his CV using the Download CV button in the Hero, Contact, or Footer section.',
  },
  {
    pattern: /\b(experience|internships?|opportunities|career|job)\b/i,
    answer:
      'Harshana is seeking internship opportunities in software engineering, full stack, backend, Flutter, QA, and DevOps. His experience comes from academic and independent projects and NIBM IT Society activities; he has no professional employment history yet.',
  },
  {
    pattern: /\b(name|who|about|introduce|harsha|harshana|role)\b/i,
    answer:
      'Harshana Karunarathna is a Software Engineering Student, Full Stack Developer, and Mobile Application Developer. He builds practical web and mobile solutions while continuing his software engineering studies at NIBM.',
  },
  {
    pattern: /^(hi|hello|hey|help)[!.?\s]*$/i,
    answer:
      "Hello! I can help you explore Harshana's skills, education, projects, and internship interests. What would you like to know?",
  },
];
@Injectable()
export class KnowledgeProvider implements AIProvider {
  answer(message: string): Promise<string> {
    return Promise.resolve(
      topics.find((topic) => topic.pattern.test(message))?.answer ??
        "I can answer questions about Harshana's skills, education, projects, and internship interests using curated portfolio information. I do not have that information. Please use the Contact section to ask Harshana directly.",
    );
  }
}
