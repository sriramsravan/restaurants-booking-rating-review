import { storeMutations } from "../../mutations.constants";
const snackbarMutations = {
  [storeMutations.setSnackbarText]: (state, res) => {
    state.snackbarText = res.text;
    state.color = res.color;
    state.timeout = res.timeout;
  },
};
export default { ...snackbarMutations };
