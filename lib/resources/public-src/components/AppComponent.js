import Vue from 'vue';

import NavbarComponent from './NavbarComponent';
import SidebarComponent from './SidebarComponent';

const AppComponent = Vue.extend({

    template: `
        <div>

            <navbar-component></navbar-component>

            <sidebar-component v-bind:bundles="bundles"></sidebar-component>

            <div class="main-section" style="margin-top: 0px; margin-left: 50px;">

                <router-view></router-view>

            </div>

            <!--modal-wrapper></modal-wrapper-->

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

export default AppComponent;
