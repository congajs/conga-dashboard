import Vue from 'vue';

import '../styles/hero.css';

export default Vue.extend({

    template: `

        <section id="hero" v-bind:class="['hero', type ]">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <slot name="hero-title"></slot>
                    </h1>
                    <h2 class="subtitle">
                        <slot name="hero-subtitle"></slot>
                    </h2>
                </div>
            </div>

            <div class="hero-foot">
                <slot name="hero-foot"></slot>
            </div>

        </section>

    `,

    props: {
        type: {
            default: 'is-primary',
            type: String
        }
    }

});
