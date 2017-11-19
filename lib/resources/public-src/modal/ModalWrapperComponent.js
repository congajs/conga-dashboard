import Vue from 'vue';

export default Vue.extend({

    template: `

        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head" v-if="hasHeader">
                    <p class="modal-card-title">{{ title }}</p>
                    <button class="delete" aria-label="close" v-if="hasCloseButton" v-on:click="close"></button>
                </header>
                <section class="modal-card-body">
                    <slot></slot>
                </section>
                <footer class="modal-card-foot" v-if="hasFooter">
                    <button class="button is-success" v-on:click="close">{{ actionButtonLabel }}</button>
                    <button class="button" v-if="hasCancelButton" v-on:click="close">{{ cancelButtonLabel }}</button>
                </footer>
            </div>
        </div>

    `,

    methods: {
        close: function() {
            this.$modal.close();
        }
    },

    props: {
        title: {
            default: 'MODAL TITLE',
            type: String
        },
        hasCloseButton: {
            default: true,
            type: Boolean
        },
        actionButtonLabel: {
            default: 'Ok',
            type: String
        },
        hasCancelButton: {
            default: true,
            type: Boolean
        },
        cancelButtonLabel: {
            default: 'Cancel',
            type: String
        },
        hasHeader: {
            default: true,
            type: Boolean
        },
        hasFooter: {
            default: true,
            type: Boolean
        }

    }

});
