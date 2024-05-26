import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import AuthRoute from '../../components/router/auth.router';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../constants/route';

const Admin = React.lazy(() => import('./index'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));
const Chart = React.lazy(() => import('./chart'));

const ListUser = React.lazy(() => import('./user'));

const ColorList = React.lazy(() => import('./color'));

const CategoryList = React.lazy(() => import('./category'));

const SizeList = React.lazy(() => import('./size'));

const Profile = React.lazy(() => import('./profile'));

const ProductList = React.lazy(() => import('./product'));

const ActionProduct = React.lazy(() => import('./product/actions'));

const OrderList = React.lazy(() => import('./order'));
const ActionOrder = React.lazy(() => import('./order/actions'));

const BannerList = React.lazy(() => import('./banner'));

export const AdminRoutes = () => (
  <Routes>
    <Route path="" element={<Navigate to={ADMIN_ROUTE_NAME.DASHBOARD} />} />

    <Route path={ADMIN_ROUTE_PATH.SIGNIN} element={<SuspenseWrapper component={<SignInAdmin />} />} />

    <Route element={<AuthRoute />}>
      <Route path={ADMIN_ROUTE_NAME.DASHBOARD} element={<Admin />}>
        <Route path={ADMIN_ROUTE_NAME.CHART_MANAGEMENT} element={<SuspenseWrapper component={<Chart />} />} />

        <Route path={ADMIN_ROUTE_NAME.PROFILE} element={<SuspenseWrapper component={<Profile />} />} />

        <Route path={ADMIN_ROUTE_NAME.COLOR_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<ColorList />} />} />
        </Route>

        <Route path={ADMIN_ROUTE_NAME.CATEGORY_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<CategoryList />} />} />
        </Route>

        <Route path={ADMIN_ROUTE_NAME.SIZE_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<SizeList />} />} />
        </Route>

        <Route path={ADMIN_ROUTE_NAME.PRODUCT_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<ProductList />} />} />
          <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionProduct />} />} />
          <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionProduct />} />} />
        </Route>

        <Route path={ADMIN_ROUTE_NAME.USER_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<ListUser />} />} />
        </Route>

        <Route path={ADMIN_ROUTE_NAME.ORDER_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<OrderList />} />} />
          <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionOrder />} />} />
        </Route>

        <Route path={ADMIN_ROUTE_NAME.BANNER_MANAGEMENT}>
          <Route path="" element={<SuspenseWrapper component={<BannerList />} />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);
