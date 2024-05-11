import axios from 'axios';
import { logOut } from '../util/logout';
import {
  AssetsApi,
  AuthAdminApi,
  CategoryApi,
  ColorApi,
  Configuration,
  OrderApi,
  ProductApi,
  RolesApi,
  SizeApi,
  UsersApi,
} from './client-axios';

const config = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || undefined,
});
export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      logOut();
    }
    return Promise.reject(error);
  }
);

const roleApi = new RolesApi(config, undefined, axiosInstance);
const userApi = new UsersApi(config, undefined, axiosInstance);
const categoryApi = new CategoryApi(config, undefined, axiosInstance);
const colorApi = new ColorApi(config, undefined, axiosInstance);
const sizeApi = new SizeApi(config, undefined, axiosInstance);
const productApi = new ProductApi(config, undefined, axiosInstance);
const assetsApi = new AssetsApi(config, undefined, axiosInstance);
const authAdminApi = new AuthAdminApi(config, undefined, axiosInstance);
const orderApi = new OrderApi(config, undefined, axiosInstance);

export { roleApi, userApi, categoryApi, colorApi, sizeApi, productApi, assetsApi, authAdminApi, orderApi };
