import { storeMutations } from "../../mutations.constants";
const snackbarMutations = {
  [storeMutations.setUser]: (state, { user }) => {
    state.user = user;
    state.isAdmin = user.role === "admin";
  },
  [storeMutations.loginMutation]: (state, status) => {
    state.isAuthenticated = status;
  },
};
export default { ...snackbarMutations };
