const qs = require('querystring');
const loaderUtils = require('loader-utils');

module.exports = function (source) {

    const loaderContext = this;
    const {resourceQuery} = loaderContext;
    const rawQuery = resourceQuery.slice(1);
    const incomingQuery = qs.parse(rawQuery);
    const options = loaderUtils.getOptions(loaderContext) || {};

    /**
     * Don't handle x-template
     */
    if (options.type === 'x-template') {
        return '';
    }

    /**
     * Convert x-style and x-script tag to style and script tag
     */
    source = source.replace(/<x-style/g, '<style');
    source = source.replace(/<style/g, '<style xbType="style"');
    source = source.replace(/<\/x-style/g, '</style');

    source = source.replace(/<x-script/g, '<script');
    source = source.replace(/<script/g, '<script xbType="script"');
    source = source.replace(/<\/x-script/g, '</script');

    return source;
}
