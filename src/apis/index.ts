import axios from 'axios';
import { logOut } from '../util/logout';
import {
  AuthApi,
  CustomersApi,
  Configuration,
  RolesApi,
  PermissionsApi,
  TrainerApi,
  CourseApi,
  LessonApi,
  NewsApi,
  AssetsApi,
  RecruitApi,
  LessonQuestionApi,
  WorkoutScheduleApi,
  FaqApi,
  DocsApi,
  LessonQuestionUserAnswerApi,
  LessonLearnApi,
  LessonQuestionAddOnTimeApi,
  SurveyQuestionApi,
  AdminApi,
  OtpApi,
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

const authApi = new AuthApi(config, undefined, axiosInstance);
const customerApi = new CustomersApi(config, undefined, axiosInstance);
const adminApi = new AdminApi(config, undefined, axiosInstance);
const roleApi = new RolesApi(config, undefined, axiosInstance);
const permissionApi = new PermissionsApi(config, undefined, axiosInstance);
const newsApi = new NewsApi(config, undefined, axiosInstance);
const recruitApi = new RecruitApi(config, undefined, axiosInstance);
const faqApi = new FaqApi(config, undefined, axiosInstance);
const docApi = new DocsApi(config, undefined, axiosInstance);
const trainerApi = new TrainerApi(config, undefined, axiosInstance);
const courseApi = new CourseApi(config, undefined, axiosInstance);
const lessonApi = new LessonApi(config, undefined, axiosInstance);
const assetsApi = new AssetsApi(config, undefined, axiosInstance);
const lessonQuestionApi = new LessonQuestionApi(config, undefined, axiosInstance);
const workoutScheduleApi = new WorkoutScheduleApi(config, undefined, axiosInstance);
const lessonLearnAPi = new LessonLearnApi(config, undefined, axiosInstance);
const lessonQuestionAddOnTimeApi = new LessonQuestionAddOnTimeApi(config, undefined, axios);
const otpApi = new OtpApi(config, undefined, axios);

const surveyApi = new SurveyQuestionApi(config, undefined, axiosInstance);

export {
  authApi,
  customerApi,
  adminApi,
  roleApi,
  permissionApi,
  trainerApi,
  courseApi,
  newsApi,
  assetsApi,
  recruitApi,
  lessonQuestionApi,
  workoutScheduleApi,
  lessonApi,
  faqApi,
  docApi,
  lessonLearnAPi,
  lessonQuestionAddOnTimeApi,
  surveyApi,
  otpApi,
};
