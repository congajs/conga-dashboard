import Vue from 'vue';

const types = {
    primary: {
        icon: 'fa-lightbulb-o',
        color: 'primary'
    },
    warning: {
        icon: 'fa-exclamation-triangle',
        color: 'warning'
    },
    danger: {
        icon: 'fa-exclamation-circle',
        color: 'danger'
    },
    link: {
        icon: 'fa-share',
        color: 'link'
    },
    success: {
        icon: 'fa-check-square',
        color: 'success'
    },
    info: {
        icon: 'fa-comment',
        color: 'info'
    }
};

export default Vue.extend({

    template: `

        <article class="message" v-bind:class="'is-' + data.color">
            <div class="message-body" style="width: 100%; display: flex; align-items: top; display: inline-flex; ">

                <span class="icon is-medium" v-bind:class="'has-text-' + data.color" stye="">
                    <i class="fa fa-2x" v-bind:class="data.icon"></i>
                </span>

                <div style="padding-left: 1em;">
                    <slot></slot>
                </div>
            </div>

        </article>
    `,

    props: {
        type: {
            default: 'info',
            type: String
        }
    },

    data: function() {
        return {
            data: types[this.type]
        }
    },
});
