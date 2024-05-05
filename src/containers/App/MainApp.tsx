import { Layout, MenuProps } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../../store';
import SidebarContent from '../SideBar/SidebarContent';
import Topbar from '../TopBar';
const { Header, Content, Sider, Footer } = Layout;

interface IMainAppProp {
  menuItems?: MenuProps['items'];
  infoDropdownItems?: MenuProps['items'];
  extraTopbar?: ReactNode;
}

const MainApp = (props: IMainAppProp) => {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useSelector((state: RootState) => state.setting);
  const authUser = useSelector((state: RootState) => state.auth).authUser;
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    let data: any[] = [];
    if (authUser?.user && authUser?.user.roles.length > 0 && props.menuItems) {
      authUser.user.roles.map((role: any) =>
        props.menuItems?.map((item: any) => {
          if (Array.isArray(item.view)) {
            for (const i of item.view) {
              if (role.permissions.includes(i)) {
                if (!data.includes(item)) data.push(item);
                break;
              }
            }
          }
        })
      );
      if (data && data.length > 0) setMenu(data);
    }
  }, [authUser, props]);

  return (
    <Layout style={{ minHeight: '100vh' }} hasSider={true}>
      <div className="bg-white">
        <SidebarContent menuItems={props.menuItems} />
      </div>
      <Layout>
        <Layout>
          <Topbar
            collapsed={collapsed}
            onCollapsed={() => setCollapsed(!collapsed)}
            infoDropdownItems={props.infoDropdownItems}
          >
            {props.extraTopbar}
          </Topbar>
          <Content
            style={{
              padding: '40px 56px',
              margin: 0,
              height: '1vh',
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MainApp;
