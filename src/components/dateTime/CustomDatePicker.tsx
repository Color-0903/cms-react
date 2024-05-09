import { DatePicker } from 'antd';
import IconSVG from '../icons/icons';
import dayjs, { Dayjs } from 'dayjs';

interface CustomDateProps {
  dateFormat?: string;
  className?: string;
  data?: string;
  placeHolder?: string;
  disabled?: boolean;
}

const disabledFutureDate = (current: Dayjs | undefined) => {
  if (current) {
    const today = dayjs();
    return current && dayjs(current).isAfter(today, 'day');
  }
  return false;
};

const CustomDatePicker = (props: CustomDateProps) => {
  const { dateFormat, className, data, placeHolder, disabled } = props;
  return (
    <DatePicker
      className={`${className} custome-date-time-picker`}
      suffixIcon={<IconSVG type="date-picker" />}
      {...props}
      format={dateFormat}
      placeholder={placeHolder}
      disabledDate={disabledFutureDate}
      disabled={disabled}
    />
  );
};

export default CustomDatePicker;
