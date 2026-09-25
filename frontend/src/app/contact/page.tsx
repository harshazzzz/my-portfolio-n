import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ContactContent from "@/components/contact/ContactContent";
import ContactGlow from "@/components/contact/ContactGlow";
import auth from "@/components/auth/auth.module.css";
import styles from "@/components/contact/contact.module.css";
export const metadata: Metadata = {
  title: "Contact | Harsha Portfolio",
  alternates: { canonical: "/contact" },
  description:
    "Get in touch with Harshana Karunarathna about software projects, collaborations, and opportunities.",
};
export default function ContactPage() {
  return (
    <main className={`${auth.loginPage} ${styles.standalone}`}>
      <ContactGlow />
      <Link className={`${auth.backLink} ${styles.backLink}`} href="/">
        <ArrowLeft size={15} /> Back to portfolio
      </Link>
      <ContactContent heading="h1" />
    </main>
  );
}
