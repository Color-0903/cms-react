import { Switch, SwitchProps } from 'antd';
import { useIntl } from 'react-intl';
interface CustomSwitchProps extends SwitchProps {}

const CustomSwitch = (props: CustomSwitchProps) => {
  const intl = useIntl();
  return <Switch {...props} className={`ant-custom-switch ${props.className}`} />;
};

export default CustomSwitch;
