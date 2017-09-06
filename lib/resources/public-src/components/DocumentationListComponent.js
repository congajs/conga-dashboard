import Vue from 'vue';

export default Vue.extend({
    template: `

        <div>

            <ul>
                <li v-for="doc in docs">
                    <router-link :to="{ name: 'documentation.bundle', params: { id: doc.id }}">
                        {{ doc.bundle }} - {{ doc.version }}
                    </router-link>
                </li>
            </ul>

        </div>
    `,

    data: function() {
        return {
            docs: []
        }
    },

    components: {
        //'navbar-component': NavbarComponent
    },

    created: function() {

        this.$http.get('/_conga/api/documentation').then(response => {
            this.docs = response.body;
        });
    }
});
