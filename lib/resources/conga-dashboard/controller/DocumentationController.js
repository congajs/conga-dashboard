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
     * @Route("/", methods=['GET'])
     */
    index(req, res) {

        const docs = [];

        this.container.getParameter('app.bundles').forEach(bundle => {

            const dir = path.join(this.container.get('bundle.finder').find(bundle), 'docs');

            // doing sync for now
            if (fs.existsSync(dir)) {
                docs.push({
                    id: bundle.replace(/\//g, '|'),
                    bundle: bundle,
                    dir: dir
                });
            }

        });

        res.return(docs);

    }

    /**
     * @Route("/:id", methods=['GET'])
     */
    get(req, res) {

        const id = req.params.id;
        const bundle = id.replace(/\|/g, '/');

        const articles = [];
        const dir = path.join(this.container.get('bundle.finder').find(bundle), 'docs');
        const version = require(path.join(this.container.get('bundle.finder').find(bundle), 'package.json')).version;
        fs.readdirSync(dir).filter((file) => {

            return file.substr(-3) == '.md';

        }).forEach((filename) => {

            const file = path.join(dir, filename);
            const content = fs.readFileSync(file, 'utf8');
            const info = fm(content);

            articles.push({
                file: filename,
                title: info.attributes.title,
                body: marked(info.body)
            });

        });

        res.return({
            id: id,
            bundle: bundle,
            version: version,
            articles: articles
        });
    }

    /**
     * @Route("/:id/:article", methods=['GET'])
     */
    article(req, res) {

        const bundle = req.params.id.replace(/\|/g, '/');
        const article = req.params.article;

        const file = path.join(this.container.get('bundle.finder').find(bundle), 'docs', article);
        const content = fs.readFileSync(file, 'utf8');
        const info = fm(content);

        const articles = [];
        const dir = path.join(this.container.get('bundle.finder').find(bundle), 'docs');

        const version = require(path.join(this.container.get('bundle.finder').find(bundle), 'package.json')).version;

        fs.readdirSync(dir).filter((file) => {

            return file.substr(-3) == '.md';

        }).forEach((filename) => {

            const file = path.join(dir, filename);
            const content = fs.readFileSync(file, 'utf8');
            const info = fm(content);

            articles.push({
                article: filename,
                title: info.attributes.title,
                //body: marked(info.body)
            });

        });

        let previous = null;
        let next = null;
        let index = articles.findIndex(element => {
            return element.article === article;
        });

        console.log(index);

        if (index > 0) {
            previous = articles[index - 1];
        }

        if (index < articles.length - 1) {
            next = articles[index + 1];
        }

        res.return({
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
        });
    }
}
