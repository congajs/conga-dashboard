/*
 * This file is part of the conga-profiler module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// framework libs
const Controller = require('@conga/framework').Controller;

/**
 * @Route("/_conga")
 */
module.exports = class CongaController extends Controller {

    /**
     * @Route("/", name="conga.dashboard.default")
     */
    index(req, res) {

        const webpack = this.container.get('conga.webpack.registry');

        const template =
            `<!doctype html>
                <html>
                    <head>
                        <title>conga.js dashboard</title>
                        <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto:700" rel="stylesheet">
                        <link rel="stylesheet" href="${webpack.get('conga', 'css')}">
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

                        <script src="${webpack.get('conga', 'js')}"></script>
                    </body>
                </html>
            `;

        res.send(template);
    }
}
