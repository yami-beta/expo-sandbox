module.exports = {
  locales: ["ja", "en"],
  sourceLocale: "ja",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
};
