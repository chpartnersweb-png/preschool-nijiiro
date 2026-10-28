// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/data/site-config.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
});
