import { defineConfig } from 'astro/config';

export default defineConfig({
  // Project-pages deployment. When moving to the custom domain:
  // site: 'https://8minute.ai', base: '/', and restore public/CNAME.
  site: 'https://michaelgilch.github.io',
  base: '/8minute.ai-web',
});
