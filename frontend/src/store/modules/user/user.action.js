import ApiService from "../../../common/http";
import { storeActions } from "../../actions.constants";
import { storeMutations } from "../../mutations.constants";

const api = new ApiService();

const userActions = {
  [storeActions.getAllUsers]: (context, { params }) => {
    return api.findByParams(`/api/users`, params).then((res) => {
      return res;
    });
  },

  // Get User from DB
  [storeActions.getUser]: (context) => {
    return api.findAll(`api/auth/me`).then((res) => {
      context.commit(storeMutations.setUser, res.data);
      return res;
    });
  },
  // Update User Using ID
  [storeActions.updateUserById]: (context, payLoad) => {
    let { id } = payLoad;
    return api.update(`api/users/${id}`, payLoad.data).then((res) => {
      return res;
    });
  },

  [storeActions.deleteUserById]: (context, payLoad) => {
    let { id } = payLoad;
    return api.delete(`api/users/${id}`, payLoad.data).then((res) => {
      return res;
    });
  },

  // User Registration
  [storeActions.registerUser]: (context, payLoad) => {
    return api.save(`api/auth/signup`, payLoad.data).then((res) => {
      return res;
    });
  },

  // Create User Using ID
  [storeActions.createUser]: (context, payLoad) => {
    return api.save(`api/users`, payLoad.data).then((res) => {
      return res;
    });
  },

  // Login
  [storeActions.loginAction]: (context, payLoad) => {
    return api.save("api/auth/signin", payLoad).then((res) => {
      context.commit(storeMutations.loginMutation, true);
      return res;
    });
  },

  // Logout
  [storeActions.logoutAction]: () => {
    return api.findAll(`/api/auth/logout`).then((res) => {
      return res;
    });
  }, // Logout
};
export default { ...userActions };
