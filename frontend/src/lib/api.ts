// Same-origin requests allow the server to set an HttpOnly cookie.
// The server forwards to NEXT_PUBLIC_API_URL (or its private BACKEND_URL override).
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch("/api" + path, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = (await response.json().catch(() => null)) as {
    message?: string | string[];
  } | null;
  if (!data)
    throw new ApiError(
      "The service returned an invalid response. Please try again.",
      response.status,
    );
  if (!response.ok)
    throw new ApiError(
      Array.isArray(data.message)
        ? data.message.join(" ")
        : typeof data.message === "string"
          ? data.message
          : "Request failed. Please try again.",
      response.status,
    );
  return data as T;
}
