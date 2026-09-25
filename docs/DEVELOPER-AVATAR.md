# Developer workspace avatar

The hero uses components/3d/DeveloperAvatar.tsx. It dynamically loads DeveloperScene.tsx only on fine-pointer screens at least 768px wide with browser WebGL support. Mobile/coarse-pointer devices use DeveloperFallback.tsx, a small code-native SVG illustration with animated technology labels. The scene is a stylized procedural character, not a downloaded or photorealistic human model.

Scene: seated developer, professional shirt, chair, desk, laptop, cyan/purple lights, floating code panels and 30 particles. Ref-based frame updates drive breathing, typing, blinking and cursor movement. No animation updates trigger React state each frame. DPR is capped at 1.5, no shadow maps or postprocessing. Rendering switches to demand mode while paused, hidden or reduced motion is enabled; the scene unmounts outside the viewport. A pause control stops the scene and badge animations. WebGL errors/context loss show the fallback. Fixed aspect ratio reserves layout space.

Dependencies already installed: three, @react-three/fiber, framer-motion. No packages added.

## Add a custom model later

1. Export an optimized, licensed GLB into frontend/public/models/developer.glb. Match the existing origin and scale, and include named Idle and Typing animation clips if available.
2. In DeveloperScene.tsx, replace Character with a component using useGLTF('/models/developer.glb') and useAnimations from the already-installed @react-three/drei. Attach a cloned scene to a group; start/stop animation actions according to the animate prop and clean up on unmount.
3. Wrap model loading in React Suspense. Keep the desk/laptop only if the model does not already contain them. Avoid module-level preloading so mobile does not download the GLB.
4. Keep a fallback visible while loading and the existing error boundary for failed model loads. Test fit with the current camera before changing its framing.

## Loading integration

DeveloperAvatarLoading is exported for the dynamic scene loader. The existing animations/LoadingScreen.tsx now uses the matching illustration and neutral Building Digital Experiences title without AI branding or a fake percentage. Render it only while an actual application loading state is pending, or use it from an appropriate Next.js loading.tsx boundary; it is not permanently mounted on the homepage.

## Test

Run npm --prefix frontend run dev. At desktop widths inspect the seated character, breathing, alternating hands, blink every roughly 4.7 seconds, glowing screen cursor, floating panels and badges. Move the mouse for restrained parallax. Pause and resume with the visible control. Switch tabs and scroll away to check work stops.

At 320/375/768px and on touch devices verify fallback illustration, wrapping and no horizontal overflow. Mobile should not request the DeveloperScene chunk on initial load. Enable reduced motion: animations must stop. Disable WebGL or simulate context loss: the fallback must remain visible. Test both themes, hero buttons and mobile navigation. Check console/WebGL rendering in a real browser; a successful build does not establish visual quality or device performance.

R3F rendering reference: https://r3f.docs.pmnd.rs/advanced/scaling-performance
