import { defineConfig } from 'astro/config';

export default defineConfig({
  // Project-pages deployment; michaelgilch.github.io redirects to
  // michaelgilchrist.dev (the user site's custom domain), so canonicals point
  // there. When moving to this project's own custom domain:
  // site: 'https://8minute.ai', base: '/', and restore public/CNAME.
  site: 'https://michaelgilchrist.dev',
  base: '/8minute.ai-web',
});
