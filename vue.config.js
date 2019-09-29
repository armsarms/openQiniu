const path = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin')
// const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
    // 基本路径
    publicPath: './', //本地环境用"/",服务器用"/VueDist/"
    // ./ 是指用户所在的当前目录（相对路径）；
    // / 是指根目录（绝对路径，项目根目录），也就是项目根目录；
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false, //false不检查
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        //兼容IE
        function resolve(dir) {
            return path.join(__dirname, dir)
        }
        //对element-ui添加babel-loader
        config.module.rule('compile')
            .test(/\.js$/)
            .include
            .add(resolve('src'))
            .add('/node_modules/element-ui/src')
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
                presets: [
                    ['@babel/preset-env', {
                        modules: false
                    }]
                ]
            });
        //分析
        if (process.env.npm_lifecycle_event == 'analyz') {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        }
        // 修复HMR
        config.resolve.symlinks(true);
    },
    configureWebpack: (config) => {

        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production';
            // return {
            //     plugins: [
            //         // new CopyWebpackPlugin([{
            //         //     from: __dirname + '/config/.htaccess',
            //         //     to: __dirname + '/VueDist/'
            //         // }])
            //     ]
            // }
            let optimization = {
                minimizer: [new UglifyPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            sequences: true,
                            dead_code: true,
                            conditionals: true,
                            booleans: true,
                            unused: true,
                            if_return: true,
                            join_vars: true,
                            drop_console: true,
                            pure_funcs: ['console.log']
                        }
                    }
                })]
            }
            Object.assign(config, {
                optimization
            })
        } else {
            // 为开发环境修改配置...
            config.mode = 'development';
        }
        // console.log("config", config);
        Object.assign(config, {
            // 开发生产共同配置
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@c': path.resolve(__dirname, './src/components')
                }
            }
        });
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        // extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // proxy: {
        //     // 设置代理
        //     // proxy all requests starting with /api to jsonplaceholder
        //     'http://localhost:8080/': {
        //         target: 'http://baidu.com:8080', //真实请求的目标地址
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^http://localhost:8080/': ''
        //         }
        //     }
        // },
        before: (app) => { }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
};
