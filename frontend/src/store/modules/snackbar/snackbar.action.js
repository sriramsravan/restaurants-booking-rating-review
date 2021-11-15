import { storeActions } from "../../actions.constants";
import { storeMutations } from "../../mutations.constants";

const snackbarActions = {
  [storeActions.setSnackbarText]: (context, payLoad) => {
    context.commit(storeMutations.setSnackbarText, payLoad);
  }
};

export default { ...snackbarActions };
