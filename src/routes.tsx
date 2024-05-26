import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './routes/admin/adminRoutes';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
