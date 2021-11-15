import { storeActions } from "../../actions.constants";
// import { storeMutations } from "../../mutations.constants";
import ApiService from "../../../common/http";
const api = new ApiService();

const snackbarActions = {
  [storeActions.getAllRestaurants]: (context, { params }) => {
    return api.findByParams(`/api/restaurants`, params).then((res) => {
      return res;
    });
  },
  [storeActions.getByIdRestaurant]: (context, payload) => {
    let { id } = payload;
    return api.findAll(`/api/restaurants/${id}`).then((res) => {
      return res;
    });
  },
  [storeActions.createRestaurant]: (context, payload) => {
    return api.save(`api/restaurants`, payload.data).then((res) => {
      return res;
    });
  },
  [storeActions.deleteRestaurant]: (context, payload) => {
    let { id } = payload;
    return api.delete(`api/restaurants/${id}`, payload.data).then((res) => {
      return res;
    });
  },
  [storeActions.editRestaurant]: (context, payload) => {
    let { id } = payload;
    return api.update(`api/restaurants/${id}`, payload.data).then((res) => {
      return res;
    });
  },
};

export default { ...snackbarActions };
