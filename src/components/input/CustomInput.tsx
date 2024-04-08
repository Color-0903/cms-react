import { Input, InputProps } from 'antd';
import { useIntl } from 'react-intl';

interface CustomInputProps extends InputProps {
  placeholder?: string;
  className?: string;
  isPassword?: boolean;
}

const CustomInput = (props: CustomInputProps) => {
  const intl = useIntl();
  const { placeholder, className, isPassword, ...restProps } = props;

  return !isPassword ? (
    <Input
      maxLength={255}
      placeholder={placeholder || undefined}
      className={`custom-input ${className}`}
      {...restProps}
      autoComplete="new-password"
    />
  ) : (
    <Input.Password
      maxLength={255}
      placeholder={placeholder || undefined}
      className={`custom-input ${className}`}
      {...restProps}
      autoComplete="new-password"
    />
  );
};

export default CustomInput;
