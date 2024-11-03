import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LOCAL_STORAGE, SESSION_STORAGE } from '../../constants/storage';
import { ADMIN, ADMIN_ROUTE_PATH, PARTNER_ROUTE_PATH } from '../../constants/route';

const AuthRoute = () => {
  const { pathname } = useLocation();
  console.log({
    1: pathname,
    2: pathname == ADMIN,
  });
  const isLoggedIn = Boolean(
    localStorage.getItem(LOCAL_STORAGE.TOKEN) || sessionStorage.getItem(SESSION_STORAGE.TOKEN)
  );

  return (
    <>
      {!isLoggedIn && <Navigate to={pathname == ADMIN ? ADMIN_ROUTE_PATH.SIGNIN : PARTNER_ROUTE_PATH.SIGNIN} />}
      <Outlet />
    </>
  );
};

export default AuthRoute;
