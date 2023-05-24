const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// DONE: Add and configure workbox plugins for a service worker and manifest file.
// DONE: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: "development",
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        title: "JATE",
      }),
      new MiniCssExtractPlugin(),
      new InjectManifest({
        swSrc: "./src/sw.js",
        swDest: "service-worker.js",
      }),
      new WebpackPwaManifest({
        name: "JATE",
        short_name: "JATE",
        description: "just another text editor",
        // TODO: Check if these colors are correct
        background_color: "#7eb4e2",
        theme_color: "#7eb4e2",
        start_url: "./",
        // TODO: Check on the icon routing
        icons: [
          {
            src: path.resolve("images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
  };
};
