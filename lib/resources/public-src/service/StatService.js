export default class StatService {

    constructor($http) {
        this.$http = $http;
        this.interval = null;
    }

    start() {
        this.interval = setInterval(this.update.bind(this), 2000);
    }

    onUpdate(updateFunc) {
        this.updateFunc = updateFunc;
    }

    update() {

        this.$http.get('/_conga/api/dashboard/stats').then((response) => {
            this.updateFunc(response.body);
        });
    }

    stop() {
        clearInterval(this.interval);
    }
}
