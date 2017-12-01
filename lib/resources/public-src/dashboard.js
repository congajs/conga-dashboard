import 'bulma';


import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Tooltip from 'vue-bulma-tooltip';

import AppComponent from './components/AppComponent';
import BoxComponent from './components/BoxComponent';
import CheckIconComponent from './components/CheckIconComponent';
import DashboardComponent from './components/DashboardComponent';
import DocumentationComponent from './components/DocumentationComponent';
import DocumentationListComponent from './components/DocumentationListComponent';
import DocumentationBundleComponent from './components/DocumentationBundleComponent';
import DocumentationArticleComponent from './components/DocumentationArticleComponent';
import HeroComponent from './components/HeroComponent';
import InfoBlockComponent from './components/InfoBlockComponent';
import InfoTipComponent from './components/InfoTipComponent';
import MainSectionComponent from './components/MainSectionComponent';
import ModalPlugin from './modal/ModalPlugin';
import TabContainerComponent from './components/TabContainerComponent';
import TabComponent from './components/TabComponent';


Vue.use(require('vue-moment'));
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(ModalPlugin);

Vue.component('box', BoxComponent);
Vue.component('hero', HeroComponent);
Vue.component('main-section', MainSectionComponent);
Vue.component('tab', TabComponent);
Vue.component('tab-container', TabContainerComponent);
Vue.component('tooltip', Tooltip);
Vue.component('info-block', InfoBlockComponent);
Vue.component('info-tip', InfoTipComponent);
Vue.component('check-icon', CheckIconComponent);

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
    },
    filters: {
        json: function(value) {
            return JSON.stringify(JSON.parse(value), null, 2);
        }
    }
});



let isStuck = false;

window.addEventListener('scroll', (e) => {

    const main = document.getElementById('main');
    const hero = document.getElementById('hero');
    const heroHeight = hero.offsetHeight;
    const point = heroHeight - 50;

    if (!isStuck && document.body.scrollTop >= point) {

        isStuck = true;

        hero.classList.add('sticky');
        hero.style.top = (0 - heroHeight + 50) + 'px';
        main.style.marginTop = heroHeight + 'px';

    } else if (isStuck && document.body.scrollTop <= point){

        isStuck = false;

        hero.classList.remove('sticky');
        hero.style.top = 0;
        main.style.marginTop = '0px';
    }
});
