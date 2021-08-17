import axios from "axios";
import router from "../router";


axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL + "/api/v1";

axios.interceptors.request.use(config => {

    if (config.url !== "/api/v1/users") {
        sessionStorage.getItem("token") && (config.headers.Authorization = "Bearer " + sessionStorage.getItem("token"));
    }

    return config;
}, error => {
    Promise.reject(error);
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 && error.response.config.url !== "/api/v1/users") {
        sessionStorage.clear();
        router.push("/login");
        return Promise.reject("登录已失效，请重新登录");
    }
    return Promise.reject(error);

});


const request = async (config) => {

    return axios(config);
}

export {request};