import { theme } from 'antd';
import './SidebarLogo.css';
const SidebarLogo = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div style={{ background: colorBgContainer }} className="sidebar-logo-container justify-content-center">
      <div>
        <img width={108} height={57} className="my-auto" src={'/assets/images/logo.png'} />
      </div>
      <div className="line-under-logo" />
    </div>
  );
};
export default SidebarLogo;
