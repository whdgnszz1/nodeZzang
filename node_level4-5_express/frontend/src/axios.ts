import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = `${process.env.REACT_APP_SERVER_URL}`;

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }
    return Promise.reject(error);
  }
);

export const postAPI = <T>(url: string, data: T) => {
  return axios.post<T>(API_BASE_URL + url, data);
};

export const putAPI = <T>(url: string, data: T) => {
  return axios.put<T>(API_BASE_URL + url, data);
};

export const getAPI = (url: string, config?: AxiosRequestConfig) => {
  return axios.get(API_BASE_URL + url, config);
};

export const deleteAPI = (url: string) => {
  return axios.delete(API_BASE_URL + url);
};

export const patchAPI = <T>(url: string, data: T) => {
  return axios.patch<T>(API_BASE_URL + url, data);
};
