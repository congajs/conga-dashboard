import Modal from './Modal';

import ModalContainerComponent from './ModalContainerComponent';
import ModalWrapperComponent from './ModalWrapperComponent';

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Vue.prototype.$modal = new Modal(Vue);

    Vue.component('modal-container', ModalContainerComponent);
    Vue.component('modal-wrapper', ModalWrapperComponent);
}

export default plugin;
