const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
    plugins: [
      require("postcss-preset-env"),
      require("autoprefixer"),
      purgecss({
        content: [
          "app/**/*.html",
          "dist/**/*.html",
          "views/**/*.ejs",
          "app/src/**/*.js"
        ],
        exclude: ["node_modules"],
      }),
      require("cssnano")
    ],
  };
  