import { defineConfig } from "languine";

export default defineConfig({
  locale: {
    source: "en",
    targets: ["it"],
  },
  files: {
    json: {
      include: ["src/messages/[locale].json"],
    },
    mdx: {
      include: ["src/markdown/docs/en/*.mdx"],
    },
  },
});
