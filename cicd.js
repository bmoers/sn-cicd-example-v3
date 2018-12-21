

const Promise = require('bluebird');
const assign = require('object-assign-deep');
const CICD = require('sn-cicd');

const rp = require('request-promise');

/*
    This module is extending sn-cicd (github.com/bmoers/sn-cicd)
    Feel free to add your code to below functions.
    
*/

const _init = CICD.prototype.init;
CICD.prototype.init = function (mode) {
    const self = this;
    return _init.apply(self, arguments).then(() => {
        // do some additional init work
    });
};


CICD.prototype.registerGitHubWebHook = function (repoName) {
    return Promise.try(() => {

        /*
            THIS IS AN EXAMPLE IMPLEMENTATION TO REGISTER A WEBHOOK DYNAMICALLY.
            DONT USE THIS IN PRODUCTION.
        */

        /*
            check if there is already a webhook registered
        */
        return rp({
            method: 'GET',
            uri: `https://api.github.com/repos/${process.env.CICD_PR_USER_NAME}/${repoName}/hooks`,
            json: true,
            auth: {
                username: process.env.CICD_PR_USER_NAME,
                password: process.env.CICD_PR_USER_PASSWORD
            },
            headers: {
                'User-Agent': process.env.CICD_PR_USER_NAME
            }
        }).then((hooks) => {
            const registered = hooks.some((hook) => hook.name == 'web');
            if (registered)
                return console.log("Hook is already registered.")
          
            /*
                register the webhook
            */
            return rp({
                method: 'POST',
                uri: `https://api.github.com/repos/${process.env.CICD_PR_USER_NAME}/${repoName}/hooks`,
                json: true,
                auth: {
                    username: process.env.CICD_PR_USER_NAME,
                    password: process.env.CICD_PR_USER_PASSWORD
                },
                headers: {
                    'User-Agent': process.env.CICD_PR_USER_NAME
                }, body: {
                    "name": "web",
                    "active": true,
                    "events": [
                        "pull_request"
                    ],
                    "config": {
                        "url": `https://${process.env.CICD_WEBHOOK_PROXY_SERVER}.service-now.com/api/devops/cicd/pull_request`,
                        "content_type": "json",
                        "secret": process.env.CICD_WEBHOOK_SECRET,
                        "insecure_ssl" : 1
                    }
                }
            }).then((result) => {
                console.log('Hook successfully registered.')
            });
                
        });
        
    });
};

CICD.prototype.createRemoteRepo = function (config, repoName) {
    return Promise.try(() => {
        /*
            code to create remote git repo if required
        */
        /*
            THIS IS 'MISUSED' FOR DEMO PURPOSE
            USE THIS METHOD TO CREATE THE REPO IF REQUIRED.

        */
        return self.registerGitHubWebHook(repoName);
    });
};

CICD.prototype.pendingPullRequest = function ({ config, repoName, from }) {
    /*
        THIS IS AN 'GITHUB' EXAMPLE IMPLEMENTATION
    */
    return Promise.try(() => {
        /*
            code to check if there is already a pending pull request
        */
        return rp({
            method: 'GET',
            uri: `https://api.github.com/repos/${process.env.CICD_PR_USER_NAME}/${repoName}/pulls`,
            json: true,
            auth: {
                username: process.env.CICD_PR_USER_NAME,
                password: process.env.CICD_PR_USER_PASSWORD
            },
            headers: {
                'User-Agent': process.env.CICD_PR_USER_NAME
            }
        }).then(function (result) {
            //console.log(response);
            return result.filter((pr) => {
                return (pr.head.ref == from)
            }).length;
        });
    });
};

CICD.prototype.raisePullRequest = function ({ config, requestor, repoName, from, to, title, description }) {
    /*
        THIS IS AN 'GITHUB' EXAMPLE IMPLEMENTATION
    */
    return Promise.try(() => {
        /*
            code to raise a pull request
        */
        return rp({
            method: 'POST',
            uri: `https://api.github.com/repos/${process.env.CICD_PR_USER_NAME}/${repoName}/pulls`,
            json: true,
            auth: {
                username: process.env.CICD_PR_USER_NAME,
                password: process.env.CICD_PR_USER_PASSWORD
            }, body: {
                title: title,
                head: from,
                base: to,
                body: description
            },
            headers: {
                'User-Agent': process.env.CICD_PR_USER_NAME
            }
        }).then(function (response) {
            console.log('raisePullRequest', response);
            return response;
        });
    });
};



/**
 * Get all files of an application.
 *  The result contains all scoped and non-scoped files linked to an application
 * 
 * @param {Object} application 
 * @returns {Promise<Array>} a list of files
 *//*
CICD.prototype.getApplicationFiles = function (ctx) {
    return Promise.try(() => {

            //code to export all "master" file information in a format of
            //[{
            //    className: 'sys_script_include',
            //    sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            //}]
        return [];
    });
};
*/

/**
 * Get all ATF test suites existing on the SOURCE environment
 * @param {*} config 
 *//*
CICD.prototype.getApplicationTestSuites = function (config) {
    return Promise.try(() => {

            //code to export all test suite information in a format of
            // [{ 
            //    className: 'className',
            //    sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            // }]
        return [];
    });
};
*/

/**
 * Get all ATF test cases existing on the SOURCE environment
 * @param {*} config 
 *//*
CICD.prototype.getApplicationTests = function (config) {
    return Promise.try(() => {
            //code to export all test information in a format of
            //[{
            //    className: 'className',
            //    sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            //}]
        return [];
    });
};
*/

CICD.prototype.convertBuildBody = function (body) {
    return Promise.try(() => {
        // console.log(body);
        var requestParam = assign({
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
        /*
            {
                "action": "${PULL_REQUEST_ACTION}",
                "comment": "${PULL_REQUEST_COMMENT_TEXT}",
                "request": {
                    "id": "${PULL_REQUEST_ID}",
                    "name": "${PULL_REQUEST_TITLE}",
                    "url": "${PULL_REQUEST_URL}"
                },
                "author": {
                    "name": "${PULL_REQUEST_USER_DISPLAY_NAME}"
                },
                "reviewers": ["${PULL_REQUEST_REVIEWERS}"],
                "source": {
                    "project": "${PULL_REQUEST_FROM_REPO_PROJECT_KEY}",
                    "repository": "${PULL_REQUEST_FROM_REPO_NAME}",
                    "branch": "${PULL_REQUEST_FROM_BRANCH}"
                },
                "target": {
                    "project": "${PULL_REQUEST_TO_REPO_PROJECT_KEY}",
                    "repository": "${PULL_REQUEST_TO_REPO_NAME}",
                    "branch": "${PULL_REQUEST_TO_BRANCH}"
                }
            }
        */
        const gitPayload = body;
        const pr = gitPayload.pull_request;

        return assign({
            action: undefined,
            comment: undefined,
            request: {
                id: undefined,
                name: undefined,
                url: undefined
            },
            author: {
                name: undefined
            },
            reviewers: [],
            source: {
                project: undefined,
                repository: undefined,
                branch: undefined
            },
            target: {
                project: undefined,
                repository: undefined,
                branch: undefined
            }
        }, {
            action: (gitPayload.action == 'closed' && pr.merged) ? 'merged' : (gitPayload.action == 'closed' && !pr.merged) ? 'declined' : gitPayload.action,
            source: {
                branch: pr.head.ref
            }, 
            target: {
                branch: pr.base.ref
            }
        });
    });
};

module.exports = CICD;