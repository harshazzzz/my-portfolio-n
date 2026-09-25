# Portfolio assistant

The floating assistant is mounted in the root layout on all routes. The homepage navbar opens the same assistant. It supports dark/light mode and reduced motion, uses a native modal dialog for focus containment and Escape, and stops microphone requests, speech playback, and in-flight chat requests when closed. Chats are transient component state and reset when closed; they are not saved to the database.

## Run and test

- Backend: `npm --prefix backend run start:dev`
- Frontend: `npm --prefix frontend run dev`
- API tests: `npm --prefix backend run test:chatbot`
- Open localhost:3000, click AI or the navbar AI Assistant button. Ask about skills, education, Wadiya POS, AutoCare, Library Management, and internships.
- Ask an unknown question: the assistant should acknowledge its limited knowledge.
- Switch dark/light themes; test at 320px, 768px, and 1440px. On mobile the dialog fills the screen.
- Tab through the dialog, close with Escape, and verify focus returns to the launcher.
- Click the microphone and permit access on localhost or HTTPS. Speech fills the input; review it and press Send. Denied permission, unsupported browsers, and no speech show actionable errors. Browser recognition support varies and may require its external speech service.
- Enable Voice replies, send a question, and listen. Disable it or close the dialog to stop playback. Voice replies are off by default.
- Stop the backend and send a question: an error should appear and the draft should be restored for retry.

## Architecture

Browser -> POST /api/chatbot/message (Next.js) -> POST /chatbot/message (NestJS) -> AI_PROVIDER.

The frontend proxy uses the existing BACKEND_URL / NEXT_PUBLIC_API_URL configuration, checks origin, validates the message, and does not forward admin cookies. The backend validates messages (1-1000 characters after trimming), rejects extra fields, and applies 20 requests per minute per IP. Rate limiting is in-memory; multi-instance production deployments need a shared rate-limit store. Backend replies are { answer: string }. No database changes or new dependencies are required.

Current answers are deterministic curated portfolio responses, not a connected generative model. Backend facts live in knowledge.provider.ts. Frontend aiKnowledge.ts contains the greeting, suggested questions, and profile summary. Update both when changing portfolio facts. CMS changes are not automatically reflected in the assistant.

## Adding OpenAI later

1. Implement a server-only OpenAIProvider class that implements AIProvider.answer(message): Promise<string>.
2. Inject NestJS ConfigService and read OPENAI_API_KEY from the backend environment. Never put keys in NEXT_PUBLIC_* variables or frontend code.
3. Supply curated portfolio facts as context and instruct the provider to acknowledge unknown information. Add an explicit model choice, output limit, request timeout, and safe handling of provider failures.
4. Replace the AI_PROVIDER binding in chatbot.module.ts with the new provider. The controller, frontend service, and chat components can stay unchanged.
5. Update the chat notice to accurately describe the connected provider. Retain rate limits and add production usage limits before enabling paid requests.

No OpenAI credentials or calls are configured by this implementation.
