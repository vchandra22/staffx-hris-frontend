import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "@/state/pinia";
import routes from "./routes";
import appConfig from "../app.config.json";

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: "history",
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// Before each route evaluates...
router.beforeEach((routeTo, routeFrom, next) => {
  const auth = useAuthStore();

  // Check if auth is required on this route
  // (including nested routes).
  const authRequired = routeTo.matched.some(
    (route) => route.meta.authRequired
  );

  // If auth isn't required for the route, just continue.
  if (!authRequired) return next();

  // // If auth is required and the user is logged in...
  // if (auth.loggedIn) {
  //   // Validate the local user token...
  //   // return store.dispatch('auth/validate').then((validUser) => {
  //   return auth.validate().then((validUser) => {
  //     // Then continue if the token still represents a valid user,
  //     // otherwise redirect to login.
  //     validUser ? next() : redirectToLogin();
  //   });
  // }

  const loggeduser = auth.getToken();
  return loggeduser ? next() : redirectToLogin();

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-inner-declarations
  function redirectToLogin() {
    // Pass the original route to the login component
    next({ name: "login", query: { redirectFrom: routeTo.fullPath } });
  }
});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // // Create a `beforeResolve` hook, which fires whenever
  // // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // // allows us to ensure data is fetched even when params change,
  // // but the resolved route does not. We put it in `meta` to
  // // indicate that it's a hook we created, rather than part of
  // // Vue Router (yet?).
  // try {
  //   // For each matched route...
  //   for (const route of routeTo.matched) {
  //     await new Promise((resolve, reject) => {
  //       // If a `beforeResolve` hook is defined, call it with
  //       // the same arguments as the `beforeEnter` hook.
  //       if (route.meta && route.meta.beforeResolve) {
  //         route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
  //           // If the user chose to redirect...
  //           if (args.length) {
  //             // If redirecting to the same route we're coming from...
  //             // Complete the redirect.
  //             next(...args);
  //             reject(new Error("Redirected"));
  //           } else {
  //             resolve();
  //           }
  //         });
  //       } else {
  //         // Otherwise, continue resolving the route.
  //         resolve();
  //       }
  //     });
  //   }
  //   // If a `beforeResolve` hook chose to redirect, just return.
  // } catch (error) {
  //   return;
  // }

  document.title = routeTo.meta.title + " | " + appConfig.title;
  // If we reach this point, continue resolving the route.
  next();
});

export default router;
