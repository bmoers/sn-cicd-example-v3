/* 
 * Application : Global
 * ClassName   : sys_script_include
 * Created On  : 2018-05-01 04:04:57
 * Created By  : admin
 * Updated On  : 2018-05-01 04:39:38
 * Updated By  : admin
 * URL         : - /sys_script_include.do?sys_id=aade3aa5db311300533b5385ca9619cb
 */
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