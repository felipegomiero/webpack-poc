const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
	console.log(env);

	return {
		/* When webpack bundles your source code, it can become difficult to track down errors and warnings to their original location. */
		/* Most of the cases eval-cheap-module-source-map is the best option for having the balance with performance from the cheap and the eval for incremental builds */
		devtool: "eval-cheap-module-source-map",
		/* Set the mode configuration option to development to make sure that the bundle is not minified */
		mode: "development",
		entry: [
			// Your entry
			"./src/_index.js",
		],
		devServer: {
			static: "./dist",
			// HMR It allows all kinds of modules to be updated at runtime without the need for a full refresh
			hot: true,
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					// Use the include field to only apply the loader modules that actually need to be transformed by it:
					include: path.resolve(__dirname, "src"),
					use: ["style-loader", "css-loader"],
				},
			],
		},
		/* But what would happen if we changed the name of one of our entry points, or even added a new one? The generated bundles would be renamed on a build, but our index.html file would still reference the old names. Let's fix that with the HtmlWebpackPlugin. */
		plugins: [
			new HtmlWebpackPlugin({
				title: "Hot Module Replacement",
			}),
		],
		output: {
			filename: env?.production
				? "[name].[contenthash].js"
				: "[name].bundle.js",
			path: path.resolve(__dirname, "dist"),
			clean: true,
			publicPath: "/",
			/* Webpack has the ability to generate path info in the output bundle. However, this puts garbage collection pressure on projects that bundle thousands of modules */
			pathinfo: false,
		},
		optimization: {
			/* Prevents vendor chunk to updates its module id unnecessarily. Now, despite any new local dependencies, our vendor hash should stay consistent between builds: */
			moduleIds: "deterministic",
			/* As we learned in code splitting, the SplitChunksPlugin can be used to split modules out into separate bundles. Webpack provides an optimization feature to split runtime code into a separate chunk using the optimization.runtimeChunk option. Set it to single to create a single runtime bundle for all chunks: */
			runtimeChunk: "single",
			removeAvailableModules: false,
			removeEmptyChunks: false,
			splitChunks: false,
			/* It's also good practice to extract third-party libraries, such as lodash or react, to a separate vendor chunk as they are less likely to change than our local source code. */
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
					},
				},
			},
			usedExports: true,
		},
	};
};
