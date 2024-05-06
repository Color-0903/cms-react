import TextArea from 'antd/es/input/TextArea';
import { useIntl } from 'react-intl';
import type { TextAreaProps } from 'rc-textarea/lib/interface';

interface CustomAreaProps extends TextAreaProps {
  placeholder?: string;
  className?: string;
  rows?: number;
}

const CustomArea = (props: CustomAreaProps) => {
  const intl = useIntl();
  const { placeholder, className, rows } = props;

  return (
    <TextArea
      placeholder={placeholder || undefined}
      className={`ant-custom-area ${className}`}
      {...props}
      rows={rows ?? 3}
    />
  );
};

export default CustomArea;
