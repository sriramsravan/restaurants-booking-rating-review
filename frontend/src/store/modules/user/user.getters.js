import { storeGetters } from "../../getters.constants";

const snackbarGetters = {
  // Get Role
  [storeGetters.isAdmin]: (state) => {
    return state.isAdmin;
  },
  [storeGetters.user]: (state) => {
    return state.user;
  }
};
export default { ...snackbarGetters };
