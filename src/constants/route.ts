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
  COLOR_MANAGEMENT: 'color-management',
  CATEGORY_MANAGEMENT: 'category-management',
  SIZE_MANAGEMENT: 'size-management',
  PRODUCT_MANAGEMENT: 'product-management',

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

  COLOR_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.COLOR_MANAGEMENT}`,
  CREATE_COLOR: `${ADMIN}/${ADMIN_ROUTE_NAME.COLOR_MANAGEMENT}/${ACTION.CREATE}`,

  SIZE_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.SIZE_MANAGEMENT}`,
  CREATE_SIZE: `${ADMIN}/${ADMIN_ROUTE_NAME.SIZE_MANAGEMENT}/${ACTION.CREATE}`,

  CATEGORY_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.CATEGORY_MANAGEMENT}`,
  CREATE_CATEGORY: `${ADMIN}/${ADMIN_ROUTE_NAME.CATEGORY_MANAGEMENT}/${ACTION.CREATE}`,

  PRODUCT_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.PRODUCT_MANAGEMENT}`,
  CREATE_PRODUCT: `${ADMIN}/${ADMIN_ROUTE_NAME.PRODUCT_MANAGEMENT}/${ACTION.CREATE}`,

  PROFILE: `${ADMIN}/${ADMIN_ROUTE_NAME.PROFILE}`,
};
