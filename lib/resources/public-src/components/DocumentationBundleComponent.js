import Vue from 'vue';

export default Vue.extend({

    template: `

        <div>

            <hero>

                <span slot="hero-title">Documentation</span>
                <span slot="hero-subtitle">{{ doc.bundle }} - v{{ doc.version }}</span>

                <div class="container" slot="hero-foot">

                </div>

            </hero>

            <main-section>

                <div class="content">

                    <ol>
                        <li v-for="article in doc.articles">
                            <router-link :to="{ name: 'documentation.article', params: { id: doc.id, article: article.file }}">
                                {{ article.title }}
                            </router-link>
                        </li>
                    </ol>

                </div>

            </main-section>

        </div>
    `,

    data: function() {
        return {
            doc: {}
        }
    },

    components: {
        //'navbar-component': NavbarComponent
    },

    created: function() {
        this.loadBundle(this.$route.params.id);
    },

    beforeRouteUpdate: function(to, from, next) {
        this.loadBundle(to.params.id);
        next();
    },

    methods: {
        loadBundle: function(id) {
            this.$http.get('/_conga/api/documentation/' + id).then(response => {
                this.doc = response.body;
                //next();
            });
        }
    }


});
