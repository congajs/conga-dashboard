import Vue from 'vue';

import '../styles/documentation.css';

export default Vue.extend({

    template: `

        <div class="documentation-article">

            <hero>

                <span slot="hero-title">{{ article.title }}</span>
                <span slot="hero-subtitle"></span>

                <div class="container" slot="hero-foot"></div>

            </hero>

            <main-section>
                <div class="content" v-html="article.body"></div>
            </main-section>

            <hr>

            <div class="container">

                <router-link
                    class="pull-left"
                    :to="{ name: 'documentation.article', params: { id: bundle, article: pagination.previous.article }}"
                    v-if="pagination.previous !== null"
                >
                    << {{ pagination.previous.title }}
                </router-link>

                <router-link
                    class="pull-right"
                    :to="{ name: 'documentation.article', params: { id: bundle, article: pagination.next.article }}"
                    v-if="pagination.next !== null"
                >
                    {{ pagination.next.title }} >>
                </router-link>

            </div>

        </div>
    `,

    data: function() {
        return {
            bundle: null,
            article: {},
            pagination: {
                previous: null,
                next: null
            }
        }
    },

    created() {
        this.fetchData(this.$route.params.id, this.$route.params.article);
    },

    beforeRouteUpdate(to, from, next) {
        this.fetchData(to.params.id, to.params.article);
        next();
    },

    updated: function() {
        window.hljs.initHighlighting.called = false;
        window.hljs.initHighlighting();
    },

    methods: {
        fetchData: function(bundle, article) {
            this.$http.get('/_conga/api/documentation/' + bundle + '/' + article).then(response => {
                this.bundle = response.body.bundle;
                this.article = response.body.article;
                this.pagination = response.body.pagination;
            });

        }
    }


});
