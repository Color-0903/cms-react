import {
  BgColorsOutlined,
  ColumnWidthOutlined,
  DotChartOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  TruckOutlined,
  PicCenterOutlined,
  FileSearchOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authAdminApi, authPartnerApi } from '../../apis';
import { PARTNER_ROUTE_PATH } from '../../constants/route';
import MainApp from '../../containers/App/MainApp';
import { getItem } from '../../containers/SideBar/SidebarContent';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { AUTH_ADMIN_ME } from '../../util/contanst';
import { helper } from '../../util/helper';

const Parner = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    // getItem(
    //   intl.formatMessage({ id: 'menu.chartManagement' }),
    //   PARTNER_ROUTE_PATH.CHART_MANAGEMENT,
    //   <PieChartOutlined className="font-size-22" />,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('chart')
    // ),
    getItem(
      intl.formatMessage({ id: 'menu.customerManagement' }),
      PARTNER_ROUTE_PATH.USER_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <UsergroupAddOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('customer')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.storeManagement' }),
      PARTNER_ROUTE_PATH.STORE_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <HomeOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('trainer')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.voucherManagement' }),
      PARTNER_ROUTE_PATH.VOUCER_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      <FileSearchOutlined className="font-size-22" />,
      undefined,
      undefined,
      helper.generatePermission('trainer')
    ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.categoryManagement' }),
    //   PARTNER_ROUTE_PATH.CATEGORY_MANAGEMENT,
    //   // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
    //   <MenuUnfoldOutlined className="font-size-22" />,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('category')
    // ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.sizeManagement' }),
    //   PARTNER_ROUTE_PATH.SIZE_MANAGEMENT,
    //   // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
    //   <ColumnWidthOutlined className="font-size-22" />,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('size')
    // ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.productManagement' }),
    //   PARTNER_ROUTE_PATH.PRODUCT_MANAGEMENT,
    //   // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
    //   <DotChartOutlined className="font-size-22" />,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('product')
    // ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.orderManagement' }),
    //   PARTNER_ROUTE_PATH.ORDER_MANAGEMENT,
    //   // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
    //   <TruckOutlined className="font-size-22" />,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('order')
    // ),
    // getItem(
    //   intl.formatMessage({ id: 'menu.banerManagement' }),
    //   PARTNER_ROUTE_PATH.BANNER_MANAGEMENT,
    //   // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
    //   <PicCenterOutlined className="font-size-22" />,
    //   undefined,
    //   undefined,
    //   helper.generatePermission('banner')
    // ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: [AUTH_ADMIN_ME],
    queryFn: () => authPartnerApi.authPartnerControllerMe(),
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
export default Parner;
