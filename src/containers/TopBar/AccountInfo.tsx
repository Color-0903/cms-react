import { Avatar, Dropdown, MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { memo } from 'react';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import { logOut } from '../../util/logout';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE_PATH, TRAINER_ROUTE_PATH } from '../../constants/route';
import IconSVG from '../../components/icons/icons';
import { USER_TYPE } from '../../constants/enum';

const AccountInfo = (props: { infoDropdownItems?: MenuProps['items'] }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { width } = useSelector((state: RootState) => state.setting);
  const navigate = useNavigate();

  const getFullName = () => {
    return `${authUser?.lastName} ${authUser?.firstName}` || '';
  };
  const sampleItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      onClick: (): void => {
        if (authUser?.user.type === USER_TYPE.Admin) {
          navigate(ADMIN_ROUTE_PATH.PROFILE);
        }
        if (authUser?.user.type === USER_TYPE.Trainer) {
          navigate(TRAINER_ROUTE_PATH.PROFILE);
        }
      },
      // icon: <IconSVG type={'profile'} />,
    },
    {
      key: '3',
      label: 'Đăng xuất',
      onClick: () => {
        logOut();
      },
    },
  ];
  return (
    <div className="mx-3 cursor-pointer">
      <Dropdown
        trigger={['click']}
        menu={{ items: props.infoDropdownItems || sampleItems }}
        placement="bottomRight"
        arrow={true}
      >
        <div>
          <Avatar className="my-auto" icon={<UserOutlined />} />
          <span className="ms-1 font-base">{width < TAB_SIZE ? '' : getFullName()}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default memo(AccountInfo);
