import Vue from 'vue';

import '../styles/documentation.css';

export default Vue.extend({

    template: `

        <div class="documentation-article">

            <hero>

                <span slot="hero-title">{{ article.title }}</span>
                <span slot="hero-subtitle">
                    <router-link :to="{name: 'documentation.bundle', params: { id: bundle }}">
                        {{ bundleName }} - v{{ bundleVersion }}
                    </router-link>
                </span>

                <div class="container" slot="hero-foot"></div>

            </hero>

            <main-section>
                <div class="content" v-html="article.body"></div>
            </main-section>

            <hr>

            <div class="container">

                <div class="columns">

                    <div class="column">

                        <router-link
                            class="pull-left"
                            :to="{ name: 'documentation.article', params: { id: bundle, article: pagination.previous.article }}"
                            v-if="pagination.previous !== null"
                        >
                            &laquo; {{ pagination.previous.title }}
                        </router-link>

                    </div>

                    <div class="column is-half" style="text-align: center">
                        <router-link :to="{name: 'documentation.bundle', params: { id: bundle }}">
                            Index
                        </router-link>
                    </div>

                    <div class="column">

                        <router-link
                            class="pull-right"
                            :to="{ name: 'documentation.article', params: { id: bundle, article: pagination.next.article }}"
                            v-if="pagination.next !== null"
                        >
                            {{ pagination.next.title }} &raquo;
                        </router-link>

                    </div>

                </div>

            </div>

        </div>
    `,

    data: function() {
        return {
            bundle: null,
            bundleName: null,
            bundleVersion: null,
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
                this.bundleName = response.body.bundleName;
                this.bundleVersion = response.body.bundleVersion;
                this.article = response.body.article;
                this.pagination = response.body.pagination;
            });

        }
    }


});
