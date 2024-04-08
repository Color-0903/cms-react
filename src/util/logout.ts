import { ADMIN_ROUTE_PATH } from '../constants/route';

export const logOut = () => {
  localStorage.removeItem('token');
  redirectToSignIn();
};

export const redirectToSignIn = () => {
  const path = window.location.pathname.split('/');
  if (path[1] == 'admin') window.location.href = ADMIN_ROUTE_PATH.SIGNIN;
  else if (path[1] == 'admin-clinic') window.location.href = '/admin-clinic/signin';
  else window.location.href = '/signin';
};

export const getRootPath = () => {
  const path = window.location.pathname.split('/');
  if (path[1] == 'admin') return 'admin';
  else return '';
};
