import axios from "axios";

const oAnAxios = axios.create({
  baseURL: "http://localhost:1000"
});

// oAnAxios.defaults.baseURL = "http://localhost:1000"
// oAnAxios.defaults.headers.common["Authorization"] = "";
// oAnAxios.defaults.headers.post["Content-type"] = "application/son";

oAnAxios.interceptors.request.use(
  req => {
    console.log("[Axios.request.use]", req);
    return req;
  },
  err => {
    console.log("[Axios.request.error]", err);
    Promise.reject(err);
  }
);
oAnAxios.interceptors.response.use(
  res => {
    console.log("[Axios.response.use]", res);
    return res;
  },
  err => {
    console.log("[Axios.response.error]", err);
    Promise.reject(err);
  }
);
export default oAnAxios;
