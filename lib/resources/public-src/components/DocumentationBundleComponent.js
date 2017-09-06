import Vue from 'vue';

export default Vue.extend({

    template: `

        <div>

            <hero-component>

                <span slot="hero-title">Documentation</span>
                <span slot="hero-subtitle">{{ doc.bundle }} - v{{ doc.version }}</span>

                <div class="container" slot="hero-foot">

                    <!--div class="tabs is-boxed">
                        <ul>
                            <li v-bind:class="{ 'is-active': $route.name === 'bass' }">
                                <router-link :to="{ name: 'bass' }">Managers</router-link>
                            </li>
                            <li v-bind:class="{ 'is-active': $route.name === 'bass.connections' }">
                                <router-link :to="{ name: 'bass.connections' }">Connections</router-link>
                            </li>
                            <li><a>Adapters</a></li>
                            <li><a>Relationship Graph</a></li>
                        </ul>
                    </div-->

                </div>

            </hero-component>

            <div class="section">
                <div class="container">

                    <div class="content">

                        <ol>
                            <li v-for="article in doc.articles">
                                <router-link :to="{ name: 'documentation.article', params: { id: doc.id, article: article.file }}">
                                    {{ article.title }}
                                </router-link>
                            </li>
                        </ol>


                    </div>

                </div>
            </div>

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
