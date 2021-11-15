import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../Main.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "About" */ "../views/Login.vue"),
  },
  {
    path: "/",
    name: "Main",
    component: Main,
    children: [
      {
        path: "restaurants",
        name: "restaurants",
        component: () =>
          import(/* webpackChunkName: "Home" */ "../views/restaurants.vue"),
      },
      {
        path: "restaurants/:id",
        name: "Restaurant By Id",
        component: () =>
          import(
            /* webpackChunkName: "Home" */ "../components/restaurant/view.vue"
          ),
      },
      {
        path: "Home",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
      },
      {
        path: "contact",
        name: "Contact",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
      },
      {
        path: "about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "About" */ "../views/About.vue"),
      },
      {
        path: "users",
        name: "Users",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "About" */ "../views/Users.vue"),
      },
      {
        path: "booking",
        name: "Booking",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "Booking" */ "../views/Bookings.vue"),
      },
      {
        path: "NotFound",
        name: "404",
        component: () =>
          import(/* webpackChunkName: "About" */ "../views/NotFound.vue"),
      },
    ],
  },

  {
    path: "*",
    redirect: { name: "404" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
