const ADMIN = '/admin';
const TRAINER = '';

const ACTION = {
  CREATE: 'create',
  DETAIL: 'detail',
};

export const ADMIN_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  ROLE_MANAGEMENT: 'role-management',
  USER_MANAGEMENT: 'user-management',
  ADMIN_MANAGEMENT: 'admin-management',
  CHART_MANAGEMENT: 'chart-management',

  PROFILE: 'profile',

  CREATE: 'create',
  DETAIL: 'detail',
};

export const ADMIN_ROUTE_PATH = {
  DASHBOARD: `${ADMIN}/${ADMIN_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${ADMIN}/${ADMIN_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${ADMIN}/${ADMIN_ROUTE_NAME.FORGOT_PASSWORD}`,

  ROLE_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`,
  CREATE_ROLE: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_ROLE: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}/${ACTION.DETAIL}`,

  USER_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`,
  CREATE_USER: `${ADMIN}/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}/${ACTION.CREATE}`,

  ADMIN_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`,
  CREATE_ADMIN: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}/${ACTION.CREATE}`,
  CHART_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.CHART_MANAGEMENT}`,

  PROFILE: `${ADMIN}/${ADMIN_ROUTE_NAME.PROFILE}`,
};

export const TRAINER_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  COURSE_MANAGEMENT: 'course-management',
  LESSON: 'lesson',
  CUSTOMER_MANAGEMENT: 'customer-management',
  NEWS_MANAGEMENT: 'news-management',
  CHART_MANAGEMENT: 'chart-management',

  PROFILE: 'profile',

  CREATE: 'create',
  DETAIL: 'detail',
};

export const TRAINER_ROUTE_PATH = {
  DASHBOARD: `${TRAINER}/${TRAINER_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${TRAINER}/${TRAINER_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${TRAINER}/${TRAINER_ROUTE_NAME.FORGOT_PASSWORD}`,

  COURSE_MANAGEMENT: `${TRAINER}/${TRAINER_ROUTE_NAME.COURSE_MANAGEMENT}`,
  CREATE_COURSE_MANAGEMENT: `${TRAINER}/${TRAINER_ROUTE_NAME.COURSE_MANAGEMENT}/${TRAINER_ROUTE_NAME.CREATE}`,

  LESSON: (id: string) => `${TRAINER}/${TRAINER_ROUTE_NAME.COURSE_MANAGEMENT}/${TRAINER_ROUTE_NAME.LESSON}/${id}`,

  CUSTOMER_MANAGEMENT: `${TRAINER}/${TRAINER_ROUTE_NAME.CUSTOMER_MANAGEMENT}`,
  NEWS_MANAGEMENT: `${TRAINER}/${TRAINER_ROUTE_NAME.NEWS_MANAGEMENT}`,

  CHART_MANAGEMENT: `${TRAINER}/${TRAINER_ROUTE_NAME.CHART_MANAGEMENT}`,

  PROFILE: `${TRAINER}/${TRAINER_ROUTE_NAME.PROFILE}`,
};
