export default class Modal {

    constructor(Vue) {
        this.Vue = Vue;
        this.listener = null;
    }

    alert(message) {
        console.log('alert: ' + message);

        this.listener();
    }

    confirm() {

    }

    component() {

    }

    onOpen(cb) {
        this.listener = cb;
    }
}
