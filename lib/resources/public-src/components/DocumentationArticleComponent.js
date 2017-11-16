import Vue from 'vue';

import '../styles/documentation.css';

export default Vue.extend({

    template: `

        <div>

            <hero-component>

                <span slot="hero-title">{{ article.title }}</span>
                <span slot="hero-subtitle">{{ bundle }} - v{{ version }}</span>

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

                    <div class="content" v-html="article.body"></div>

                </div>
            </div>

        </div>
    `,

    data: function() {
        return {
            article: {}
        }
    },

    created: function() {

        this.$http.get('/_conga/api/documentation/' + this.$route.params.id + '/' + this.$route.params.article).then(response => {
            this.article = response.body;
        });

    },

    updated: function() {
        window.hljs.initHighlighting.called = false;
        window.hljs.initHighlighting();
    }
});
