export type BlogSection = { heading: string; paragraphs: readonly string[] };
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: readonly string[];
  cover: string;
  coverAlt: string;
  publishedAt: string;
  accent: "cyan" | "purple" | "orange";
  isPreview: boolean;
  sections: readonly BlogSection[];
};

// Editable starter articles, explicitly labeled as previews in the interface.
// Replace these records with your own writing or an API-backed repository.
export const blogs: readonly BlogPost[] = [
  {
    id: "component-thinking",
    slug: "thinking-in-reusable-components",
    title: "Thinking in reusable components",
    description:
      "A practical starting point for turning a growing interface into smaller, clearer building blocks.",
    category: "Frontend Development",
    tags: ["React.js", "Next.js", "UI Design"],
    cover: "/blog/components.svg",
    coverAlt:
      "Connected cyan interface blocks illustrating reusable components",
    publishedAt: "2026-09-24",
    accent: "cyan",
    isPreview: true,
    sections: [
      {
        heading: "Start with a responsibility",
        paragraphs: [
          "A reusable component works best when it has one clear purpose. A button represents an action. A card groups related information. A form field connects a label, an input, and useful feedback. Thinking in responsibilities makes the interface easier to understand before you write any code.",
          "Begin with a real screen instead of trying to predict every possible use case. Once a pattern appears in a second place, compare what stays the same and what changes. Those differences are useful candidates for props.",
        ],
      },
      {
        heading: "Make variation explicit",
        paragraphs: [
          "Prefer a small set of named options, such as primary and secondary, over a growing collection of unrelated flags. A component should communicate which combinations are meaningful. TypeScript can make those choices visible to the next person using it.",
          "Keep content flexible while protecting structure. A card can accept a title and children without knowing where its data came from. That separation makes it easier to replace local content with an API later.",
        ],
      },
      {
        heading: "Reuse includes accessibility",
        paragraphs: [
          "Reusable components also carry repeated accessibility decisions. Use a link for navigation and a button for an action. Keep a visible focus state, give inputs meaningful labels, and respect reduced-motion preferences when adding animation.",
          "A useful final check is to use the component with a long title, a narrow screen, and a keyboard. Reusability is about handling real variation, not just looking identical in two screenshots.",
        ],
      },
    ],
  },
  {
    id: "mobile-states",
    slug: "designing-for-mobile-app-states",
    title: "A mobile screen is more than its happy path",
    description:
      "Thinking through loading, empty, error, and success states before adding the final polish.",
    category: "Mobile Development",
    tags: ["Flutter", "Dart", "UX"],
    cover: "/blog/mobile.svg",
    coverAlt:
      "Purple mobile interface with connected loading and response indicators",
    publishedAt: "2026-09-24",
    accent: "purple",
    isPreview: true,
    sections: [
      {
        heading: "Design the waiting experience",
        paragraphs: [
          "Mobile applications are used on changing networks and devices. A screen that only looks complete when every request succeeds leaves important parts of the experience undecided. Before polishing the success state, describe what the user sees while data is loading.",
          "Loading feedback should explain that work is happening without blocking unrelated actions. Avoid placing realistic-looking sample information where someone could mistake it for actual results.",
        ],
      },
      {
        heading: "Give empty and error states a purpose",
        paragraphs: [
          "An empty list is not necessarily a failure. It may mean the user has not created anything yet, or that a search has no matching results. Explain which situation applies and offer a relevant next step.",
          "An error state needs enough context to help someone recover. Keep a person's input when possible, explain what failed in plain language, and offer a retry when retrying can help. A disabled button alone rarely explains the problem.",
        ],
      },
      {
        heading: "Keep layout and behavior connected",
        paragraphs: [
          "In Flutter, small widgets can represent each state while the surrounding screen remains consistent. Separating the state decision from the visual details helps keep the interface understandable as the application grows.",
          "Check long text, the on-screen keyboard, smaller displays, and repeated taps. A polished mobile experience comes from these everyday interactions as much as from colors or transitions.",
        ],
      },
    ],
  },
  {
    id: "api-foundations",
    slug: "building-clear-api-contracts",
    title: "Clear API contracts make better applications",
    description:
      "Why validation, predictable responses, and clear boundaries matter when a frontend meets a backend.",
    category: "Backend Engineering",
    tags: ["Node.js", "REST APIs", "Testing"],
    cover: "/blog/api.svg",
    coverAlt: "Orange data packets flowing between a client and a server",
    publishedAt: "2026-09-24",
    accent: "orange",
    isPreview: true,
    sections: [
      {
        heading: "Agree on the shape of the conversation",
        paragraphs: [
          "An API contract describes what a client sends and what the server returns. Start with the fields a workflow needs, which values are required, and how errors will be represented. This makes it easier to build the two sides independently.",
          "Use consistent naming and avoid exposing storage details simply because they already exist in a database. A public response should contain the information the client needs, not every field the server knows.",
        ],
      },
      {
        heading: "Validate at the boundary",
        paragraphs: [
          "Frontend validation can make a form easier to use, but the server still needs to validate incoming data. Requests can arrive from other clients, older application versions, or direct calls. Treat the network boundary as a place to check types, lengths, formats, and authorization.",
          "Return errors that distinguish invalid input from missing access or unavailable resources. Predictable responses let the interface show useful feedback instead of relying on a generic failure message.",
        ],
      },
      {
        heading: "Test the unsuccessful paths",
        paragraphs: [
          "A successful request is only one part of an API's behavior. Check missing fields, malformed values, unknown records, and requests without permission. Make sure a rejected request does not partially change data.",
          "A small, clear contract is easier to document and evolve. When a change affects existing clients, plan the transition explicitly rather than silently changing the meaning of a response.",
        ],
      },
    ],
  },
];
