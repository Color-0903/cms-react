import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authApi } from '../../apis';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import MainApp from '../../containers/App/MainApp';
import { getItem } from '../../containers/SideBar/SidebarContent';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { helper } from '../../util/common';
import useIntlHook from '../../util/useIntl';
import { getMenuActiveIconName } from '../../util/menu';

const Admin = () => {
  const dispatch = useAppDispatch();
  const intl = useIntlHook();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.chartManagement' }),
      ADMIN_ROUTE_PATH.CHART_MANAGEMENT,
      // <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('chart')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.roleManagement' }),
      ADMIN_ROUTE_PATH.ROLE_MANAGEMENT,
      // <img src="/assets/icons/admin/roleManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('role')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.adminManagement' }),
      ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT,
      // <img src="/assets/icons/admin/normal/adminManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('administrator')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.trainerManagement' }),
      ADMIN_ROUTE_PATH.TRAINER_MANAGEMENT,
      // <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('trainer')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.customerManagement' }),
      ADMIN_ROUTE_PATH.USER_MANAGEMENT,
      // <img src="/assets/icons/admin/userManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('customer')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.recruitmentManagement' }),
      ADMIN_ROUTE_PATH.RECRUIMENT_MANAGEMENT,
      // <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('recruitment')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.newsManagement' }),
      ADMIN_ROUTE_PATH.NEWS_MANAGEMENT,
      // <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('news')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.helpManagement' }),
      ADMIN_ROUTE_PATH.HELP_MANAGEMENT,
      // <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('help')
    ),
    getItem(
      intl.formatMessage({ id: 'menu.surveyManagement' }),
      ADMIN_ROUTE_PATH.SURVEY_MANAGEMENT,
      // <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />,
      undefined,
      undefined,
      undefined,
      helper.generatePermission('help')
    ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: ['adminMe'],
    queryFn: () => authApi.authControllerAdminMe(),
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
