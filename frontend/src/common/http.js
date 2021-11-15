import axios from "axios";
import router from "../router";
import store from "../store";

// import { LocalStorageService } from "../storage/storage.service";
// import { appConstants } from "../../app.constants";
// import config from "../../config";
class ApiService {
  constructor() {
    let service = axios.create({
      // baseURL: config.baseURL,
      withCredentials: true,
      baseURL: process.env.VUE_APP_ROOT_API,
    });
    //request interceptor
    service.interceptors.request.use(
      this.requestHandleSuccess,
      this.requestHandleError
    );
    //response interceptor
    service.interceptors.response.use(
      this.responseHandleSuccess,
      this.responseHandleError
    );
    this.service = service;
  }
  save(path, payLoad, config) {
    if (config) return this.service.post(path, payLoad, config);
    else return this.service.post(path, payLoad);
  }
  update(path, payLoad) {
    return this.service.put(path, payLoad);
  }
  findByParams(path, params) {
    return this.service.get(path, { params });
  }
  findAll(path) {
    return this.service.get(path);
  }
  delete(path, params) {
    return this.service.delete(path, params);
  }
  setCustomHeaders(key, value) {
    this.service.defaults.headers.common[key] = value;
  }
  deleteCustomHeaders(key) {
    delete this.service.defaults.headers.common[key];
  }
  requestHandleSuccess(config) {
    // let token = localStorage.getItem(appConstants.sessionKey);
    // if (token) {
    //   config.headers.token = token;
    // }
    // config.headers.common["Access-Control-Allow-Origin"] =
    //   "http://localhost:8080";
    config.headers.common["Access-Control-Allow-Credentials"] = "true";
    return config;
  }
  requestHandleError = (error) => {
    return Promise.reject(error);
  };

  responseHandleSuccess(response) {
    return response;
  }
  responseHandleError = (error) => {
    switch (error.response.status) {
      case 400:
        // console.log("incorrect request payload sent");
        break;
      case 401:
        store.state.user.isAuthenticated = false;
        router.push({ name: "Login" });
        // console.log("not authorized for requested resource");
        break;
      case 404:
        // console.log("requested resource not found");
        break;
      default:
        // console.log("default requested intecept");
        break;
    }
    return Promise.reject(error);
  };
}
export default ApiService;
