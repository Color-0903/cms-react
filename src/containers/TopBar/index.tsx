import { Breadcrumb, Layout, MenuProps, Row, theme } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ADMIN_ROUTE_PATH, TRAINER_ROUTE_PATH } from '../../constants/route';
import { RootState } from '../../store';
import { getRootPath } from '../../util/logout';
import { getLabelBreadcrum } from '../../util/menu';
import AccountInfo from './AccountInfo';
import LanguageDropdown from './LanguageDropdown';
const { Header } = Layout;

const Topbar = (props: {
  collapsed?: boolean;
  onCollapsed?: Function;
  infoDropdownItems?: MenuProps['items'];
  children?: ReactNode;
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.setting);
  const rootPath = getRootPath();
  const DEFAULT_BREADCRUMB: any = [
    {
      href: `/${rootPath}`,
      title: (
        <div className="d-flex align-items-center icon-home">
          <img src="/assets/icons/admin/icn_home.svg" />
          {intl.formatMessage({ id: 'menu.home' })}
        </div>
      ),
    },
  ];

  const [breadcrumb, setBreadcrumb] = useState(DEFAULT_BREADCRUMB);

  useEffect(() => {
    if (location.pathname) {
      let arr = [...DEFAULT_BREADCRUMB];
      const src = rootPath == 'admin' ? ADMIN_ROUTE_PATH : TRAINER_ROUTE_PATH;
      Object.values(src).forEach((route: any) => {
        if (route != '' && location.pathname.includes(`${route}`) && getLabelBreadcrum(route, rootPath) != '') {
          arr.push({
            href: route,
            title: intl.formatMessage({ id: getLabelBreadcrum(route, rootPath) }),
          });
        }
      });
      delete arr[arr.length - 1].href;
      setBreadcrumb(arr);
    }
  }, [location.pathname, locale]);

  return (
    <Header style={{ padding: 0, background: colorBgContainer }} className="d-flex justify-content-between">
      <Row>
        <Breadcrumb className="d-flex align-items-center breadcrumb-container" items={breadcrumb} />
        {props.children}
      </Row>
      <Row>
        <LanguageDropdown />
        <AccountInfo infoDropdownItems={props.infoDropdownItems} />
      </Row>
    </Header>
  );
};

export default Topbar;
