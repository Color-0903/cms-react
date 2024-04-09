import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { TRAINER_ROUTE_PATH } from '../../constants/route';
import MainApp from '../../containers/App/MainApp';
import { getItem } from '../../containers/SideBar/SidebarContent';
import { RootState, useAppDispatch } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../apis';
import { updateMe } from '../../store/authSlice';

const Trainer = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      // intl.formatMessage({ id: 'menu.home' }),
      'ホーム',
      TRAINER_ROUTE_PATH.CHART_MANAGEMENT
      // <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />
    ),
    getItem(
      // intl.formatMessage({ id: 'menu.lessonManagement' }),
      '科目',
      TRAINER_ROUTE_PATH.COURSE_MANAGEMENT
      // <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />
    ),
    getItem(
      // intl.formatMessage({ id: 'menu.customerManagement' }),
      '生徒管理',
      TRAINER_ROUTE_PATH.CUSTOMER_MANAGEMENT
      // <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />
    ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: ['trainerMe'],
    queryFn: () => authApi.authControllerTrainerMe(),
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
          // icon: <img src={`/assets/icons/admin/${getMenuActiveIconName(item.key, 'Trainer')}.svg`} />,
        };
      }
      return item;
    });
    setMenu(newMenu);
  };

  return <MainApp menuItems={menu}></MainApp>;
};
export default Trainer;
