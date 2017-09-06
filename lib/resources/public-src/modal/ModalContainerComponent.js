import Vue from 'vue';

import '../styles/modal.css';

export default Vue.extend({

    template: `
        <p>THIS IS THE MODAL CONTAINER</p>
    `,

    created: function() {

        this.$modal.onOpen(() => {
            console.log('inside on open');
        });
    }
});
