import Vue from 'vue';

export default Vue.extend({

    template: `

        <article v-bind:class="['message', type]">

            <div class="message-header">
                <slot name="header"></slot>
            </div>

            <div class="message-body">
                <slot name="body"></slot>
            </div>

        </article>

    `,

    props: {
        type: {
            default: 'is-dark',
            type: String
        }
    }

});
