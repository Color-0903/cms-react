import { LogoutOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UpdatePassword from '../../components/modals/UpdatePassword';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import { RootState } from '../../store';
import { helper } from '../../util/helper';
import { logOut } from '../../util/logout';

const AccountInfo = (props: { infoDropdownItems?: MenuProps['items'] }) => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { width } = useSelector((state: RootState) => state.setting);
  const [changePass, setChangePass] = useState(false);

  const getFullName = () => {
    return `${authUser?.displayName || authUser?.identifier}`;
  };
  const sampleItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      onClick: (): void => {
        navigate(ADMIN_ROUTE_PATH.PROFILE);
      },
      icon: <UserOutlined className="font-size-16 primary" />,
    },
    {
      key: '2',
      label: 'Đổi mật khẩu',
      onClick: (): void => {
        setChangePass(true);
      },
      icon: <UndoOutlined className="font-size-16 primary" />,
    },
    {
      key: '3',
      label: 'Đăng xuất',
      onClick: () => {
        logOut();
      },
      icon: <LogoutOutlined className="font-size-16" />,
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
          <Avatar className="my-auto" icon={<UserOutlined />} src={helper.getSourceFile(authUser?.asset?.source)} />
          <span className="ms-1 font-base">{width < TAB_SIZE ? '' : getFullName()}</span>
        </div>
      </Dropdown>
      <UpdatePassword isOpen={changePass} onClose={() => setChangePass(false)} />
    </div>
  );
};

export default memo(AccountInfo);
