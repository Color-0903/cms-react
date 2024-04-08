import { TimePicker } from 'antd';
import IconSVG from '../icons/icons';

interface CustomDateProps {
  dateFormat?: string;
  className?: string;
  data?: string;
  placeHolder?: string;
  suffixIcon?: any;
}

const CustomDateTimePicker = (props: CustomDateProps) => {
  const { dateFormat, className, data, placeHolder, suffixIcon } = props;
  return (
    <TimePicker
      className={`${className} date-time-picker-custome`}
      suffixIcon={<IconSVG type="date-picker" />}
      {...props}
      format={dateFormat}
      placeholder={placeHolder}
      allowClear={false}
    />
  );
};

export default CustomDateTimePicker;
