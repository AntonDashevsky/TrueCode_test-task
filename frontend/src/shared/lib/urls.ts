export function getImageUrl(path: string): string {
  return `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/uploads/${path}`;
}
