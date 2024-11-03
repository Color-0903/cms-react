import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './routes/admin/adminRoutes';
import { PartnerRoutes } from './routes/partner/partnerRoutes';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AdminRoutes />} />
        <Route path="partner/*" element={<PartnerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
