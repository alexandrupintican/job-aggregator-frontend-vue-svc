import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins } from './entry'
import './assets/style/global.scss'

const app = createApp(App)

setupPlugins(app)
app.mount('#app')
