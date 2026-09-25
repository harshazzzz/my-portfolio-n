import TextReveal from "@/components/animations/TextReveal";
import SlideUp from "@/components/animations/SlideUp";
import { Mail, Phone, MessageCircle, Download } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/SocialIcons";
import { profile } from "@/data/portfolio";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";
export default function ContactContent({
  heading = "h2",
}: {
  heading?: "h1" | "h2";
}) {
  const Heading = heading;
  return (
    <div className={styles.content}>
      <SlideUp>
        <span className="eyebrow">HARSHA / LET&apos;S CONNECT</span>
        <Heading id="contact-heading">
          <TextReveal text="Let's Build Something " onScroll />
          <span>
            <TextReveal text="Amazing Together" onScroll />
          </span>
        </Heading>
        <p className={styles.intro}>
          Have an idea, an opportunity, or a question? I would love to hear from
          you. Tell me a little about what you have in mind.
        </p>
        <nav className={styles.socials} aria-label="Contact links">
          <a
            href={profile.github || "https://github.com/harshazzzz"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={17} /> GitHub
          </a>
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={17} /> LinkedIn
            </a>
          ) : null}
          {profile.email ? (
            <a href={"mailto:" + profile.email}>
              <Mail size={17} aria-hidden />
              <span>{profile.email}</span>
            </a>
          ) : (
            <a href="#contact-form">
              <Mail size={17} aria-hidden />
              Send a message
            </a>
          )}
          <a href={"tel:" + profile.telephone}>
            <Phone size={17} aria-hidden />
            {profile.telephone}
          </a>
          <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} aria-hidden /> WhatsApp
          </a>
          <a href={profile.cv} download>
            <Download size={17} aria-hidden /> Download CV
          </a>
        </nav>
      </SlideUp>
      <ContactForm />
    </div>
  );
}
