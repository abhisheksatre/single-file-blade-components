const mix = require('laravel-mix');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const bladeLoader = require.resolve('./loader');

class SingleFileBladeComponent {

    register(src, target) {
        mix.js(src, target);
    }

    webpackRules() {
        return [{
            test: /\.blade.php$/,
            use: [
                {
                    loader: 'vue-loader',
                    options: Config.vue || {}
                },
                {
                    loader: bladeLoader
                }
            ]
        },
            {
                resourceQuery: /blockType=x-template/,
                use: [{
                    loader: bladeLoader,
                    options: {
                        type: 'x-template'
                    }
                }]
            },
            {
                resourceQuery: /xbType=style/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        esModule: false,
                    }
                }]
            }
        ];
    }

    webpackPlugins() {
        return [new MiniCssExtractPlugin()];
    }


    webpackConfig(config) {

        const pitcher = {
            loader: require.resolve('./pitcher'),
            resourceQuery: /xbType=style/,
        };

        config.module.rules = [
            pitcher,
            ...config.module.rules
        ];

    }
}

mix.extend('singleFileBladeComponent', new SingleFileBladeComponent());
mix.extend('sfbc', new SingleFileBladeComponent());