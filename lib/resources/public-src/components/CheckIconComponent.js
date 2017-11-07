import Vue from 'vue';

export default Vue.extend({

    template: `

        <span class="icon is-small has-text-primary">
            <i v-bind:class="['fa', 'fa-check', {'has-text-success': value === true, 'has-text-light': value === false}]"></i>
        </span>

    `,

    props: {
        value: {
            default: false,
            type: Boolean
        }
    },


});
