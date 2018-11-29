# Example implementation of the CICD Server V3 for ServiceNow

## Table of contents

- [Features](#features)
- [How to start](#how-to-start)
- [Start the CICD-Server](#start-the-cicd-server)
- [Basic Example](#basic-example)
- [Configure ServiceNow to 'build' and Update-Set](#Configure-ServiceNow-to-'build'-an-Update-Set)
- [Prerequisites](#prerequisites)
- [Contribute](#contribute)
- [Dependencies](#dependencies)

## Features

This is an example implementation of the [CICD Server](https://github.com/bmoers/sn-cicd) for [ServiceNow](https://www.servicenow.com/). It allows to send changes captured in Update-Sets in ServiceNow to a CICD pipeline including running ATF test cases in ServiceNow.\
Example build results:
- [Code extraction](https://github.com/bmoers/sn-cicd-example-v3/tree/master/example/repo)
- [ESLint report](http://htmlpreview.github.io/?https://github.com/bmoers/sn-cicd-example-v3/blob/master/example/doc/lint/index.html)
- [JsDoc documentation](http://htmlpreview.github.io/?https://github.com/bmoers/sn-cicd-example-v3/blob/master/example/doc/docs/global.module_sys_script_include.CicdDemo.html)

More information about the core module can be found here https://github.com/bmoers/sn-cicd#cicd-server-for-service-now-v3

A video recording from the K18 session, where CICD Server version 1 was presented, can be found [here](https://youtu.be/8v6zc2Qgjm4).

## How to start

Install the Scoped App:
- Clone the [CICD-Integration](https://github.com/bmoers/sn-cicd-integration) repo and, if required, run `gulp namespace --name your-name-space` to change the namespace (your company ServiceNow prefix)
- Install the update-set from ./update_set/CICD Integration.xml in your ServiceNow instance.
- Create a CI-User account in ServiceNow and assign it to the `cicd_integration_user` group
-  Optionally create a 
    - ATF-User account in ServiceNow and assign it to the `atf_test_*` and `impersonator` groups
    - CD-User account in ServiceNow and assign it to the `admin` **!** group

Get a copy of this repo:

```bash
git clone git@github.com:bmoers/sn-cicd-example-v3.git

cd sn-cicd-example-v3
```

Configure the CICD Server
- Rename `example.env` to `.env` - default variables should work for now.
- Set credentials for CI user\
    CICD_CI_USER_NAME='CI-USER-NAME'\
    CICD_CI_USER_PASSWORD='********'
- Optionally set the credentials for
    - CI-User\
        CICD_ATF_TEST_USER_NAME='ATF-USER-NAME'\
        CICD_ATF_TEST_USER_PASSWORD='********'
    - CD-User\
        CICD_CD_USER_NAME='CD-USER-NAME'\
        CICD_CD_USER_PASSWORD='********'

Install and configure GIT client:
- GIT client is installed and configured (id_rsa.pub) to connect to your GIT repo service.

## Start the CICD-Server

In sn-cicd-example-v3 run:

```bash
npm install
```

and:

```bash
npm start
```

The web-UI is available under http://localhost:8080/ (depending of your server-options settings).\
If HTTPS is enabled you might see a "page not secure" warning. This is due to self signed certificates in this example project.\
It requires a run at least one build to display any information.

## Basic Example

### Trigger a CICD Run

- Logon to a ServiceNow instance. E.g. personal developer instance on https://developer.servicenow.com/
- Do setup as described above.
- Make sure the settings in `.env` are correct and the CICD-Server is started.
- In left navigation, search for 'CICD Integration'. Open 'properties' and make sure that:
    - 'CICD Integration switch' is checked
    - 'The CICD Server Run API URL' is set to your workplace/server IP/host address, e.g. 'http[s]://192.168.1.10/run'
    - 'Connect to CICD Server via MID Serve' is checked
- Create an Update-Set. Make it your current update-set, keep a copy of the sys_id.
- Create e.g. a script_include including JsDoc tags to be sent to the CICD pipeline.
    ```js
    /**
     * Class Description
     * 
     * @class 
     * @author Boris Moers
     * @memberof global.module:sys_script_include
     */
    var CicdDemo = Class.create();
    CicdDemo.prototype = /** @lends global.module:sys_script_include.CicdDemo.prototype */ {
        /**
         * Constructor
         * 
         * @returns {undefined}
         */
        initialize: function () { 
            
        },

        /**
         * A test function
         * 
         * @param {any} string the string to test
         * @returns {boolean} a true boolean
         */
        test: function (string) {

            return true;
        },
        type: 'CicdDemo'
    };
    ```

- In a ServiceNow background script run 
    ```js
    var run = new CiCdRun();
    run.now({
        "requestor": {
            "userName": "UserName",
            "fullName": "User Full Name",
            "email": "user@email.com"
        },
        "updateSet": "<the update-set sys_id>",
        "application": {
            "id": "<the scope sys_id>",
            "name": "Application Name"
        },
        "git": {
            "repository": "<repo_name>"
        },
        "source": {
            "name": "https://source.service-now.com"
        },
        "master": {
            "name": "https://target.service-now.com"
        }
    })
    ```
- Make sure the request was successfully sent to your CICD instance.
- Navigate to http://localhost:8080 and check the progress.

## Configure ServiceNow to 'build' an Update-Set

Add a business rule to send a REST message to your CICD-server.\
Post a payload like below with `new CiCdRun().now(payload);` to the CICD Server.

```js
{
    "updateSet": null,         // the sys_id of the update set to be extracted
    "application": {
        "id": null,            // either the sys_id of an application (scope) or the id of a container grouping files
        "name": null           // the name of the application / container
    },
    "requestor": {
        "userName": null,      // the person requesting the CICD pipeline to run [default user.getName()]
        "fullName": null,      // full name of that person [default user.getFullName()]
        "email": null          // email of same [default user.getEmail()]
    },
    "atf": {
        "updateSetOnly": false // [optional] set to true if only ATF test IN the update-set shall be executed. if false it runs all test of the application.
    },
    "git": {
        "repository": null,    // git repo. e.g. 'sn-cicd.git'
        "remoteUrl": null,     // [optional] repo full url with out git repo appended. e.g. 'ssh://git@github.com/project/repo.git'
        "url": null            // [optional] repo full url with out git repo appended. e.g. 'https://github.com/project/repo'
    },
    "source": {
        "name": null           // the source system of the update set e.g. https://companydev.service-now.com [default gs.getProperty('glide.servlet.uri')]
    },
    "master": {
        "name": null           // the master system of the update set. this must be production-like e.g. https://companypreprod.service-now.com
    },
    "target": {
        "name": null           // the target system to deploy the update set e.g. https://companytest.service-now.com
    }
}
```

- If you dont want to pull from production, remove the "master" option in the json. 
- If you dont want to automatically deploy, remove the "target" option in the json.


## Prerequisites

1) Write a business rule to trigger the CICD pipeline from ServiceNow
    - e.g. replace the "complete" value from the Update-Set screen with "Build"
2) If you're using the GIT feature:
    - make sure the current user has GIT correctly configured and can access the repo (SSH key)
    - implement the functions `createRemoteRepo()`, `pendingPullRequest()` and `raisePullRequest()`

## Contribute

If you want to contribute to this project, please fork the core project https://github.com/bmoers/sn-cicd 

## Project dependencies
The project is designed to use extensions. The core project [(bmoers/sn-cicd)](https://github.com/bmoers/sn-cicd) contains all 'shared' features. Customization which are dedicated to your ServiceNow environment or CICD pipeline shall be added to the 'extending' project (like this one.)

### Dependencies

https://github.com/bmoers/sn-cicd-example-v3 \
--> extends  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://github.com/bmoers/sn-cicd \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--> uses  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://github.com/bmoers/sn-project \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://github.com/bmoers/sn-rest-client
