/** Optimize local assets and trusted Cloudinary media; preserve other CMS URLs. */
export function shouldBypassImageOptimization(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return false;
  try {
    const url = new URL(src);
    return (
      url.protocol !== "https:" ||
      url.hostname !== "res.cloudinary.com" ||
      url.port !== ""
    );
  } catch {
    return true;
  }
}
