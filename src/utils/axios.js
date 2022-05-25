import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import * as i18 from "react-i18next";

import store from "@/store";
import history from "@/routes/history";
import { setLoading, clearLoading } from "@/reducers/global";

const { CancelToken } = axios;
// const source = CancelToken.source();

const { dispatch } = store;

const isDev = process.env.NODE_ENV === "development";
const PRD_API_URL = `${window.location.origin}/docaptures/api/`;
const BASE_URL = isDev ? "/api/" : PRD_API_URL;

export default async (propsConfig) => {
  const { withError = true } = propsConfig;

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { common: {} }
  });
  instance.defaults.headers["Content-Type"] = "application/json";

  const source = CancelToken.source();
  const cancelToken = source.token;

  const axiosToken = uuidv4();

  instance.interceptors.request.use(
    config => {
      const { withToken = true, withLoading = true, } = config;
      config.cancelToken = cancelToken;
      if (withToken) {
        const token = sessionStorage.getItem("token");
        if (token) {
          config.headers.common = {
            ...config.headers.common,
            Authorization: `${token}`,
          };
        }
      }
      if (withLoading) {
        dispatch(setLoading({ key: axiosToken, source }));
      }
      return config;
    },
    error => {
      dispatch(clearLoading(axiosToken));
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      dispatch(clearLoading(axiosToken));
      return response?.data?.data ? response.data : response;
    },
    (e) => {
      const code = parseInt(e?.response?.status);
      const msg = e?.response?.data?.message || "Network Error";
      const isCancel = axios.isCancel(e);
      if (code === 401) {
        history.push("/login");
      }
      if (isCancel) {
        // dispatch(clearLoading(axiosToken));
      }
      if (msg && withError) {
        toast(msg, {
          type: "error"
        });
      }
      dispatch(clearLoading(axiosToken));
      return Promise.reject(e);
    }
  );

  return instance(propsConfig);
};
