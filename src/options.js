import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './components/Popup.vue'

Vue.use(ElementUI);

new Vue({
    el: '#app',
    render: h => h(App)
});