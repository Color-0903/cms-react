import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_ROUTE_NAME } from '../../constants/route';

const Admin = React.lazy(() => import('./index'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));
const Chart = React.lazy(() => import('./chart'));

const ListUser = React.lazy(() => import('./user'));
const UserAction = React.lazy(() => import('./user/actions'));

const Color = React.lazy(() => import('./color'));
const ActionColor = React.lazy(() => import('./color/actions'));

const CategoryList = React.lazy(() => import('./category'));
const ActionCategory = React.lazy(() => import('./category/actions'));

const SizeList = React.lazy(() => import('./size'));
const ActionSize = React.lazy(() => import('./size/actions'));

const ProductList = React.lazy(() => import('./product'));
const ActionProduct = React.lazy(() => import('./product/actions'));

export const AdminRoutes = () => (
  <Routes>
    <Route path={ADMIN_ROUTE_NAME.SIGNIN} element={<SignInAdmin />} />
    {/* <Route path={ADMIN_ROUTE_NAME.FORGOT_PASSWORD} element={<ForgotPassAdmin />} /> */}

    <Route path={ADMIN_ROUTE_NAME.DASHBOARD} element={<Admin />}>
      <Route path={ADMIN_ROUTE_NAME.CHART_MANAGEMENT} element={<SuspenseWrapper component={<Chart />} />} />
      {/* <Route path={ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListAdmin />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateAdmin />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateAdmin />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListRole />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionRole />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionRole />} />} />
      </Route> */}

      <Route path={ADMIN_ROUTE_NAME.COLOR_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<Color />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionColor />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionColor />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.CATEGORY_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<CategoryList />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionCategory />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionCategory />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.SIZE_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<SizeList />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionSize />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionSize />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.PRODUCT_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ProductList />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionProduct />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionProduct />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.USER_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListUser />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<UserAction />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<UserAction />} />} />
      </Route>
    </Route>
  </Routes>
);
