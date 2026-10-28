// Canonical production origin shared by Astro, metadata, and crawler endpoints.
export const SITE_URL = 'https://preschool-nijiiro.pages.dev/';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).href;
}
