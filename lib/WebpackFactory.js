const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = class WebpackFactory {

    constructor(container) {
        this.container = container;
    }

    /**
     * Load all Meta.js files that are found in currently registered bundles
     *
     * @return {Array}
     */
    loadMetas() {

        const metas = [];

        let bundles = this.container.getParameter('app.bundles');

        // sort bundles by ones that should be at beginning
        const sort = [
            '@conga/framework',
            '@conga/framework-profiler'
        ];

        const order = sort.reduce((r, a, i, aa) => (r[a] = -aa.length + i, r), {});
        bundles.sort((a, b) => (order[a] || 0) - (order[b] || 0));

        bundles.forEach((bundle) => {

            const root = this.container.get('namespace.resolver').resolveWithSubpath(
                bundle + ':resources/conga-dashboard',
                'lib'
            );

            const p = path.join(root, 'Meta.js');

            if (fs.existsSync(p)) {
                const meta = require(p);
                meta.root = root;
                metas.push(meta);
            }
        });

        return metas;
    }

    /**
     * Build the temp directory of symlinks to all of the bundle dashboard js files
     *
     * need to do this in order to pass the entire directory as an alias to webpack
     * so that we can dynamically load the various bundle javascripts
     *
     * @param  {Array} metas
     * @return {void}
     */
    buildTemp(metas) {

        const tmp = path.join(this.container.getParameter('kernel.var_path'), 'tmp', 'conga-dashboard', 'bundles');

        fs.ensureDirSync(tmp);

        metas.forEach((meta) => {

            const src = path.join(meta.root, 'public', 'js');
            const target = path.join(tmp, meta.id);

            fs.ensureSymlinkSync(src, target);

        });

    }

    /**
     * Build symlink directories for profiler collectors found and return
     * the names of the directories
     *
     * @param  {Array} metas
     * @return {Array}
     */
    buildCollectorsTemp(metas) {

        const names = [];

        const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());

        const tmp = path.join(this.container.getParameter('kernel.var_path'), 'tmp', 'conga-dashboard', 'collectors');

        fs.ensureDirSync(tmp);

        metas.forEach((meta) => {

            const src = path.join(meta.root, 'collector');

            if (fs.existsSync(src)) {

                const dirs = getDirectories(src);

                dirs.forEach((dir) => {
                    names.push(dir);
                    const target = path.join(tmp);
                    fs.ensureSymlinkSync(path.join(src, dir), path.join(target, dir));
                });

            }

        });

        return names;

    }

    /**
     * Build and return the webpack configuration
     *
     * @return {Object}
     */
    factory() {

        const metas = this.loadMetas();

        this.buildTemp(metas);
        const collectors = this.buildCollectorsTemp(metas);

        let root = this.container.getParameter('kernel.project_path');

        // check if we are in a linked dev module
        if (fs.existsSync(path.join('..', 'node_modules', 'vue'))) {
            root = this.container.get('bundle.finder').find('@conga/framework-dashboard')
        }

        let aliases = {
            //'vue': 'vue/dist/vue.common.js',
            'vue$': path.join(root, 'node_modules', 'vue/dist/vue.common.js'),
            'bundles': path.join(this.container.getParameter('kernel.var_path'), 'tmp', 'conga-dashboard', 'bundles'),
            'collectors': path.join(this.container.getParameter('kernel.var_path'), 'tmp', 'conga-dashboard', 'collectors'),
        };

        const modules =  [
            path.resolve(this.container.getParameter('kernel.project_path'), 'node_modules'),
            path.join(__dirname, '..', 'node_modules', '@conga', 'framework-dashboard', 'node_modules')
        ];

        return {

            context: this.container.get('bundle.finder').find('@conga/framework-dashboard'),
            //context: path.resolve(path.join('__dirname', '..')),
            //path.resolve(path.join(__dirname, 'resources', 'public-src')),

            entry: {
                'conga': './lib/resources/public-src/dashboard.js'
            },

            output: {
                filename: '[name].[hash].bundle.js',
                path: '/',
                publicPath: '/dist/'
            },

            module: {

                loaders: [
                    {
                        test: /\.html$/,
                        loader: 'vue-template-compiler'
                    }
                ],

                rules: [
                    {
                        test: /\.(css|sass|scss)$/,
                        use: ExtractTextPlugin.extract({
                            fallback: path.join(root, 'node_modules', 'style-loader'),
                            use: [
                                path.join(root, 'node_modules', 'css-loader'),
                                path.join(root, 'node_modules', 'sass-loader')
                            ]
                        })
                    },

                    {
                        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
                        // loader: "url?limit=10000"
                        use: "url-loader"
                    },
                    {
                        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                        use: require.resolve("url-loader") + "?name=../[path][name].[ext]"
                    },


                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: path.join(root, 'node_modules', 'babel-loader'),
                            options: {
                              //presets: ["es2015"],//.map(require.resolve)
                              presets: [
                                  path.join(root, 'node_modules', 'babel-preset-es2015')
                              ],
                              plugins: [require("babel-plugin-transform-class-properties")]
                            }
                        }
                    },

                ]

            },

            resolveLoader: {
                  modules: [
                      //path.join(this.container.getParameter('kernel.project_path'), 'node_modules'),
                      //path.join(__dirname, '..', 'node_modules', '@conga', 'framework-dashboard', 'node_modules')
                  ]
            },

            resolve: {
                extensions: ['.js'],
                alias: aliases,
                //modules: modules,
                symlinks: true
            },

            plugins: [
                new webpack.DefinePlugin({
                    'BUNDLE_METAS': JSON.stringify(metas),
                    'PROFILER_COLLECTORS': JSON.stringify(collectors)
                }),
                new ExtractTextPlugin('[name].[hash].css')
            ]

        };
    }
}
