import AlertModalComponent from './AlertModalComponent';

export default class Modal {

    constructor(Vue) {
        this.Vue = Vue;
        this.listener = null;

    }

    alert(title, message) {

        document.body.classList.add("modal-open");

        this.listener(AlertModalComponent, {
            message: message,
            title: title
        });
    }

    confirm() {

    }

    component() {

    }

    close() {
        document.body.classList.remove("modal-open");
        this.closeListener();
    }

    onOpen(cb) {
        this.listener = cb;
    }

    onClose(cb) {
        this.closeListener = cb;
    }


}
