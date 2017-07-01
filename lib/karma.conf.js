
const path = require('path');

const karmaContextFile = path.join(__dirname, 'karma-context.html');
const isDebugRun = !!process.env.KARMA_DEBUG;

const onCIService = Boolean(process.env.CONTINUOUS_INTEGRATION);

module.exports = function(config) {
    config.set({
        browserNoActivityTimeout: 120000, // 2 min

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        customDebugFile: karmaContextFile,

        customContextFile: karmaContextFile,

        frameworks: ['mocha'],

        files: [
            'node_modules/mocha/mocha.css',
            '**/*.svg',
            '/Users/a-lexx/ya/bem-components/desktop.specs/popup_target_anchor/popup_target_anchor.html',
            '/Users/a-lexx/ya/bem-components/desktop.specs/popup_target_anchor/popup_target_anchor.css',
            '/Users/a-lexx/ya/bem-components/desktop.specs/popup_target_anchor/popup_target_anchor.spec.js'
        ].map(file => ({ pattern: file, included: false })),

        client: {
            logLevel: isDebugRun ? 'DEBUG' : 'WARN',
            useIframe: false,
            // chai config
            chai: {
                includeStack: true
            }
        },

        plugins: [
            'karma-yandex-launcher',
            'karma-chrome-launcher',
            'karma-mocha-reporter',
            'karma-mocha'
        ],

        preprocessors: {},

        reporters: onCIService && !process.env.COMMON_REPORTER ? ['teamcity'] : ['mocha'],

        port: 9876,

        colors: !onCIService,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
        // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: isDebugRun ? config.LOG_DEBUG : config.LOG_WARN,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        browsers: ['ChromeHeadless_configured'], // ['Yandex'], //

        customLaunchers: {
            ChromeHeadless_configured: {
                base: 'ChromeCanary',
                flags: ['--headless', '--disable-translate', '--disable-extensions', '--disable-gpu', '--window-size=980,700',  '--remote-debugging-port=9222']

            }
        },

        singleRun: true, // onCIService || !isDebugRun,

        // Concurrency level: how many browser should be started simultaneous
        concurrency: Infinity
    });
};
