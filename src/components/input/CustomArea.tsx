import TextArea from 'antd/es/input/TextArea';
import { useIntl } from 'react-intl';
import type { TextAreaProps } from 'rc-textarea/lib/interface';

interface CustomAreaProps extends TextAreaProps {
  placeholder?: string;
  className?: string;
}

const CustomArea = (props: CustomAreaProps) => {
  const intl = useIntl();
  const { placeholder, className } = props;

  return <TextArea placeholder={placeholder || undefined} className={`ant-custom-area ${className}`} {...props} />;
};

export default CustomArea;
