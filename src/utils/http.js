import axios from "axios";
import router from "../router";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL + "/api/v1";
axios.defaults.withCredentials = import.meta.env.DEV;

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 && error.response.config.url !== "/user") {
        sessionStorage.clear();
        router.push("/login");
        return Promise.reject("登录已失效，请重新登录");
    }
    return Promise.reject(error);

});


const request = async (config) => {
    return axios(config);
}

export { request };
