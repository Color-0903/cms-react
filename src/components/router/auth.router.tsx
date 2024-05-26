import { Navigate, Outlet } from 'react-router-dom';
import { LOCAL_STORAGE, SESSION_STORAGE } from '../../constants/storage';
import { ADMIN_ROUTE_PATH } from '../../constants/route';

const AuthRoute = () => {
  const isLoggedIn = Boolean(
    localStorage.getItem(LOCAL_STORAGE.TOKEN) || sessionStorage.getItem(SESSION_STORAGE.TOKEN)
  );

  return (
    <>
      {!isLoggedIn && <Navigate to={ADMIN_ROUTE_PATH.SIGNIN} />}
      <Outlet />
    </>
  );
};

export default AuthRoute;
