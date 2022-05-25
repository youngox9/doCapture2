const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// const PROXY_DEV_URL = `10.2.0.8`;
const PROXY_DEV_URL = `10.2.3.125`;

module.exports = (env, options) => {
  const isDev = options.mode === "development";
  return {
    devtool: 'inline-source-map',
    // devtool: 'eval',
    entry: ["@babel/polyfill", "./src/index.js"],
    output: {
      path: path.resolve(__dirname, "build"),
      publicPath: isDev ? "" : "../site/",
      //
      filename: '[name].[hash:8].js',
      sourceMapFilename: '[name].[hash:8].map',
      chunkFilename: '[name].[hash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src'),
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader",
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        },
        {
          test: /\.(sass|scss)$/,
          use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
        },
        {
          test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|ttf|eot)$/,
          loader: "file-loader"
        }
      ]
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        // "@/components": path.resolve(__dirname, "src/components"),
        // "@/pages": path.resolve(__dirname, "src/pages")
      },
      extensions: [".js", ".jsx"],
      modules: [
        path.resolve(__dirname, "src/"),
        path.resolve(__dirname, "node_modules/")
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    plugins: [
      // new webpack.HotModuleReplacementPlugin(),
      // new BundleAnalyzerPlugin(),
      new webpack.ProvidePlugin({
        React: 'react'
      }),
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
        filename: "./index.html"
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: options.mode
      })
    ],
    devServer: {
      port: 3000,
      // open: true,
      // hot: true,
      compress: true,
      proxy: {
        "/api": {
          target: `http://${PROXY_DEV_URL}/docaptures/api`,
          pathRewrite: { "^/api/": "/" }
        },
        "/connect": {
          target: `${PROXY_DEV_URL}/websocket/docaptures/connect/`,
          ws: true,
          // pathRewrite: { "^/connect/": "/" },
        },
      },
    }
  };
};
