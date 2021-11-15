import { storeGetters } from "../../getters.constants";

const snackbarGetters = {
  // Get Role
  [storeGetters.getSnackbarText]: (state) => {
    return state.snackbarText;
  }
};
export default { ...snackbarGetters };
