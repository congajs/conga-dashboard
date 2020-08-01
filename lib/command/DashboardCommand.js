/*
 * This file is part of the conga-dashboard module.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');
const express = require('express');
const request = require('request');
const tcpp = require('tcp-ping');

const AbstractCommand = require('@conga/framework').command.AbstractCommand;

/**
 * This command will start up the conga dashboard app
 */
module.exports = class DashboardCommand extends AbstractCommand {

    /**
     * The command
     *
     * @return {String}
     */
    static get command() {
        return 'dashboard';
    }

    /**
     * The command description
     *
     * @return {String}
     */
    static get description() {
        return 'Start up the conga dashboard';
    }

    /**
     * Hash of command options
     *
     * @return {Object}
     */
    static get options() {
        return {
            //'bundle': ['-b, --bundle [value]', 'Load fixtures from a bundle']
        };
    }

    /**
     * Array of command argument names
     *
     * @return {Array<String>}
     */
    static get arguments() {
        return [];
    }

    /**
     * Execute the command
     *
     * @param  {CommandInput}  input   the command input data
     * @param  {CommandOutput} output  the output writer
     * @param  {Function}      next    the next callback
     * @return {void}
     */
    execute(input, output, next) {

        output.writeln('starting dashboard');

        // create the express app
        const app = express();

        const publicDir = path.join(
            this.container.getParameter('kernel.var_path'),
            'dashboard',
            'public'
        );

        const buildDir = path.join(
            publicDir,
            'build'
        );

        app.use(express.static(publicDir));

        const config = {
            'development': false,
            'force.build': true,
            'build.dir': buildDir,
            'build.public.path': '/build/',
            'factories': [
                { service: 'conga.dashboard.webpack.factory', method: 'factory' }
            ]
        };

        const frameworkConfig = this.container.get('config').get('framework');
        const frameworkApp = frameworkConfig.app;
        const appConfig = Object.assign({}, frameworkApp);
        const expressConfig = Object.assign({}, frameworkConfig.express);

        const isSsl = !!expressConfig.https;
        const protocol = isSsl ? 'https' : 'http';

        if (isSsl) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }

        const dashboardConfig = this.container.get('config').get('dashboard');

        if (dashboardConfig.port) {
            frameworkApp.port = this.container.get('config').get('dashboard').port;
        }

        config.contentBase = 'http://' + frameworkApp.host;
        if (frameworkApp.port != '80') {
            config.contentBase += ':' + frameworkApp.port;
        }
        config.contentBase += '/';

        this.container.get('conga.webpack.builder').build(config, () => {

            const assets = require(path.join(buildDir, 'webpack-assets.json'));

            app.get('/', (req, res) => res.send(
                `<!doctype html>
                    <html>
                        <head>
                            <title>conga.js dashboard</title>

                            <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto:700" rel="stylesheet">
                            <link rel="stylesheet" href="${assets.conga.css}">
                            <script src="https://use.fontawesome.com/46b586b2dd.js"></script>
                            <link rel="stylesheet"
                                  href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css">
                            <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
                            <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/yaml.min.js"></script>
                        </head>
                        <body>

                            <div id="app">
                                <app-component></app-component>
                            </div>

                            <script src="${assets.conga.js}"></script>
                        </body>
                    </html>
                `
            ));

            app.get('/_conga/ping', (req, res) => {
                tcpp.probe((appConfig.host || 'localhost'), appConfig.port, (err, available) => {
                    res.json({
                        available: available
                    });
                });
            });

            app.all('/_conga/*', (req, res) => {

                try {

                    const url = protocol + '://' + (appConfig.host || 'localhost:' + appConfig.port) + req.path;

                    const x = request(url);

                    req.pipe(x).on('error', () => {
                        res.status(504).send(null);
                    });

                    x.pipe(res).on('error', () => {
                        console.log('got response error');
                    });

                } catch (e) {

                    res.json({}, 504);
                }

            });

            // create http server
            const server = require('http').createServer(app);

            server.listen(dashboardConfig.port);
            output.writeln('dashboard running on port ' + dashboardConfig.port);

        });

    }

}
