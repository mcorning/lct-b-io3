import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';
import socket from './socket';

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: socket,
    // options: options,
    autoConnect: false,
  })
);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
