import { createApp } from 'vue'
import App from './views/App.vue'
import router from './views/router/index.js'

const app = createApp(App)

app.use(router)

app.mount('#app')