import Chartist from 'chartist';
import Vue from 'vue';

import StatService from '../service/StatService';

import '../styles/dashboard.css';

export default Vue.extend({
    template: `

        <div>

            <hero>
                <span slot="hero-title">Conga.js Development Dashboard</span>
                <span slot="hero-subtitle">Let's do stuff!</span>
            </hero>

            <main-section>

                <div class="ct-chart" id="memory-chart">
                    <span class="title">Memory Usage</span>
                </div>

                <div class="ct-chart" id="cpu-chart">
                    <span class="title">CPU Usage</span>
                </div>

            </main-section>

        </div>
    `,

    methods: {
        openModal: function() {
            this.$modal.alert('alert title', 'this is an alert!');
        }
    },

    mounted: function() {

        var memoryDps = [];
        var cpuDps = [];
        var labels = [];

        var xVal = 0;
        var dataLength = 100;

        for (var x=0; x<dataLength; x++) {
            memoryDps.push(0);
            cpuDps.push({
                x: xVal,
                y: 0
            });
            labels.push(xVal);
            xVal++;
        }

        const memoryChart = new Chartist.Line('#memory-chart',
            {
                labels: labels,
                series: [memoryDps]},
            {
                height: 120,
                showPoint: false,
                high: 800,
                low: 0,
                axisY: {
                    onlyInteger: true,
                    offset: 30,
                    labelInterpolationFnc: function(value) {
                          return value + 'mb';
                    }
                },
                axisX: {
                    showLabel: false
                }
            }
        );

        var cpuChart = new Chartist.Line('#cpu-chart',
            {
                labels: labels,
                series: [cpuDps]},
            {
                height: 120,
                showPoint: false,
                high: 200,
                low: 0,
                axisY: {
                    onlyInteger: true,
                    offset: 30,
                    labelInterpolationFnc: function(value) {
                        return value + '%';
                    }
                },
                axisX: {
                    showLabel: false
                }
            }
        );

        this.statService = new StatService(this.$http);

        this.statService.onUpdate((data) => {

            const now = new Date();

            memoryDps.push(data.memory / 1048576);
            cpuDps.push(data.cpu);

            xVal++;

            if (memoryDps.length > dataLength)
            {
                memoryDps.shift();
                cpuDps.shift();
            }

            memoryChart.update();
            cpuChart.update();
        });

        this.statService.start();

    },

    beforeDestroy() {
        this.statService.stop();
    }
});
