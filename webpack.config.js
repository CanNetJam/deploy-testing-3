const nodeExternals = require("webpack-node-externals")
const path = require("path")

const typicalReact = {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: { 
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"]
        },
        
      }
    },
  ]
}

const clientConfig = {
  entry: ["./src/home.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "index.js"
  },
  mode: "production",
  module: typicalReact,
}

const serverConfig = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "server-compiled.js"
  },
  mode: "production",
  externals: [nodeExternals()],
  target: "node",
  module: typicalReact,
}

module.exports = [clientConfig, serverConfig]