import Tooltip from 'vue-bulma-tooltip';
import Vue from 'vue';

export default Vue.extend({

    template: `

        <tooltip v-bind:label="label" placement="top-right">
            <span class="icon is-small has-text-primary">
                <i class="fa fa-question-circle is-primary"></i>
            </span>
        </tooltip>

    `,

    props: {
        label: {
            default: '',
            type: String
        },
        placement: {
            default: 'top',
            type: String
        }
    },

    components: {
        tooltip: Tooltip
    }

});
