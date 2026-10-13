import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins } from './entry'
import './assets/style/main.scss'

const app = createApp(App)

setupPlugins(app)
app.mount('#app')
