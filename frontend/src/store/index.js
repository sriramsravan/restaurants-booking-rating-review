import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

import snackbar from "./modules/snackbar";
import restaurant from "./modules/restaurant";
import user from "./modules/user";
import review from "./modules/review";
import booking from "./modules/booking";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
  modules: {
    snackbar,
    restaurant,
    user,
    review,
    booking,
  },
});
