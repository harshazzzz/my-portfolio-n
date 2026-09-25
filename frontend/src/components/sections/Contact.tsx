import Parallax from "@/components/animations/Parallax";
import ContactContent from "@/components/contact/ContactContent";
import ContactGlow from "@/components/contact/ContactGlow";
import styles from "@/components/contact/contact.module.css";
export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={styles.section}
    >
      <Parallax className="contact-parallax" distance={24} decorative>
        <ContactGlow />
      </Parallax>
      <ContactContent />
    </section>
  );
}
