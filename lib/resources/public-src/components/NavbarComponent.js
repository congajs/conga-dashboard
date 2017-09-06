import Vue from 'vue';

import '../styles/navbar.css';

export default Vue.extend({

    template: `

        <nav class="navbar top-nav is-transparent">

            <!--div class="navbar-brand">
                <img src="/bundles/@conga/framework-dashboard/images/conga-icon.png" alt="CongaJS" title="CongaJS Dashboard Home Page" width="24px" height="34px" style="margin-left: 8px; margin-top: 8px;"/>
            </div-->


            <div class="navbar-menu">
                <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            <i class="fa fa-book"></i>&nbsp;Documentation
                        </a>

                        <div class="navbar-dropdown is-right">
                            <router-link class="navbar-item" :to="{ name: 'documentation.bundle', params: { id: doc.id }}" v-for="doc in docs" :key="doc.id">
                                {{ doc.bundle }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

        </nav>


    `,

    data: function() {
        return {
            docs: []
        }
    },

    created: function() {

        this.$http.get('/_conga/api/documentation').then(response => {
            this.docs = response.body;
        });
    }


});
