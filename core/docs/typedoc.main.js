const path = require("node:path");

const projectRoot = path.join(__dirname, "..", "..");

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ["core/formatter", "languages/*", "plugins/*"].map((p) => {
    return path.resolve(path.join(projectRoot, p));
  }),
  entryPointStrategy: "packages",
  plugin: [
    "typedoc-plugin-markdown",
    "typedoc-plugin-frontmatter",
    "typedoc-plugin-rename-defaults",
  ],
  hidePageTitle: true,
  hidePageHeader: true,
  identifiersAsCodeBlocks: true,
  outputFileStrategy: "modules",
  entryFileName: "index.md",
  indexFileName: "api.md",
  out: "./src/api",
};
