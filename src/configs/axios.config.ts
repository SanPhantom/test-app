import axios from "axios";

const request = axios.create({
  baseURL: "https://musicapi.onephantom.cn/",
  // baseURL: 'http://localhost:3000/',
  timeout: 100000,
  withCredentials: true,
  headers: {
    // "X-Custom-Header": 'foobar',
  },
});

request.interceptors.request.use(async (config) => {
  const { method } = config;
  switch (method && method.toUpperCase()) {
    case "GET":
      config.params = {
        ...config.params,
      };
      break;
    case "POST":
      config.params = {
        ...config.params,
        timestamp: new Date().getTime(),
        realIP: "116.25.146.177",
      };
      break;
    default:
      console.log("axios request error");
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
    return Promise.resolve<any>(response.data);
  },
  (error) => {
    if (error && error.response) {
      const data = error.response.data;
      if (data.code === 301) {
        console.log(data.msg);
      }
    } else {
      error.message = "连接服务器失败";
    }

    return Promise.reject(error);
  }
);

export default request;
