import { theme } from 'antd';
import './SidebarLogo.css';
const SidebarLogo = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div style={{ background: colorBgContainer }} className="sidebar-logo-container justify-content-center">
      <div className="text-center py-1">
        <img width={55} height={55} className="my-auto" src={'/assets/images/logo.png'} />
      </div>
      <div className="line-under-logo" />
    </div>
  );
};
export default SidebarLogo;
