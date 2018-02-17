import Vue from 'vue';
import Tooltip from 'vue-bulma-tooltip';

import '../styles/sidebar.css';

export default Vue.extend({

    template: `

        <div class="sidebar">

            <ul>

                <li>
                    <tooltip label="Dashboard" placement="right" :no-animate="true">
                        <router-link :to="{ name: 'conga.dashboard' }">
                            <span class="icon">
                                <img src="data:image/png;base64,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" alt="CongaJS" title="CongaJS Dashboard Home Page" align="center" class="conga hvr-pop"/>
                            </span>
                        </router-link>
                    </tooltip>
                </li>

                <li v-for="bundle in sidebarBundles()" :key="bundle.id">
                    <tooltip :label="bundle.name" placement="right" :no-animate="true">
                        <router-link :to="{ name: bundle.id }" v-bind:class="{ 'is-active': $route.name.startsWith(bundle.id) }">
                            <span class="icon">

                                <img
                                    v-bind:src="bundle.icon"
                                    align="center"
                                    class="hvr-pop"
                                    height="30"
                                    v-if="bundle.icon.startsWith('data:image')"
                                />

                                <i v-bind:class="['fa', 'fa-' + bundle.icon, 'hvr-pop' ]" v-else></i>
                            </span>
                        </router-link>
                    </tooltip>
                </li>

                <!--li>
                    <router-link :to="{ name: 'conga.dashboard' }" >
                        <span class="icon hvr-pop">
                            <i class="fa fa-wrench"></i>
                        </span>
                    </router-link>
                </li-->

            </ul>

        </div>

    `,

    props: [
        'bundles'
    ],

    data: function() {
        return {
            sidebarBundles: () => this.bundles.reduce((sidebar, bundle) => {
                // some dashboards don't have their own view
                if (bundle.icon) {
                    sidebar.push(bundle);
                }
                return sidebar;
            }, [])
        }
    }


});
