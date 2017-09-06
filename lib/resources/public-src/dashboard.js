import 'bulma';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import AppComponent from './components/AppComponent';
import DashboardComponent from './components/DashboardComponent';
import DocumentationComponent from './components/DocumentationComponent';
import DocumentationListComponent from './components/DocumentationListComponent';
import DocumentationBundleComponent from './components/DocumentationBundleComponent';
import DocumentationArticleComponent from './components/DocumentationArticleComponent';
import HeroComponent from './components/HeroComponent';
import ModalPlugin from './modal/ModalPlugin';

Vue.use(require('vue-moment'));
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(ModalPlugin);

Vue.component('hero-component', HeroComponent);

// set up local routes
let routes = [
    { path: '/dashboard', component: DashboardComponent, name: 'conga.dashboard' },
    {
        path: '/documentation',
        component: DocumentationComponent,
        children: [
            {
                path: "",
                name: "documentation",
                component: DocumentationListComponent
            },
            {
                path: ":id",
                name: "documentation.bundle",
                component: DocumentationBundleComponent
            },
            {
                path: ":id/:article",
                name: "documentation.article",
                component: DocumentationArticleComponent
            }
        ]
    }
];

// set up routes from bundles
BUNDLE_METAS.forEach((bundle) => {
    const bundleRoutes = require('bundles/' + bundle.id + '/Routes.js');
    routes = routes.concat(bundleRoutes.default);
});

// route unknowns to main dashboard page
routes.push({ path: '*', redirect: '/dashboard' });

const router = new VueRouter({
    routes: routes
});

new Vue({
    el: '#app',
    router: router,
    data: function() {
        return {
            bundles: BUNDLE_METAS
        }
    },
    components: {
        'app-component': AppComponent
    }
});
