/** @type {import('vitepress').SiteConfig} */
export default {
  // site-level options
  title: "Insight Formatter",
  description:
    "Make [insert language] diagnostic info prettier and human-readable.",
  srcDir: "./src",
  outDir: "./dist",
  assetsDir: "./assets",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide" },
      { text: "Config", link: "/config" },
      { text: "API", link: "/api/index" },
      { text: "Changelog", link: "https://github.com/..." },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
      {
        text: "API",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
    ],
  },
  vite: {
    server: {
      watch: {
        usePolling: process.platform === "win32",
      },
    },
  },
};
