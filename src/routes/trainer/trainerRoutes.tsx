import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { TRAINER_ROUTE_NAME, TRAINER_ROUTE_PATH } from '../../constants/route';
import LessonQuestionAction from './question/actions';

const Trainer = React.lazy(() => import('.'));
const SignInTrainer = React.lazy(() => import('./auth/SignInTrainer'));
const ListCustomer = React.lazy(() => import('./customer'));
const ListCourse = React.lazy(() => import('./course'));
const DetailCourse = React.lazy(() => import('./course/actions/detail'));
const CreateCourse = React.lazy(() => import('./course/actions/create'));
const ActionCustomer = React.lazy(() => import('./customer/actions'));
const TrainerProfile = React.lazy(() => import('./profile'));
const Chart = React.lazy(() => import('./chart'));

export const TrainerRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SuspenseWrapper component={<SignInTrainer />} />} />
    <Route path="" element={<SuspenseWrapper component={<Trainer />} />}>
      <Route path={TRAINER_ROUTE_PATH.CHART_MANAGEMENT} element={<SuspenseWrapper component={<Chart />} />} />
      <Route path={TRAINER_ROUTE_PATH.CUSTOMER_MANAGEMENT} element={<SuspenseWrapper component={<ListCustomer />} />} />
      <Route path={TRAINER_ROUTE_NAME.COURSE_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListCourse />} />} />
        <Route path={TRAINER_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateCourse />} />} />
        <Route path={`${TRAINER_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<DetailCourse />} />} />
        <Route
          path={`${TRAINER_ROUTE_NAME.LESSON}/:id`}
          element={<SuspenseWrapper component={<LessonQuestionAction />} />}
        />
      </Route>
      <Route path={TRAINER_ROUTE_NAME.CUSTOMER_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListCustomer />} />} />
        <Route path={`${TRAINER_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<ActionCustomer />} />} />
      </Route>
      <Route path={TRAINER_ROUTE_PATH.PROFILE} element={<SuspenseWrapper component={<TrainerProfile />} />} />
    </Route>
  </Routes>
);
