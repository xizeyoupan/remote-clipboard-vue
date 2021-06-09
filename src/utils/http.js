import axios from "axios";
import qs from "qs";
const baseURL = process.env.VUE_APP_TEST_URL || process.env.VUE_APP_PRODUCTION_URL;
const timeout = 3000;
const headers = { "Content-Type": "application/x-www-form-urlencoded" };
export default {
    post(url, data) {
        return axios({
            method: "post",
            url: `${baseURL}${url}`,
            data: qs.stringify(data),
            timeout: timeout,
            headers: headers
        });
    }, put(url, data) {
        return axios({
            method: "put",
            url: `${baseURL}${url}`,
            data: qs.stringify(data),
            timeout: timeout,

        });
    }, delete(url, data) {
        return axios({
            method: "delete",
            url: `${baseURL}${url}`,
            data: qs.stringify(data),
            timeout: timeout,
            headers: headers
        });
    }, get(url, params) {
        return axios({
            method: "get",
            url: `${baseURL}${url}`,
            params: params,
            timeout: timeout,

        });
    }
}