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

            <div class="connection-warning" v-if="showConnectionWarning == true">

                <div class="connection-warning-body">
                    <p class="is-primary is-size-5">CONNECTION LOST!</h1>
                    <p>your application has either shut down or is in the process of restarting...</p>
                    <img src="http://clipart-library.com/images/kiKnky7qT.gif" width="100">
                </div>

            </div>

        </div>
    `,

    components: {
        'navbar-component': NavbarComponent,
        'sidebar-component': SidebarComponent
    },

    data: function() {
        return {
            bundles: BUNDLE_METAS,
            showConnectionWarning: false
        }
    },

    mounted: function() {

        setInterval(() => {

            this.$http.get('/_conga/ping').then((response) => {
                console.log(response);
                if (response.body.available) {
                    this.showConnectionWarning = false;
                } else {
                    this.showConnectionWarning = true;
                }
            });

        }, 2000);

    }

});
