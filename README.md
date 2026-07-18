# 8minute.ai website

Landing site for the [8minute.ai™ Podcast](https://8minute.ai), built with
[Astro](https://astro.build) and hosted on GitHub Pages. Podbean still hosts
the podcast itself (audio, RSS feed, episode pages); this site is the public
front door with listen links, about, contact, and (eventually) a blog.

## Development

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

The "Latest episodes" section on the home page is fetched from the Podbean RSS
feed (`https://feed.podbean.com/ai8minutes/feed.xml`) at **build time**, so the
list refreshes whenever the site is rebuilt. The deploy workflow includes a
weekly scheduled rebuild for exactly this reason. If the feed is unreachable
during a build, the site still builds, just without the episode list.

All episode and platform links intentionally use Podbean-native URLs
(`ai8minutes.podbean.com`, `feed.podbean.com`) rather than `www.8minute.ai`
URLs, so nothing on this site breaks when the domain is repointed.

## Deploying to GitHub Pages

Currently deployed as a **project site** at
`https://michaelgilch.github.io/8minute.ai-web/` (also reachable via the user
site's custom domain as `https://michaelgilchrist.dev/8minute.ai-web/` if that
is configured). `astro.config.mjs` sets `base: '/8minute.ai-web'` accordingly,
and all internal links go through the `withBase()` helper in
`src/lib/podcast.js`.

1. Create a GitHub repo and push this project to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source**, choose
   **GitHub Actions**. The included workflow
   (`.github/workflows/deploy.yml`) builds and deploys on every push to
   `main`, weekly on a schedule, and on manual dispatch.

### Switching to the custom domain later

1. In `astro.config.mjs`: set `site: 'https://8minute.ai'` and `base: '/'`.
2. Recreate `public/CNAME` containing the single line `8minute.ai`.
3. In **Settings → Pages → Custom domain**, enter `8minute.ai` and enable
   **Enforce HTTPS** once the certificate is issued.
4. Read the DNS/feed warning below FIRST.

## ⚠️ Before repointing DNS: the RSS feed

The podcast's registered feed URL is `https://www.8minute.ai/feed.xml`
(confirmed by the feed's own `atom:link rel="self"` and
`itunes:new-feed-url`). Apple Podcasts, Spotify, and every subscriber's app
poll that URL. If both `8minute.ai` and `www.8minute.ai` are pointed at
GitHub Pages, **the feed 404s and podcast apps stop receiving new episodes.**

Recommended DNS setup (keeps the feed alive, no directory changes needed):

| Record | Host  | Value                                        | Purpose        |
| ------ | ----- | -------------------------------------------- | -------------- |
| A      | `@`   | `185.199.108.153`                            | GitHub Pages   |
| A      | `@`   | `185.199.109.153`                            | GitHub Pages   |
| A      | `@`   | `185.199.110.153`                            | GitHub Pages   |
| A      | `@`   | `185.199.111.153`                            | GitHub Pages   |
| CNAME  | `www` | *(leave as-is, pointing at Podbean)*         | Feed keeps working |

With this setup, `8minute.ai` serves this site while `www.8minute.ai`
continues to serve the Podbean pages and, critically, the RSS feed.

The alternative is to migrate the feed URL to
`https://feed.podbean.com/ai8minutes/feed.xml` in Podbean's settings and in
each directory (Apple Podcasts Connect, Spotify for Creators, etc.) *before*
repointing `www`. Only do this deliberately; feed migration mistakes lose
subscribers.

## Adding the blog later

Astro makes this straightforward when ready:

1. Add a content collection in `src/content/blog/` with markdown files.
2. Replace `src/pages/blog/index.astro` with a listing page and add a
   `src/pages/blog/[slug].astro` detail page.

## Project layout

```
public/            static files (images, favicons, CNAME, robots.txt)
src/lib/podcast.js podcast metadata, platform links, RSS fetcher
src/layouts/       shared page shell (head, header, footer)
src/components/    ListenLinks (platform buttons)
src/pages/         index, about, contact, blog
src/icons/         platform SVG icons
src/styles/        global stylesheet (palette from the cover art)
```
