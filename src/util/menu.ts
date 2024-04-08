import { ADMIN_ROUTE_PATH, TRAINER_ROUTE_NAME } from '../constants/route';

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
  } else if (route === '') {
    switch (key) {
      case TRAINER_ROUTE_NAME.DASHBOARD:
        return 'bookingManagementIconActive';
      default:
        return '';
    }
  } else return '';
};

export const getLabelBreadcrum = (key: string, route: 'admin' | ''): string => {
  if (route === 'admin') {
    switch (key) {
      case ADMIN_ROUTE_PATH.ROLE_MANAGEMENT:
        return 'menu.roleManagement';
      case ADMIN_ROUTE_PATH.CREATE_ROLE:
        return 'menu.create';
      case ADMIN_ROUTE_PATH.DETAIL_ROLE:
        return 'menu.edit';
      case ADMIN_ROUTE_PATH.USER_MANAGEMENT:
        return 'menu.customerManagement';
      case ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT:
        return 'menu.adminManagement';
      default:
        return '';
    }
  } else if (route === '') {
    switch (key) {
      case TRAINER_ROUTE_NAME.DASHBOARD:
        return 'menu.bookingManagement';
      default:
        return '';
    }
  } else return '';
};
