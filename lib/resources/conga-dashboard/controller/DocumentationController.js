const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const marked = require('marked');

const Controller = require('@conga/framework').Controller;

/**
 * @Route("/_conga/api/documentation")
 */
module.exports = class DashboardController extends Controller {

    /**
     * Get the dashboard bundle finder service
     * @return {BundleService}
     */
    get finder() {
        return this.container.get('conga.dashboard.bundle.finder');
    }

    /**
     * @Route("/", methods=['GET'])
     */
    index(req, res) {
        const docs = [];

        const p = [];

        return this.finder.each((bundle, bundlePath) => {

            const dir = path.join(bundlePath, 'docs');

            p.push(new Promise((resolve, reject) => {
                fs.stat(dir, (err, stat) => {
                    if (!err && stat.isDirectory()) {
                        docs.push({
                            id: bundle.replace(/\//g, '|'),
                            bundle: bundle,
                            dir: dir
                        });
                    }
                    resolve();
                });
            }));

        }).then(() => Promise.all(p).then(() => docs));
    }

    /**
     * @Route("/:id", methods=['GET'])
     */
    get(req, res) {

        const id = req.params.id;
        const bundle = id.replace(/\|/g, '/');

        return this.finder.find(bundle).then(bundlePath => {

            const articles = [];
            const dir = path.join(bundlePath, 'docs');
            const version = require(path.join(bundlePath, 'package.json')).version;

            fs.readdirSync(dir)
                .filter(file => file.substr(-3) === '.md')
                .forEach(filename => {

                    const file = path.join(dir, filename);
                    const content = fs.readFileSync(file, 'utf8');
                    const info = fm(content);

                    articles.push({
                        file: filename,
                        title: info.attributes.title,
                        body: marked(info.body)
                    });

                });

            return {
                id: id,
                bundle: bundle,
                version: version,
                articles: articles
            };
        });
    }

    /**
     * @Route("/:id/:article", methods=['GET'])
     */
    article(req, res) {

        const bundle = req.params.id.replace(/\|/g, '/');
        const article = req.params.article;

        return this.finder.find(bundle).then(bundlePath => {

            const file = path.join(bundlePath, 'docs', article);
            const content = fs.readFileSync(file, 'utf8');
            const info = fm(content);

            const articles = [];
            const dir = path.join(bundlePath, 'docs');

            const version = require(path.join(bundlePath, 'package.json')).version;

            fs.readdirSync(dir)
                .filter(file => file.substr(-3) === '.md')
                .forEach((filename) => {

                    const file = path.join(dir, filename);
                    const content = fs.readFileSync(file, 'utf8');
                    const info = fm(content);

                    articles.push({
                        article: filename,
                        title: info.attributes.title,
                        //body: marked(info.body)
                    });

                });

            let next = null;
            let previous = null;
            let index = articles.findIndex(element => element.article === article);

            console.log(index);

            if (index > 0) {
                previous = articles[index - 1];
            }

            if (index < articles.length - 1) {
                next = articles[index + 1];
            }

            return {
                bundle: req.params.id,
                bundleName: bundle,
                bundleVersion: version,
                article: {
                    title: info.attributes.title,
                    body: marked(info.body)
                },
                pagination: {
                    previous: previous,
                    next: next
                }
            };
        });
    }
}
