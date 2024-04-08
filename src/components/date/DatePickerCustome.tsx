import { DatePicker, DatePickerProps } from 'antd';
import { disabledFutureDate } from '../../constants/function';
import IconSVG from '../icons/icons';

interface CustomDateProps {
  dateFormat?: string;
  className?: string;
  data?: string;
  placeHolder?: string;
}

const DatePickerCustom = (props: CustomDateProps) => {
  const { dateFormat, className, data, placeHolder } = props;
  return (
    <DatePicker
      className={`ant-custom-area ${className}`}
      suffixIcon={<IconSVG type="date-picker" />}
      format={dateFormat}
      placeholder={placeHolder}
      {...props}
      disabledDate={disabledFutureDate}
    />
  );
};

export default DatePickerCustom;
