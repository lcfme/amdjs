const path = require("path");
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "amd.js",
    path: path.resolve(__dirname, "dist"),
    library: "amd",
    libraryTarget: "var"
  },
  devtool: "source-map",
  mode: "none",
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: path.resolve(__dirname, "src")
      }
    ]
  }
};
