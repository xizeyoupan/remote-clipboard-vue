import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Board from '../components/Board.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/board', component: Board }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  if (to.path === '/login') {
    if (token) {
      next('/board');
    }
    next();

  } else if (to.path === '/board') {
    if (!token) {
      next('/login');
    } else {
      next();
    }
  }
})

export default router
