import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import AuthRoute from '../../components/router/auth.router';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH, PARTNER_ROUTE_NAME, PARTNER_ROUTE_PATH } from '../../constants/route';

const Parner = React.lazy(() => import('./index'));
const SignIn = React.lazy(() => import('./auth/SignIn'));
const SignUp = React.lazy(() => import('./auth/SingnUp'));
const ListUser = React.lazy(() => import('./user'));
const SupportRouter = React.lazy(() => import('../../components/router/support.router'));

const ListStore = React.lazy(() => import('./store'));
const ActionStore = React.lazy(() => import('./store/actions'));

const ListVoucher = React.lazy(() => import('./voucher'));
const ActionVoucher = React.lazy(() => import('./voucher/actions'));
// const Chart = React.lazy(() => import('./chart'));

// const ColorList = React.lazy(() => import('./color'));

// const CategoryList = React.lazy(() => import('./category'));

// const SizeList = React.lazy(() => import('./size'));

// const Profile = React.lazy(() => import('./profile'));

// const ProductList = React.lazy(() => import('./product'));

// const ActionProduct = React.lazy(() => import('./product/actions'));

// const OrderList = React.lazy(() => import('./order'));
// const ActionOrder = React.lazy(() => import('./order/actions'));

// const BannerList = React.lazy(() => import('./banner'));

export const PartnerRoutes = () => (
  <Routes>
    <Route path="/partner" element={<Navigate to={PARTNER_ROUTE_NAME.DASHBOARD} />} />

    <Route path={PARTNER_ROUTE_NAME.SIGNIN} element={<SuspenseWrapper component={<SignIn />} />} />
    <Route path={PARTNER_ROUTE_NAME.SIGNUP} element={<SuspenseWrapper component={<SignUp />} />} />

    <Route element={<AuthRoute />}>
      <Route element={<SuspenseWrapper component={<SupportRouter />} />}>
        <Route path={PARTNER_ROUTE_NAME.DASHBOARD} element={<Parner />}>
          {/* <Route path={ADMIN_ROUTE_NAME.CHART_MANAGEMENT} element={<SuspenseWrapper component={<Chart />} />} /> */}
          {/* <Route path={ADMIN_ROUTE_NAME.PROFILE} element={<SuspenseWrapper component={<Profile />} />} /> */}
          <Route path={PARTNER_ROUTE_NAME.USER_MANAGEMENT}>
            <Route path="" element={<SuspenseWrapper component={<ListUser />} />} />
          </Route>
          <Route path={PARTNER_ROUTE_NAME.VOUCER_MANAGEMENT}>
            <Route path="" element={<SuspenseWrapper component={<ListVoucher />} />} />
            <Route
              path={PARTNER_ROUTE_NAME.VOUCHER_MANAGEMENT_CREATE}
              element={<SuspenseWrapper component={<ActionVoucher />} />}
            />
            <Route
              path={PARTNER_ROUTE_NAME.VOUCHER_MANAGEMENT_DETAIL}
              element={<SuspenseWrapper component={<ActionVoucher />} />}
            />
          </Route>
          <Route path={PARTNER_ROUTE_NAME.STORE_MANAGEMENT}>
            <Route path="" element={<SuspenseWrapper component={<ListStore />} />} />
            <Route
              path={PARTNER_ROUTE_NAME.STORE_MANAGEMENT_CREATE}
              element={<SuspenseWrapper component={<ActionStore />} />}
            />
            <Route
              path={PARTNER_ROUTE_NAME.STORE_MANAGEMENT_DETAIL}
              element={<SuspenseWrapper component={<ActionStore />} />}
            />
          </Route>
        </Route>
      </Route>
    </Route>
  </Routes>
);
