import Vue from 'vue';

export default Vue.extend({

    template: `

        <div class="tabs is-boxed">
            <ul>
                <slot></slot>
            </ul>
        </div>
    `

});
