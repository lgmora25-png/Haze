import { createApp } from 'vue'
import App from './views/App.vue'
import router from './views/router/Index.js'
// import router from './views/router'

const app = createApp(App)

app.use(router)

// Debug rápido: saber si localStorage está quedando con valores viejos
console.log('localStorage usuario_id inicial:', localStorage.getItem('usuario_id'))

app.mount('#app')
