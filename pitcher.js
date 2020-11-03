const loaderUtils = require('loader-utils');
const qs = require('querystring');

const isPitcher = l => l.path === __filename;
const isStyleLoader = l => /(\/|\\|@)style-loader/.test(l.path);
const isExtractPlugin = l => /(\/|\\|@)mini-css-extract-plugin/.test(l.path);

module.exports = code => code;

module.exports.pitch = function (remainingRequest) {

    const rawQuery = this.resourceQuery.slice(1);
    const incomingQuery = qs.parse(rawQuery);

    /**
     * Copied from vue-loader
     * @param loaders
     */
    const genRequest = loaders => {
        const seen = new Map();
        const loaderStrings = [];

        loaders.forEach(loader => {
            const identifier = typeof loader === 'string'
                ? loader
                : (loader.path + loader.query);
            const request = typeof loader === 'string' ? loader : loader.request;
            if (!seen.has(identifier)) {
                seen.set(identifier, true);
                // loader.request contains both the resolved loader path and its options
                // query (e.g. ??ref-0)
                loaderStrings.push(request);
            }
        });

        return loaderUtils.stringifyRequest(this, '-!' + [
            ...loaderStrings,
            this.resourcePath + this.resourceQuery
        ].join('!'))
    }

    const shouldExtractCss = incomingQuery.extract !== 'false';

    /**
     * Rearrange extract plugin loader and remove unwanted loaders
     */
    let loaders = this.loaders.reduce((accumulator, loader) => {

        if (isExtractPlugin(loader)) {
            if (shouldExtractCss === true) {
                accumulator.unshift(loader);
            }
        } else if (!isPitcher(loader) && (!isStyleLoader(loader) || (isStyleLoader(loader) && shouldExtractCss === false))) {
            accumulator.push(loader);
        }

        return accumulator;
    }, []);

    const request = genRequest(loaders);

    return `import mod from ${request}; export default mod; export * from ${request}`
};
