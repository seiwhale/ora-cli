'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const paths = require('./paths');
const {
	BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = './';
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
// Get environment variables to inject into our app.

module.exports = merge(baseWebpackConfig, {
	mode: 'production',
	// Don't attempt to continue if there are any errors.
	bail: true,
	devtool: false, // shouldUseSourceMap ? 'source-map' : true,
	output: {
		// The build folder.
		path: paths.appBuild,
		// Generated JS file names (with nested folders).
		// There will be one main bundle, and one file per asynchronous chunk.
		// We don't currently advertise code splitting but Webpack supports it.
		filename: './static/js/[name].js',
		chunkFilename: './static/js/[name].chunk.js',
		// We inferred the "public path" (such as / or /my-project) from homepage.
		publicPath: publicPath,
		// Point sourcemap entries to original disk location (format as URL on Windows)
		devtoolModuleFilenameTemplate: info =>
			path
			.relative(paths.appSrc, info.absoluteResourcePath)
			.replace(/\\/g, '/'),
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					parse: {
						// we want terser to parse ecma 8 code. However, we don't want it
						// to apply any minfication steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// Pending further investigation:
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// Pending futher investigation:
						inline: 2,
					},
					mangle: {
						safari10: true,
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						ascii_only: true,
					},
				},
				// Use multi-process parallel running to improve the build speed
				// Default number of concurrent runs: os.cpus().length - 1
				parallel: true,
				// Enable file caching
				cache: true,
				sourceMap: shouldUseSourceMap,
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					parser: safePostCssParser,
					map: shouldUseSourceMap ?
						{
							// `inline: false` forces the sourcemap to be output into a
							// separate file
							inline: false,
							// `annotation: true` appends the sourceMappingURL to the end of
							// the css file, helping the browser find the sourcemap
							annotation: true,
						} :
						false,
				},
			}),
		],
		// Automatically split vendor and commons
		splitChunks: {
			chunks: 'all',
			name: false,
		},
		// Keep the runtime chunk seperated to enable long term caching
		runtimeChunk: true,
	},
	plugins: [
		// Generates an `index.html` file with the <script> injected.
		new BundleAnalyzerPlugin({
			analyzerPort: 8919
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		shouldInlineRuntimeChunk && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'static/css/[name].css',
			chunkFilename: 'static/css/[name].chunk.css',
		}),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
			publicPath: publicPath,
		}), 
		new WorkboxWebpackPlugin.GenerateSW({
			clientsClaim: true,
			exclude: [/\.map$/, /asset-manifest\.json$/],
			importWorkboxFrom: 'cdn',
			navigateFallback: publicPath + '/index.html',
			navigateFallbackBlacklist: [
				// Exclude URLs starting with /_, as they're likely an API call
				new RegExp('^/_'),
				// Exclude URLs containing a dot, as they're likely a resource in
				// public/ and not a SPA route
				new RegExp('/[^/]+\\.[^/]+$'),
			],
		}),
	]
});
