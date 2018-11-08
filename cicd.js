

const Promise = require('bluebird');
const ObjectAssignDeep = require('object-assign-deep');
const CICD = require('sn-cicd');

/*
    This module is extending sn-cicd (github.com/bmoers/sn-cicd)
    Feel free to add your code to below functions.
    
*/

const _init = CICD.prototype.init;
CICD.prototype.init = function () {
    const self = this;
    return _init.apply(self, arguments).then(() => {
        // do some additinoal init work
    });
};

CICD.prototype.createRemoteRepo = function (config, repoName) {
    return Promise.try(() => {
        /*
            code to create remote git repo if required
        */
    });
};

CICD.prototype.pendingPullRequest = function ({ config, repoName, from }) {
    return Promise.try(() => {
        /*
            code to check if there is already a pending pull request
        */
        return false;
    });
};

CICD.prototype.raisePullRequest = function ({ config, requestor, repoName, from, to, title, description }) {
    return Promise.try(() => {
        /*
            code to raise a pull request
        */
    });
};



/**
 * Get all files of an application.
 *  The result contains all scoped and non-scoped files linked to an application
 * 
 * @param {Object} application 
 * @returns {Promise<Array>} a list of files
 */
CICD.prototype.getApplicationFiles = function (ctx) {
    return Promise.try(() => {
        /*
            code to export all "master" file information in a format of
            [{
                className: 'sys_script_include',
                sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }]
        */
        return [];
    });

};

/**
 * Get all ATF test suites existing on the SOURCE environment
 * @param {*} config 
 */
CICD.prototype.getApplicationTestSuites = function (config) {
    return Promise.try(() => {
        /*
            code to export all test suite information in a format of
            [{
                className: 'className',
                sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }]
        */
        return [];
    });
};

/**
 * Get all ATF test cases existing on the SOURCE environment
 * @param {*} config 
 */
CICD.prototype.getApplicationTests = function (config) {
    return Promise.try(() => {
        /*
            code to export all test information in a format of
            [{
                className: 'className',
                sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }]
        */
        return [];
    });
};


CICD.prototype.convertBuildBody = function (body) {
    return Promise.try(() => {
        // console.log(body);
        var requestParam = ObjectAssignDeep({
            requestor: {
                userName: null,
                fullName: null,
                email: null
            },
            atf: { 
                name: null,
                updateSetOnly: false
            },
            updateSet: null,
            application: {
                id: null,
                name: null,
                organization: null
            },
            git: {
                repository: null,
                remoteUrl: null
            },
            source: {
                name: null,
            },
            master: {
                name: null,
            },
            target: {
                name: null,
            }
        }, body);

        var options = {
            build: {
                requestor: requestParam.requestor
            },
            atf: {
                updateSetOnly: requestParam.atf.updateSetOnly
            },
            updateSet: requestParam.updateSet,
            application: {
                id: requestParam.application.id,
                name: requestParam.application.name,
                organization: "company"
            },
            git: {
                repository: requestParam.git.repository,
                remoteUrl: requestParam.git.remoteUrl,
                enabled: requestParam.git.enabled === undefined ? (Boolean(requestParam.git.repository)) : requestParam.git.enabled,
                pullRequestEnabled: requestParam.git.pullRequestEnabled === undefined ? (Boolean(requestParam.git.repository)) : requestParam.git.pullRequestEnabled
            },
            host: {
                name: requestParam.source.name
            }
        };
        if (requestParam.master.name) {
            options.master = {
                name: "master",
                host: {
                    name: requestParam.master.name
                }
            };
        }
        if (requestParam.target.name) {
            options.deploy = {
                host: {
                    name: requestParam.target.name
                }
            };
        }

        //console.log('convertBuildBody:')
        //console.log('%j', options);
        return options;
    });
};

CICD.prototype.gitPullRequestProxyConvertBody = function (body) {
    return Promise.try(() => {
        /*
           whatever it needs to convert the inbound body to 
           the correct format to internally call gitPullRequestUpdate()
       */
        return body;
    });
};

module.exports = CICD;