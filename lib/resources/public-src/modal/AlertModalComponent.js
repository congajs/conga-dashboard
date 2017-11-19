import Vue from 'vue';

export default Vue.extend({

    template: `

        <modal-wrapper
            :title="title"
            :has-cancel-button="false"
            :has-close-button="false"
            action-button-label="I Got It"
        >
            <div>{{ message }}</div>
        </modal-wrapper>

    `,

    props: ['message', 'title'],
});
