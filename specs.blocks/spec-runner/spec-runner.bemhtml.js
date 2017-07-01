block('spec-runner')(
    tag()('script'),

    content()([
        `(function() {
            var karmaConfig;
            var karmaRunner;
            if (window.__karma__) {
                karmaRunner = window.__karma__.start.bind(window.__karma__);
                window.__karma__.start = function(config) {
                    karmaConfig = config;
                };
            } else {
                mocha.setup({
                    ui: 'bdd',
                    ignoreLeaks: true
                });
            }

            // eslint-disable-next-line consistent-this
            var global = this;
            typeof modules === 'object' ? modules.require(['spec'], function() {
                init();
            }) : init(global.jQuery, global.mocha);

            function init() {
                if (karmaRunner) {
                    karmaRunner(karmaConfig);
                } else {
                    window.mocha.run();
                }
            }
        }());
        `
    ])
);
