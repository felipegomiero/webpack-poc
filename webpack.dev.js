const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		devMiddleware: {
			index: true,
			mimeTypes: { phtml: "text/html" },
			publicPath: "/publicPathForDevServe",
			serverSideRender: true,
			writeToDisk: true,
		},
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
	/* 
	Provide lodash to all _ users
	plugins: [
		new webpack.ProvidePlugin({
			_: "lodash",
		}),
	], */
	/* module: {
		rules: [
			Some legacy modules rely on this being the window object.
				This becomes a problem when the module is executed in a CommonJS context where this is equal to module.exports
			{
				test: require.resolve("./src/index.js"),
				use: "imports-loader?wrapper=window",
			},
			Now, while you'd likely never do this in your own source code, you may encounter a dated library you'd like to use that contains similar code to what's shown above. In this case, we can use exports-loader, to export that global variable as a normal module export. For instance, in order to export file as file and helpers.parse as parse:
			{
        test: require.resolve('./src/globals.js'),
        use:
          'exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse',
      },
		],
	}, */
});
