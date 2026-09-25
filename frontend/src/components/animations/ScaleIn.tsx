import ScrollReveal, { type RevealProps } from "./ScrollReveal";
export default function ScaleIn(
  props: Omit<RevealProps, "direction" | "scale">,
) {
  return <ScrollReveal {...props} direction="none" scale={0.96} />;
}
