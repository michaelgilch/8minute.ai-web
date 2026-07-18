export const SITE = {
  title: '8minute.ai',
  fullTitle: '8minute.ai™ Podcast',
  tagline:
    'A podcast that breaks down complex artificial intelligence concepts into easy-to-understand episodes, each just eight minutes long.',
  email: 'info@8minute.ai',
  copyright: 'Copyright 2025 All rights reserved. For Humans By Humans™',
  // Podbean-native URLs so nothing breaks when the 8minute.ai domain moves to GitHub Pages.
  podbeanSite: 'https://ai8minutes.podbean.com',
  feedUrl: 'https://feed.podbean.com/ai8minutes/feed.xml',
};

export const PLATFORMS = [
  {
    name: 'Apple Podcasts',
    icon: 'applepodcasts',
    url: 'https://podcasts.apple.com/us/podcast/8minute-ai/id1814469954',
  },
  {
    name: 'Spotify',
    icon: 'spotify',
    url: 'https://open.spotify.com/show/3TIUCfhLa4TcD2FGrutXSZ',
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    url: 'https://www.youtube.com/playlist?list=PLZFisPPjsuurYLVZyXKqNuc-4ieB-nm9a',
  },
  {
    name: 'Amazon Music',
    icon: 'amazonmusic',
    url: 'https://music.amazon.com/podcasts/564bd023-8052-421f-8012-552d38ba0747',
  },
  {
    name: 'iHeartRadio',
    icon: 'iheartradio',
    url: 'https://www.iheart.com/podcast/1323-8minuteai-podcast-275650980/',
  },
  {
    name: 'Podbean',
    icon: 'podbean',
    url: 'https://ai8minutes.podbean.com',
  },
  {
    name: 'RSS Feed',
    icon: 'rss',
    url: 'https://feed.podbean.com/ai8minutes/feed.xml',
  },
];

function tag(block, name) {
  const m = block.match(
    new RegExp(`<${name}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`)
  );
  return m ? m[1].trim() : '';
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, '’');
}

function excerpt(html, maxLength = 160) {
  const text = decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength)) + '…';
}

function formatDuration(seconds) {
  const n = Number(seconds);
  if (!n) return '';
  return `${Math.max(1, Math.round(n / 60))} min`;
}

async function fetchAndParseFeed() {
  try {
    const res = await fetch(SITE.feedUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    const episodes = items.map((item) => ({
      title: decodeEntities(tag(item, 'title')),
      url: tag(item, 'link').replace(
        'https://www.8minute.ai/',
        `${SITE.podbeanSite}/`
      ),
      date: new Date(tag(item, 'pubDate')).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      duration: formatDuration(tag(item, 'itunes:duration')),
      durationSeconds: Number(tag(item, 'itunes:duration')) || 0,
      excerpt: excerpt(tag(item, 'description')),
      notesHtml: tag(item, 'description'),
      audioUrl: (item.match(/<enclosure[^>]*url="([^"]+)"/) || [])[1] ?? '',
    }));
    return { episodes, total: episodes.length };
  } catch (err) {
    console.warn(`Could not fetch podcast feed (${err.message}); building without episodes.`);
    return { episodes: [], total: 0 };
  }
}

let feedPromise;

/**
 * Fetches the podcast feed at build time (once per build, shared across
 * pages). Returns up to `count` episodes plus the total episode count. On any
 * failure the site still builds, just without the episode list.
 */
export async function getFeed(count = Infinity) {
  feedPromise ??= fetchAndParseFeed();
  const { episodes, total } = await feedPromise;
  return {
    episodes: Number.isFinite(count) ? episodes.slice(0, count) : episodes,
    total,
  };
}
