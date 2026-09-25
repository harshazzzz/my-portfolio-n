/** Called on the server; no development server is assumed in deployments. */
export function getBackendOrigin(): string {
  const value =
    process.env.BACKEND_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!value)
    throw new Error(
      "Set BACKEND_URL or NEXT_PUBLIC_API_URL to your NestJS backend origin.",
    );
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "Backend URL must be an HTTP(S) origin without credentials, path, query or fragment.",
    );
  if (process.env.VERCEL && url.protocol !== "https:")
    throw new Error("Vercel deployments require an HTTPS backend origin.");
  return url.origin;
}
