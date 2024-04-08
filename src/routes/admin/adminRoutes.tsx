import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_ROUTE_NAME } from '../../constants/route';

const Admin = React.lazy(() => import('./index'));
const ListCustomer = React.lazy(() => import('./customer'));
const CreateCustomer = React.lazy(() => import('./customer/actions'));
const ListRole = React.lazy(() => import('./role'));
const CreateRole = React.lazy(() => import('./role/actions'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));
const ForgotPassAdmin = React.lazy(() => import('./auth/ForgotPassAdmin'));
const ListAdmin = React.lazy(() => import('./adminUser/index'));
const CreateAdmin = React.lazy(() => import('./adminUser/actions'));
const ActionTrainer = React.lazy(() => import('./trainer/actions'));
const ListRecruitment = React.lazy(() => import('./recruitment'));
const ActionRecruitment = React.lazy(() => import('./recruitment/actions'));
const Help = React.lazy(() => import('./help'));
const CreateFAQ = React.lazy(() => import('./help/actions/faqAction'));
const CreateDOC = React.lazy(() => import('./help/actions/docAction'));
const ListNews = React.lazy(() => import('./news'));
const CreateNews = React.lazy(() => import('./news/actions'));
const Chart = React.lazy(() => import('./chart'));
const ListTrainer = React.lazy(() => import('./trainer'));
const CreateTrainer = React.lazy(() => import('./trainer/actions'));

const ListSurvey = React.lazy(() => import('./survey'));
const CreateSurvey = React.lazy(() => import('./survey/actions'));

export const AdminRoutes = () => (
  <Routes>
    <Route path={ADMIN_ROUTE_NAME.SIGNIN} element={<SignInAdmin />} />
    <Route path={ADMIN_ROUTE_NAME.FORGOT_PASSWORD} element={<ForgotPassAdmin />} />
    <Route path={ADMIN_ROUTE_NAME.DASHBOARD} element={<Admin />}>
      <Route path={ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT} element={<ListAdmin />} />

      <Route path={ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListAdmin />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateAdmin />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateAdmin />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.USER_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListCustomer />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateCustomer />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateCustomer />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.CHART_MANAGEMENT} element={<Chart />} />

      <Route path={ADMIN_ROUTE_NAME.HELP_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<Help />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE_FAQ} element={<SuspenseWrapper component={<CreateFAQ />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL_FAQ}/:id`} element={<SuspenseWrapper component={<CreateFAQ />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE_DOC} element={<SuspenseWrapper component={<CreateDOC />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL_DOC}/:id`} element={<SuspenseWrapper component={<CreateDOC />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListNews />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateNews />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateNews />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListRole />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateRole />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateRole />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.TRAINER_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListTrainer />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateTrainer />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateTrainer />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.RECRUIMENT_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListRecruitment />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<ActionRecruitment />} />} />
        <Route
          path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`}
          element={<SuspenseWrapper component={<ActionRecruitment />} />}
        />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.SURVEY_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListSurvey />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateSurvey />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateSurvey />} />} />
      </Route>
    </Route>
  </Routes>
);
