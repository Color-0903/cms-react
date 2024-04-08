import { Avatar, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { memo } from 'react';
import { setDarkMode } from '../../store/settingSlice';
import { useIntl } from 'react-intl';

const DarkModeSwitch = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.setting);
  const intl = useIntl();

  const dispatch = useAppDispatch();
  return (
    <Switch
      className="my-auto mx-3"
      checked={isDarkMode}
      onChange={() => dispatch(setDarkMode(!isDarkMode))}
      checkedChildren={intl.formatMessage({ id: 'common.setting.darkMode' })}
      unCheckedChildren={intl.formatMessage({ id: 'common.setting.lightMode' })}
    />
  );
};

export default memo(DarkModeSwitch);
