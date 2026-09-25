# Portfolio motion system

No dependencies added. Uses existing Framer Motion and progressive native View Transitions.

Reusable components: ScrollReveal (once-in-view 50px rise, optional left/right directions and bounded delays), FadeIn (page-load), SlideUp, ScaleIn, TextReveal (accessible word-preserving character reveal), Parallax (motion values without React scroll renders), Floating (pauses offscreen).

Existing skill/blog/education/experience staggered reveals now share the updated ScrollReveal timing. Project cards alternate reveal direction and retain existing mouse tilt, zoom and glow, with additional staggered technology badge hover movement. Hero sequence: navbar, badge, heading, copy, buttons, visual. The developer core and technology core have restrained scroll offsets. Contact and Footer reveal with the same system.

ScrollProgress is mounted globally. Existing CSS smooth scrolling and navbar scrollIntoView remain in place. PageTransitions uses browser snapshots on unmodified same-origin page-link clicks, with normal external links, downloads, hash links and modifier-clicks. Unsupported browsers get a short opacity-only entry effect. No persistent transformed page wrapper interferes with fixed menus or chat dialogs. Reduced-motion users bypass these effects.

Verification checklist:
- Scroll all sections at 320, 768, 1024 and 1440px; check no horizontal overflow and progress reaches the end.
- Scroll back up: revealed cards should stay visible.
- Check heading colors, full readable screen-reader labels, and mobile word wrapping.
- Hover project cards with a mouse; on touch they should remain easy to tap.
- Navigate to Contact/Admin via page links, then use browser Back. Hash navigation and CV download must still work.
- Open/close mobile navigation and assistant; ensure focus, fixed positioning and scroll locking remain correct.
- Enable OS reduced motion and reload: no parallax, floating or character movement; progress updates directly.
- Check light/dark mode and browser console. Native route exit animations depend on browser support.
