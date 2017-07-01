'use strict';

const path = require('path');
const Karma = require('karma');
const logger = console;

/**
 * Возвращает список файлов, которые будут загружены на страницу тестов.
 * desktop.specs/badges => desktop.specs/badges/badges.html
 *                         desktop.specs/badges/badges.spec.js
 *
 * @param {string[]} files - массив путей к директориям с тестовыми файлами
 * @return {Object[]} - массив объектов-описателей файлов загружаемых кармой на страницу тестирования
 */

function getFilesToPush(files) {
    const fileExtensions = [
        'html',
        'css',
        'spec.js'
    ];
    const getTestFiles = prefix => fileExtensions.map(extension =>
        ({ pattern: `${prefix}.${extension}`, included: false }));

    return (files && files.length) ?
        files.reduce((acc, f) => acc.concat(getTestFiles(path.resolve(f, path.basename(f)))), []) :
        getTestFiles('desktop.specs/**/*');
}

class KarmaRunner {
    constructor(host, port) {
        this._host = host || 'localhost';
        this._port = port || 9876;
    }

    start(dir, targets) {
        return new Promise((resolve, reject) => {
            const karmaConfig = Karma.config.parseConfig(path.join(__dirname, '/karma.conf.js'), {
                basePath: dir,
                port: this._port,
                hostname: this._host
            });

            karmaConfig.files = [].concat(getFilesToPush(targets), karmaConfig.files);

            let browserError;
            const karmaServer = new Karma.Server(karmaConfig, exitCode => {
                if (exitCode === 0) {
                    resolve();
                } else {
                    const message = 'Tests failed.' + (browserError ? `Error:${browserError}` : `Code: ${exitCode}`);

                    reject(new Error(message));
                }
            });

            karmaServer.on('browser_error', (browser, error) => {
                logger.error(browser.name, error && error.stack || error);

                browserError = error;
            });

            // принудительно стартуем тесты, если не в режиме одного запуска
            !karmaConfig.singleRun && karmaServer.on('browsers_ready', () => {
                Karma.runner.run({}, () => {});
            });

            karmaServer.start();
        });
    }
}

exports.run = function(targets, dir) {
    return (new KarmaRunner()).start(dir, targets);
};
