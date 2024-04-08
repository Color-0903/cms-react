import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarLogo from './SidebarLogo';
import { ADMIN_ROUTE_PATH, TRAINER_ROUTE_PATH } from '../../constants/route';
import { MANAGEMENT_TYPE } from '../../constants/constant';

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
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),

  { type: 'divider' },

  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),

  getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
];

interface ISideBarContentProp {
  menuItems?: MenuProps['items'];
}

const SidebarContent = (props: ISideBarContentProp) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const excludePath: string[] = [ADMIN_ROUTE_PATH.PROFILE, TRAINER_ROUTE_PATH.PROFILE];

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
      } else {
        Object.values(TRAINER_ROUTE_PATH).forEach((route: any) => {
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

  return (
    <>
      <SidebarLogo />
      <Menu
        style={{ height: 'calc(100% - 64px)', width: 355 }}
        onClick={onClick}
        // theme="dark"
        selectedKeys={[(current.isShow && current.value) || '']}
        defaultOpenKeys={[defaultOpenKeys]}
        mode="inline"
        items={props.menuItems || sampleItems}
      />
    </>
  );
};

export default SidebarContent;
