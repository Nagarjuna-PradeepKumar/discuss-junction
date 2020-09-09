import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    /**----------------------------------------
     *          Login and signup page
     * -----------------------------------------
     */
    path: "/",
    component: Home,
    meta: { title: "Login | DJ" },
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../components/homepage/login_component.vue"
          ),
        meta: { title: "Login | DJ" },
      },
      {
        path: "signup",
        name: "Signup",
        component: () =>
          import(
            /* webpackChunkName: "signup" */ "../components/homepage/signup_component_1.vue"
          ),
        meta: { title: "signup | DJ" },
      },
      {
        path: "activation",
        name: "Activation",
        component: () =>
          import(
            /* webpackChunkName: "activation" */ "../components/homepage/signup_component_2.vue"
          ),
        meta: { title: "Activation | DJ" },
      },
      {
        path: "resendactivation",
        name: "resendactivation",
        component: () =>
          import(
            /* webpackChunkName: "resendactivation" */ "../components/homepage/resendactivation_component.vue"
          ),
        meta: { title: "Resend activation | DJ" },
      },
      {
        path: "forgotpassword",
        name: "forgotpassword",
        component: () =>
          import(
            /* webpackChunkName: "forgotpassword" */ "../components/homepage/requestforgotpassword.vue"
          ),
        meta: { title: "Forgot password | DJ" },
      },
      {
        path: "setpassword",
        name: "setpassword",
        component: () =>
          import(
            /* webpackChunkName: "forgotpassword" */ "../components/homepage/setnewpassword.vue"
          ),
        meta: { title: "Set new password | DJ" },
      },
    ],
  },
  /**
   * -------------------------------------------------------
   *           MAIN PAGE- my profile,find,create,chat
   * -------------------------------------------------------
   */
  {
    path: "/profile",
    component: () =>
      import(/* webpackChunkName: "Profile" */ "../views/Profile.vue"),
    meta: { title: "Profile | HMS" },
    children: [
      // ---------------Landing 1st sub route------------------
      {
        path: "",
        name: "Me",
        component: () =>
          import(
            /* webpackChunkName: "mecomponent" */ "../modules/profile/me_component.vue"
          ),
        meta: { title: "My profile | DJ" },
      },
      // ---------------Find chamber 1st sub route------------------
      {
        path: "findchamber",
        name: "Trending",
        component: () =>
          import(
            /* webpackChunkName: "trendingchamber" */ "../modules/find_chamber/findchamber_component.vue"
          ),
        meta: { title: "Search | DJ" },
        children: [
          // -------------subroute of search chamber 2nd subroute
          {
            path: "",
            name: "suggestions",
            component: () =>
              import(
                /* webpackChunkName: "suggestions" */ "../components/search/suggestions.vue"
              ),
            meta: { title: "Suggestions | DJ" },
          },
          // -------------subroute of search chamber 2nd subroute
          {
            path: "trending",
            name: "trending_chamber",
            component: () =>
              import(
                /* webpackChunkName: "trending_chamber" */ "../components/search/trending_chamber.vue"
              ),
            meta: { title: "Trending | DJ" },
          },
          // -------------subroute of search chamber 2nd subroute
          {
            path: "interest",
            name: "chambers_by_interest",
            component: () =>
              import(
                /* webpackChunkName: "chambers_by_interest" */ "../components/search/chambers_by_interest.vue"
              ),
            meta: { title: "Trending | DJ" },
          },
          {
            path: "search",
            name: "Search_chambers",
            component: () =>
              import(
                /* webpackChunkName: "search_chamber" */ "../components/search/plain_search.vue"
              ),
            meta: { title: "Trending | DJ" },
          },
        ],
      },
      {
        path: "createchamber",
        name: "Createchamber",
        component: () =>
          import(
            /* webpackChunkName: "createchamber" */ "../modules/create_chamber/createchamber_component.vue"
          ),
        meta: { title: "Create chamber | DJ" },
      },
      {
        path: "chatchamber",
        name: "Chatchamber",
        component: () =>
          import(
            /* webpackChunkName: "chatchamber" */ "../modules/chat_chamber/chatchamber_component.vue"
          ),
        meta: { title: "Create chamber | DJ", keepAlive: true },
      },
      {
        path: "changepassword",
        name: "changepassword",
        component: () =>
          import(
            /* webpackChunkName: "changepassword" */ "../modules/change_password/change_password.vue"
          ),
        meta: { title: "Change password | DJ" },
      },
      {
        path: "deleteaccount",
        name: "deleteaccount",
        component: () =>
          import(
            /* webpackChunkName: "deleteaccount" */ "../modules/deleteaccount/deleteaccount.vue"
          ),
        meta: { title: "Change password | DJ" },
      },
    ],
  },
  /**
   * -------------------------------------------------------
   *                      LOGOUT PAGE
   * -------------------------------------------------------
   */
  {
    path: "/logout",
    name: "logout",
    component: () =>
      import(/* webpackChunkName: "logout" */ "../views/Logoutview.vue"),
    meta: { title: "Logout | HMS" },
  },
  /**
   * -------------------------------------------------------
   *                      DELETED PROFILE
   * -------------------------------------------------------
   */
  {
    path: "/missyou",
    name: "missyou",
    component: () =>
      import(/* webpackChunkName: "missyou" */ "../views/Bye.vue"),
    meta: { title: "missyou | DJ" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
