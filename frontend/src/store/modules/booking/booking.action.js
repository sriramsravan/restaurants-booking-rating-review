import { storeActions } from "../../actions.constants";
// import { storeMutations } from "../../mutations.constants";
import ApiService from "../../../common/http";
const api = new ApiService();

const snackbarActions = {
  [storeActions.getAllBookings]: (context, { params }) => {
    return api.findByParams(`/api/bookings`, params).then((res) => {
      return res;
    });
  },
  [storeActions.getByIdBooking]: (context, payload) => {
    let { id } = payload;
    return api.findAll(`/api/bookings/${id}`).then((res) => {
      return res;
    });
  },
  [storeActions.createBooking]: (context, payload) => {
    return api.save(`api/bookings`, payload.data).then((res) => {
      return res;
    });
  },
  [storeActions.deleteBooking]: (context, payload) => {
    let { id } = payload;
    return api.delete(`api/bookings/${id}`, payload.data).then((res) => {
      return res;
    });
  },
  [storeActions.editBooking]: (context, payload) => {
    let { id } = payload;
    return api.update(`api/bookings/${id}`, payload.data).then((res) => {
      return res;
    });
  },
};

export default { ...snackbarActions };
