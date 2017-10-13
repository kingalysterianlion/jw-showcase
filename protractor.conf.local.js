var argv = {};
process.argv.forEach(function(value, key) {
    if (value.indexOf('--') === 0) {
        argv[value.replace('--', '')] = process.argv[++key].split(',');
    }
});

/**
 * Add cucumber report output
 *
 * @param {Object} capabilities
 * @returns {Object}
 */
function createCapabilities (capabilities, tags, screenSize) {

    if (!capabilities.cucumberOpts) {
        capabilities.cucumberOpts = {};
    }

    if (screenSize) {
        capabilities.screenSize = screenSize;

        // push tag
        tags.push('@desktop-screen-' + screenSize);
    }

    var metadata = getMetaData(capabilities);

    capabilities.cucumberOpts.format = 'json:./test/reports/results.json';
    capabilities.cucumberOpts.tags = tags;
    capabilities.metadata = {
        browser: {
            name: metadata.browser,
            version: metadata.browserVersion
        },
        device: metadata.device,
        platform: {
            name: metadata.os,
            version: metadata.osVersion
        }
    };

    return capabilities;
}

function getMetaData(capabilities) {
    var os              = capabilities.os || 'osx',
        osVersion       = capabilities.os_version || 'latest',
        browser         = capabilities.browser || capabilities.browserName || 'default',
        browserVersion  = capabilities.browserVersion || capabilities.browser_version || 'latest',
        device          = capabilities.device || capabilities.screenSize || 'desktop',
        screenSize      = capabilities.screenSize || '';

    return {
        os,
        osVersion,
        browser,
        browserVersion,
        device,
        screenSize
    };
}

const config = {
    baseUrl: 'http://localhost:9001',

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    maxSessions: 1,

    cucumberOpts: {
        require: [
            'test/features/support/**/*.js',
            'test/features/step_definitions/**/*.js'
        ],
        format: 'json:./test/reports/results.json'
    },

    seleniumAddress: 'http://localhost:4444/wd/hub',

    suites: {
        video: 'test/features/video.feature',
        full: [
            'test/features/*.feature'
        ]
    },

    plugins: [{
        package: 'protractor-multiple-cucumber-html-reporter-plugin',
        options: {
            automaticallyGenerateReport: true,
            removeExistingJsonReportFile: true,
            saveCollectedJSON: false,
            reportPath: './test/reports/html'
        }
    }]
};

module.exports = {
    config,
    createCapabilities,
    argv
};
