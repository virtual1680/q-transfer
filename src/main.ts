import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import QTransfer from './lib/index';
import QvUi from 'qv-vue';
import 'qv-vue/theme-chalk/index.css';
// import QTransfer from '../dist/q-transfer.es.js'
// import '../dist/index.css';
createApp(App).use(ElementPlus).use(QTransfer).use(QvUi).mount('#app');
