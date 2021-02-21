import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';
import socket from './socket';
import store from './store';
import './registerServiceWorker';
import SoteriaIcon from './components/svg/safeInSistersLogo.vue';
import VueLuxon from 'vue-luxon';
Vue.use(VueLuxon);

Vue.component('soteria-icon', SoteriaIcon);

Vue.config.productionTip = false;

// use a destructured Visitor after adding vuex-orm-localforage
const visitor = '',
  id = '',
  nsp = '';
const options = {
  auth: { visitor: visitor, id: id, nsp: nsp },
};
Vue.use(
  new VueSocketIO({
    debug: false,
    connection: socket,
    options: options,
    autoConnect: false,
  })
);

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
