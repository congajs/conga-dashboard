import Vue from 'vue';

import NavbarComponent from './NavbarComponent';
import SidebarComponent from './SidebarComponent';

import '../styles/app.css';
import '../styles/table.css';

export default Vue.extend({


    template: `
        <div>

            <navbar-component></navbar-component>

            <sidebar-component v-bind:bundles="bundles"></sidebar-component>

            <div class="main-section" style="z-index: 0; margin-top: 0px; margin-left: 50px;">

                <router-view></router-view>

            </div>

            <modal-container></modal-container>

        </div>
    `,

    components: {
        'navbar-component': NavbarComponent,
        'sidebar-component': SidebarComponent
    },

    data: function() {
        return {
            bundles: BUNDLE_METAS
        }
    },
});
