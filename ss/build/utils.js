var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.getStyleOptions = function (name, options = {}) {
  const { commonOptions = {}, ...rest } = options;
  // generate loader string to be used with extract text plugin
  const defaultLoaders = [
    MiniCssExtractPlugin.loader,
    'style-loader',
    {
      loader: require.resolve('css-loader'),
      options: { ...commonOptions },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        ...commonOptions,
      },
    },
  ];

  function generateLoaders (loader) {
    if (/\?/.test(loader)) {
      loader = loader.replace(/\?/, '-loader?')
    } else {
      loader = loader + '-loader'
    }
    return {
      loader,
      options: {
        ...commonOptions,
        ...rest,
      }
    }
  }

  // 
  if (/\.css$/.test(name)) {
    return defaultLoaders;
  }
  return [...defaultLoaders, generateLoaders(name)]
}

// Generate loaders for standalone style files 
exports.getStyleLoaders = function (name, options = {}) {
  const { use, ...rest } = options;
  var loaders = exports.getStyleOptions(name, use)
  return [{
    test: new RegExp('\\.' + name + '$', "i"),
    ...rest,
    use: loaders,
  }]
}