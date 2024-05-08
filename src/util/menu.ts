import { ADMIN_ROUTE_PATH } from '../constants/route';

export const getMenuActiveIconName = (key: string, route: 'Admin' | ''): string => {
  if (route === 'Admin') {
    switch (key) {
      case ADMIN_ROUTE_PATH.ROLE_MANAGEMENT:
        return 'roleManagementIconActive';
      case ADMIN_ROUTE_PATH.USER_MANAGEMENT:
        return 'userManagementIconActive';
      case ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT:
        return 'adminManagementIconActive';
      default:
        return '';
    }
  } else return '';
};

export const getLabelBreadcrum = (key: string, route: 'admin' | ''): string => {
  if (route === 'admin') {
    switch (key) {
      case ADMIN_ROUTE_PATH.USER_MANAGEMENT:
        return 'menu.customerManagement';
      case ADMIN_ROUTE_PATH.PROFILE:
        return 'menu.profileManagement';
      case ADMIN_ROUTE_PATH.CATEGORY_MANAGEMENT:
        return 'menu.categoryManagement';
      case ADMIN_ROUTE_PATH.COLOR_MANAGEMENT:
        return 'menu.colorManagement';
      case ADMIN_ROUTE_PATH.SIZE_MANAGEMENT:
        return 'menu.sizeManagement';
      case ADMIN_ROUTE_PATH.PRODUCT_MANAGEMENT:
        return 'menu.productManagement';
      default:
        return '';
    }
  } else return '';
};
