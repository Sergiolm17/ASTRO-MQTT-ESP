module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,css,svg,html,txt}"],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: "dist/sw.js",
  //swSrc: "dist/sw.js",
};
