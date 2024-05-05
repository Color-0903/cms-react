import {
  AppstoreOutlined,
  DoubleLeftOutlined,
  MailOutlined,
  SettingOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MANAGEMENT_TYPE } from '../../constants/constant';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import SidebarLogo from './SidebarLogo';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import useSize from '../../hooks/useSize';

type MenuItem = Required<MenuProps>['items'][number];

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  view?: string[] // permission to show menu item
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
    view,
  } as MenuItem;
};

const sampleItems: MenuProps['items'] = [
  getItem('Navigation One', 'sub1', <MailOutlined />),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />),

  { type: 'divider' },

  getItem('Navigation Three', 'sub4', <SettingOutlined />),
];

interface ISideBarContentProp {
  menuItems?: MenuProps['items'];
}

const SidebarContent = (props: ISideBarContentProp) => {
  const location = useLocation();
  const navigate = useNavigate();
  const windowSize = useSize();
  const [collapsed, setCollapsed] = useState(windowSize.width < TAB_SIZE);

  const [current, setCurrent] = useState<{ isShow: boolean; value: string }>({
    isShow: true,
    value: location.pathname,
  });

  const selectedKeys = location.pathname.substring(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent({
      isShow: true,
      value: e.key,
    });
    navigate(e.key);
  };

  const excludePath: string[] = [ADMIN_ROUTE_PATH.PROFILE];

  useEffect(() => {
    if (location.pathname) {
      let step = 1;
      if (location.pathname.includes(MANAGEMENT_TYPE.ADMIN)) {
        Object.values(ADMIN_ROUTE_PATH).forEach((route: any) => {
          if (location.pathname.includes(`${route}`)) {
            if (step == 2) {
              setCurrent({
                isShow: true,
                value: route,
              });
            }
            step++;
          }
        });
      }

      if (excludePath.includes(location.pathname)) {
        setCurrent({
          ...current,
          isShow: false,
        });
      }
    }
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <SidebarLogo />
      <Menu
        style={{ height: 'calc(100% - 96px)' }}
        className="pt-4 px-1"
        onClick={onClick}
        // theme="dark"
        selectedKeys={[(current.isShow && current.value) || '']}
        defaultOpenKeys={[defaultOpenKeys]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={props.menuItems || sampleItems}
      />
      <div className="text-right px-2 pt-1">
        {collapsed ? (
          <DoubleRightOutlined className="font-size-22 pointer" onClick={toggleCollapsed} />
        ) : (
          <DoubleLeftOutlined className="font-size-22 pointer" onClick={toggleCollapsed} />
        )}
      </div>
    </>
  );
};

export default SidebarContent;
