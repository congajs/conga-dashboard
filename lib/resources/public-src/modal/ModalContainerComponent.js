import Vue from 'vue';

import '../styles/modal.css';

const EmptyComponent = Vue.extend({
    template: '<span></span>'
});

export default Vue.extend({

    template: `
        <component v-bind:is="currentView" v-bind="currentProps"></component>
    `,

    data: function() {
        return {
            currentView: EmptyComponent,
            currentProps: {}
        }
    },

    created: function() {

        this.$modal.onOpen((modal, props) => {
            this.currentView = modal;
            this.currentProps = props;
        });

        this.$modal.onClose(() => {
            this.currentView = EmptyComponent;
            this.currentProps = {};
        });
    }
});
