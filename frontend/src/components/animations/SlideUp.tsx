import ScrollReveal, { type RevealProps } from "./ScrollReveal";
export default function SlideUp(props: Omit<RevealProps, "direction">) {
  return <ScrollReveal {...props} direction="up" />;
}
