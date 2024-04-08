import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './routes/admin/adminRoutes';
import { TrainerRoutes } from './routes/trainer/trainerRoutes';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<TrainerRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
