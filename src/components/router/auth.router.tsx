import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LOCAL_STORAGE, SESSION_STORAGE } from '../../constants/storage';
import { ADMIN, ADMIN_ROUTE_PATH, PARTNER_ROUTE_PATH } from '../../constants/route';
import Cookies from 'js-cookie';

const AuthRoute = () => {
  const { pathname } = useLocation();

  console.log(
    'run vo day',
    localStorage.getItem(LOCAL_STORAGE.TOKEN) ||
      sessionStorage.getItem(SESSION_STORAGE.TOKEN) ||
      Cookies.get(LOCAL_STORAGE.TOKEN)
  );
  const isLoggedIn = Boolean(
    localStorage.getItem(LOCAL_STORAGE.TOKEN) ||
      sessionStorage.getItem(SESSION_STORAGE.TOKEN) ||
      Cookies.get(LOCAL_STORAGE.TOKEN)
  );

  return (
    <>
      {!isLoggedIn && <Navigate to={pathname == ADMIN ? ADMIN_ROUTE_PATH.SIGNIN : PARTNER_ROUTE_PATH.SIGNIN} />}
      <Outlet />
    </>
  );
};

export default AuthRoute;
