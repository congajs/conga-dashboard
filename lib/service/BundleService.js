// core libs
const fs = require('fs');
const path = require('path');

/**
 * Aggregate registered bundles with @conga dependencies and provide lookup
 */
class BundleService {

    /**
     *
     * @param {Container} container The service container
     */
    constructor(container) {
        this.container = container;
        this._bundles = null;
    }

    /**
     * Get the bundle finder service
     * @return {BundleFinder}
     */
    get finder() {
        return this.container.get('bundle.finder');
    }

    /**
     * Get all bundles
     * @returns {Promise}
     */
    bundles() {
        return new Promise((resolve, reject) => {
            if (this._bundles) {
                resolve(this._bundles);
                return;
            }

            // get all registered bundles
            const bundles = Object.create(this.finder.bundles);
            const bundlePaths = Object.values(bundles);

            // now iterate through the @conga namespace and add all bundles
            const root = path.join('node_modules', '@conga');

            fs.readdir(root, (err, paths) => {
                if (err) {
                    console.error(err.stack || err);
                    this._bundles = bundles;
                    resolve(bundles);
                    return;
                }
                const p = [];
                paths.forEach(dirName => {
                    p.push(new Promise((resolve, reject) => {
                        const bundlePath = path.resolve(path.join(root, dirName));
                        if (bundlePaths.indexOf(bundlePath) !== -1) {
                            return;
                        }
                        fs.stat(bundlePath, (err, stat) => {
                            if (err) {
                                console.error(err.stack || err);
                                return;
                            }
                            let json;
                            if (stat.isDirectory()) {
                                json = require(path.join(bundlePath, 'package.json'));
                                if (json && !(json.name in bundles)) {
                                    bundles[json.name] = bundlePath;
                                    bundlePaths.push(bundlePath);
                                }
                            }
                            resolve(json);
                        });
                    }));
                });
                Promise.all(p).then(packages => {
                    console.log('THE BUNDLES', bundles);
                    this._bundles = bundles;
                    resolve(bundles);
                });
            });
        });
    }

    /**
     * Find a bundle by its name (returns the path)
     * @param bundle
     * @returns {Promise.<TResult>}
     */
    find(bundle) {
        return this.bundles().then(bundles => {
            return bundles[bundle];
        });
    }

    /**
     * Iterate through all bundles and execute a function
     * @param {Function} fn Arguments are: bundle-name, bundle-path
     * @returns {Promise.<TResult>}
     */
    each(fn) {
        return this.bundles().then(bundles => {
            for (const bundle in bundles) {
                fn(bundle, bundles[bundle]);
            }
            return bundles;
        });
    }
}

module.exports = BundleService;