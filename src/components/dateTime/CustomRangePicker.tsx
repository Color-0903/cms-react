import { TimePicker, TimePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import './index.scss';
import { RangePickerProps } from 'antd/es/date-picker';

interface CustomDateProps extends RangePickerProps {
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
  return <TimePicker.RangePicker {...props} className="custom-range-picker" format={dateFormat ?? 'HH:mm'} />;
};

export default CustomDatePicker;
