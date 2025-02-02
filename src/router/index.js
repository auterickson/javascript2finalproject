import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import {auth} from '@/firebase/index.js'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/library',
            name: 'library',
            // lazy-loaded when the route is visited.
            component: () => import('../pages/Library.vue'),
        },
        {
            path: '/statistics',
            name: 'statistics',
            // lazy-loaded when the route is visited.
            component: () => import('../pages/statistics.vue'),
        },
        {
            path: '/favorites',
            name: 'favorites',
            // lazy-loaded when the route is visited.
            component: () => import('../pages/Favorites.vue'),
        },

        {
            path: '/profile',
            name: 'profile',
            props: true, // passes the userId from the URL to the component
            // lazy-loaded when the route is visited.
            component: () => import('../pages/Profile.vue'),
        },
        {
            path: '/login',
            name: 'login',
            // lazy-loaded when the route is visited.
            component: Login,
        },
        {
            path: '/signup',
            name: 'signup',
            // lazy-loaded when the route is visited.
            component: Signup,
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('../pages/NotFound.vue'),
        },
    ],

})
    router.beforeEach((to, from, next) => {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            const user = auth.currentUser;
            if (!user) {
                next({name: "signup"});
            } else {
                next();
            }
        } else {
            next();
        }
    })



export default router
