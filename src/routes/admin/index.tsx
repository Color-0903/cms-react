import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authAdminApi } from '../../apis';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import MainApp from '../../containers/App/MainApp';
import { getItem } from '../../containers/SideBar/SidebarContent';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { helper } from '../../util/helper';
import { useIntl } from 'react-intl';
import {
  PieChartOutlined,
  UsergroupAddOutlined,
  BgColorsOutlined,
  MenuUnfoldOutlined,
  ColumnWidthOutlined,
  DotChartOutlined,
} from '@ant-design/icons';
import { AUTH_ADMIN_ME } from '../../util/contanst';

const Admin = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.chartManagement' }),
      ADMIN_ROUTE_PATH.CHART_MANAGEMENT,
      <PieChartOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('chart')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.customerManagement' }),
      ADMIN_ROUTE_PATH.USER_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <UsergroupAddOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('customer')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.colorManagement' }),
      ADMIN_ROUTE_PATH.COLOR_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <BgColorsOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('trainer')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.categoryManagement' }),
      ADMIN_ROUTE_PATH.CATEGORY_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <MenuUnfoldOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('category')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.sizeManagement' }),
      ADMIN_ROUTE_PATH.SIZE_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <ColumnWidthOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('size')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.productManagement' }),
      ADMIN_ROUTE_PATH.PRODUCT_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <DotChartOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('product')
    ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.roleManagement' }),
    //   ADMIN_ROUTE_PATH.ROLE_MANAGEMENT,
    //   // <img src="/assets/icons/admin/roleManagementIconInactive.svg" />,
    //   undefined,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('role')
    // ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.adminManagement' }),
    //   ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT,
    //   // <img src="/assets/icons/admin/normal/adminManagementIconInactive.svg" />,
    //   undefined,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('administrator')
    // ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: [AUTH_ADMIN_ME],
    queryFn: () => authAdminApi.authAdminControllerUserMe(),
  });

  useEffect(() => {
    if (data) {
      dispatch(updateMe(data.data));
    }
  }, [data]);

  useEffect(() => {
    handleChangeIconMenu();
  }, [location.pathname, locale]);

  const handleChangeIconMenu = () => {
    const newMenu = defaultMenu.map((item: any) => {
      if (location.pathname.includes(`${item.key}`)) {
        return {
          ...item,
          // icon: <img src={`/assets/icons/admin/active/${getMenuActiveIconName(item.key, 'Admin')}.svg`} />,
        };
      }
      return item;
    });
    setMenu(newMenu);
  };

  return <MainApp menuItems={menu}></MainApp>;
};
export default Admin;
