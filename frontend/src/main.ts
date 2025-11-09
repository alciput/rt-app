import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/tailwind.css'
import { useAuth } from './services/auth'

// Initialize auth
useAuth()

createApp(App).use(router).mount('#app')
