import axios from 'axios';
import Cookies from 'js-cookie';
import { logOut } from '../util/logout';
import {
  AssetsApi,
  AuthAdminApi,
  AuthApi,
  AuthPartnerApi,
  BannerApi,
  CadastralApi,
  CategoryApi,
  ColorApi,
  Configuration,
  NotifyApi,
  OrderApi,
  OtpApi,
  ProductApi,
  RolesApi,
  SizeApi,
  StatisticalApi,
  StoreApi,
  UsersApi,
  VoucherApi,
} from './client-axios';
import { CustomHandleError } from '../components/catch/error';

const config = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || Cookies.get('token') || undefined,
});
export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    CustomHandleError(error?.response?.data);
    if (error?.response?.status === 401) {
      // logOut();
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
const bannerApi = new BannerApi(config, undefined, axiosInstance);
const authPartnerApi = new AuthPartnerApi(config, undefined, axiosInstance);
const authApi = new AuthApi(config, undefined, axiosInstance);
const otpApi = new OtpApi(config, undefined, axiosInstance);
const cadastralApi = new CadastralApi(config, undefined, axiosInstance);
const storeApi = new StoreApi(config, undefined, axiosInstance);
const voucherApi = new VoucherApi(config, undefined, axiosInstance);
const notifyApi = new NotifyApi(config, undefined, axiosInstance);
const statisticalApi = new StatisticalApi(config, undefined, axiosInstance);

export {
  authApi,
  statisticalApi,
  notifyApi,
  voucherApi,
  storeApi,
  roleApi,
  userApi,
  categoryApi,
  colorApi,
  sizeApi,
  productApi,
  assetsApi,
  authAdminApi,
  orderApi,
  bannerApi,
  authPartnerApi,
  otpApi,
  cadastralApi,
};
