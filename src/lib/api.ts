const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export function apiUrl(path: string) {
  const baseUrl = API_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}
