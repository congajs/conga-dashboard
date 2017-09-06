const fs = require('fs');
const path = require('path');

module.exports = class CongaDashboardManager {

    /**
     *
     * @param {Object}   event
     * @param {Function} next
     */
    onKernelCompile(event, next) {

        this.container = event.container;

        // make sure that the conga-validation validator exists
        if (!this.container.get('kernel').hasBundle('@conga/framework-webpack')) {
            throw new Error('@conga/framework-dashboard requires the @conga/framework-webpack bundle to be configured in your project');
        }

        const compiler = this.container.get('conga.controller.compiler');
        const controllers = this.findControllers(this.container);

        controllers.forEach((controller) => {
            compiler.compile(controller.bundle, controller.filePath);
        });

        next();
    }

    /**
     * Get an array of all the controller files that exist in the
     * registered bundles
     *
     * Returns:
     * [
     *     {
     *         filePath: /path/to/controller.js,
     *         bundle: bundle-name
     *     }
     * ]
     *
     * @param  {Container} container
     * @return {Array}
     */
    findControllers(container) {

        const bundles = container.getParameter('app.bundles');
        const controllers = [];

        bundles.push('@conga/framework');

        bundles.forEach((bundle) => {

            const dir = path.join(
                container.get('bundle.finder').find(bundle),
                'lib',
                'resources',
                'conga-dashboard',
                'controller'
            );

            if (!fs.existsSync(dir)) {
                return;
            }

            fs.readdirSync(dir).filter((file) => {

                // filter only js files
                return file.substr(-3) == '.js';

            }).forEach((filename) => {

                // create the full path to the controller
                const controllerPath = path.join(dir, filename);

                const controller = {
                    filePath: controllerPath,
                    bundle: bundle
                };

                // add path to result
                controllers.push(controller);
            });
        });

        return controllers;
    }
}
