import { App } from 'vue';
import QTransfer from './main.vue';
export default {
	install: (app: App): void => {
		app.component('q-transfer', QTransfer);
	},
};
