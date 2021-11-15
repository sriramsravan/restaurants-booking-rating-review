import { storeActions } from "../../actions.constants";
// import { storeMutations } from "../../mutations.constants";
import ApiService from "../../../common/http";
const api = new ApiService();

const snackbarActions = {
  [storeActions.getAllReviews]: (context, payLoad) => {
    let { restaurantId, params = {} } = payLoad;
    return api
      .findByParams(`/api/restaurants/${restaurantId}/reviews`, params)
      .then((res) => {
        return res;
      });
  },
  [storeActions.createReview]: (context, payLoad) => {
    let { restaurantId } = payLoad;
    return api
      .save(`api/restaurants/${restaurantId}/reviews`, payLoad.data)
      .then((res) => {
        return res;
      });
  },
  [storeActions.updateReview]: (context, payLoad) => {
    let { restaurantId, id } = payLoad;
    return api
      .update(`api/restaurants/${restaurantId}/reviews/${id}`, payLoad.data)
      .then((res) => {
        return res;
      });
  },
  [storeActions.deleteReview]: (context, payLoad) => {
    let { restaurantId, id } = payLoad;
    return api
      .delete(`api/restaurants/${restaurantId}/reviews/${id}`, payLoad.data)
      .then((res) => {
        return res;
      });
  },
};

export default { ...snackbarActions };
