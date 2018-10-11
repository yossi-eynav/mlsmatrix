import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './components/App.vue'

Vue.use(ElementUI);
Vue.config.devtools = true;

const elm = document.createElement('div');
elm.id = 'app';

document.body.appendChild(elm);

new Vue({
    el: '#app',
    render: h => h(App)
});