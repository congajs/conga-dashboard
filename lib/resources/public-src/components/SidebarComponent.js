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
                                <img src="/bundles/@conga/framework-dashboard/images/conga-icon.png" alt="CongaJS" title="CongaJS Dashboard Home Page" align="center" class="conga hvr-pop"/>
                            </span>
                        </router-link>
                    </tooltip>
                </li>

                <li v-for="bundle in bundles" :key="bundle.id">
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

                <li>
                    <router-link :to="{ name: 'conga.dashboard' }" >
                        <span class="icon hvr-pop">
                            <i class="fa fa-wrench"></i>
                        </span>
                    </router-link>
                </li>


            </ul>

        </div>

    `,

    props: [
        'bundles'
    ],

    data: function() {
        return {

        }
    }


});