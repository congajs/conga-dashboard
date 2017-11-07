import Vue from 'vue';

export default Vue.extend({

    template: `

        <li v-bind:class="{ 'is-active': $route.name === route }">
            <router-link :to="{ name: route }">{{ label }}</router-link>
        </li>

    `,

    props: [
        'route',
        'label'
    ]

});
