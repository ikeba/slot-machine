const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
	filename: 'assets/style.css'
});

module.exports = {
	entry: ['./src/js/main.js', './src/css/main.scss'],
	devtool: 'source-map',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{
						loader: 'css-loader'
					}, {
						loader: 'sass-loader'
					}],
					// use style-loader in development
					fallback: 'style-loader'
				})
			}
		]
	},
	plugins: [
		new WebpackNotifierPlugin({alwaysNotify: true}),
		new HtmlWebpackPlugin({template: 'src/index.html'}),
		new CopyWebpackPlugin([{from: 'src/assets', to: path.resolve(__dirname, 'dist') + '/assets'}]),
		extractSass]
};
