import '@/scss/app.scss';

import { createApp } from 'vue';
import { Quasar, Notify } from 'quasar'; // Import Notify
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Import Pinia
import 'quasar/dist/quasar.css'; // Quasar styling
import '@/libraries/Chart.js';
import '@quasar/extras/material-icons/material-icons.css';
import 'animate.css';
import 'canvas-confetti';

createApp(App)
    .use(router)
    .use(createPinia())  // Initialize Pinia here
    .use(Quasar, {
        plugins: { Notify }, // Register the Notify plugin
    })
    .mount('#app');