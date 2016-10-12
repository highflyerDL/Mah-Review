var webpack = require('webpack');
var path = require('path');
var PROD = JSON.parse(process.env.PORT || '0');
var webpackConfig = {
  entry: [
    // 'webpack-dev-server/client?http://localhost:8080',
    // 'webpack/hot/only-dev-server',
    './www/index.js'
  ],
  output: {
    path: __dirname + '/www/',
    publicPath: '/www',
    filename: 'bundle.js'
  },
  watch: true,
  module: {
    loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/, // js / jsx
        loaders: ['babel-loader'] // is handled by babel loader with es2015 support
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }) 
    ] : [],
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.scss'], // what file extensions babel looks for in imports
    root: path.resolve(__dirname), // absolute imports
    modulesDirectories: ['node_modules'], // where to look for modules
    alias: {
      // Make it so that 'require' finds the right file.
      "react-star-css": __dirname + "/node_modules/react-star-rating/dist/css/react-star-rating.min.css",
      "grid-css": __dirname + "/node_modules/react-grid-layout/css/styles.css",
      "resizable-css": __dirname + "/node_modules/react-resizable/css/styles.css",
      "markdown-scss": __dirname + "/node_modules/react-markdown-textarea/lib/_react_markdown_textarea.scss",
    }
  },
};

module.exports = webpackConfig;
