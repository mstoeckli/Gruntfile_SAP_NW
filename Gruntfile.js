/** @desc Pre-requisites 
 *        Node.js / NPM -> https://nodejs.org/en/ 
 *        ADT (AABAP Development Tools) enabled and accesible
 *        Activate ADT: Transaction SICF with path "default_host/sap/opu/odata/sap/adt_srv 
 *                      If it's greyed out you simply need to right-click and select 'Activate Service'. */

"use strict";
module.exports = (grunt) => {
    let sUser = grunt.option("user");
    let sPassword = grunt.option("pwd");

    grunt.initConfig({
        /** @desc Get the information in package.json for loading the dependencies after */
        pkg: grunt.file.readJSON("package.json"),
        /** @desc The goal of this npm project is to uglify the source code, similar to "uglify-js" */
        openui5_preload: {
            component: {
                /** @desc Resources/files that should be used as source for preload files */
                options: {
                    /** @desc Resources/files that should be used as source for preload files */
                    resources: {
                        /** @desc Root directory for finding resources */
                        cwd: "WebContent",
                        /** @desc Directory namespace prefix that should be prepended to all found paths */
                        prefix: "mspTransport",
                        /** @desc Glob pattern(s) for finding relevant resources inside "cwd" */
                        src: [
                            "**/*.js",
                            "**/*.view.xml",
                            "manifest.json",
                            "**/*.properties",
                            "!**/Component-preload.js"
                        ]
                    },
                    /** @desc Optional parameter to set compression/minification of the files - Used for productive upload */
                    compress: true,
                    /** @desc Path to the dest folder in which the preload files should be created
                     *        Example: Component-preload.js / Library-preload.js */
                    dest: "WebContent"
                },
                /** @desc Enable auto detection of Components. A preload file will be created for each "Component.js" */
                components: true
            }
        },
        /** @desc This module allows a developer to upload SAPUI5 sources into a SAP NetWeaver ABAP system.
         *        The behavior is (or should be) the same than it is known from the SAP Web IDE app deployment option "Deploy to SAPUI5 ABAP Repository"
         *        or from the "SAPUI5 ABAP Repository Team Provider" available for Eclipse via the "UI Development Toolkit for HTML5"
         *        -> Plugin is tested with NW 7.30, NW 7.40 and NW 7.50 !!! */
        nwabap_ui5uploader: {
            options: {
                conn: {
                    /** @desc SAP host -> Transaction SMICM - ICM Monitor */
                    server: "http://<sap_server>:<sap_port>"
                },
                auth: {
                    /** @desc SAP user/password */
                    user: sUser,
                    pwd: sPassword
                }
            },
            upload_webapp: {
                options: {
                    ui5: {
                        package: "$TMP",
                        language: "EN",
                        bspcontainer: "ZMY_APP",
                        bspcontainer_text: "My application",
                        /** @desc Only needed if you upload to a package exkl. $TMP */
                        transportno: "",
                        /** @desc Re-calculate index -> Executes transaction "/UI5/APP_INDEX_CALCULATE" in background */
                        calc_appindex: true
                    },
                    resources: {
                        cwd: "WebContent",
                        src: [
                            /** @desc All files */
                            "**/*.*"
                        ]
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

    /** @desc Execution for test run => grunt dev ...
     *        Value "dev" can be named differently for example "dev-blub" or "test_run" */
    grunt.registerTask("dev", [
        /** @desc Define the module(s) which should be executed after task is started */
       "nwabap_ui5uploader"
    ]);

    /** @desc Execution for productive run => grund prod ... */
    grunt.registerTask("prod", [
        /** @desc uglify source code */
        "openui5_preload",
        "nwabap_ui5uploader"
    ]);
}
