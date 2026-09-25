"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FileText, Layers3, Code2, Inbox } from "lucide-react";
import styles from "./dashboard.module.css";
const icons = {
  blogs: FileText,
  projects: Layers3,
  skills: Code2,
  messages: Inbox,
};
type Props = {
  kind: keyof typeof icons;
  title: string;
  value: number | string;
  detail: string;
  index: number;
  href: string;
};
export default function DashboardCard({
  kind,
  title,
  value,
  detail,
  index,
  href,
}: Props) {
  const reduced = useReducedMotion();
  const Icon = icons[kind];
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={reduced ? undefined : { y: -5 }}
    >
      <Link href={href} className={styles.stat} data-accent={kind}>
        <div className={styles.statTop}>
          <span className={styles.icon}>
            <Icon size={20} aria-hidden />
          </span>
          <ArrowUpRight size={17} aria-hidden />
        </div>
        <span className={styles.statLabel}>{title}</span>
        <strong className={styles.number}>{value}</strong>
        <span className={styles.detail}>{detail}</span>
      </Link>
    </motion.div>
  );
}
