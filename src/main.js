import Vue from 'vue'
import App from './App.vue'

const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus;
    }
  }
});

var simon = new Vue({
  el: '#app',
  render: h => h(App)
});
