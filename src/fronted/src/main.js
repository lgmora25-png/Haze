import { createApp } from 'vue'
import './style.css'
import App from './views/App.vue'
import router from './views/router'

const app = createApp(App)

app.use(router)
app.mount('#app')