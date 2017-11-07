import Vue from 'vue';

export default Vue.extend({

    template: `

        <div id="main" class="section">
            <div class="container">
                <slot></slot>
            </div>
        </div>

    `

});
