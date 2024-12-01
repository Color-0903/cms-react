import { TimePicker, TimePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import './index.scss';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = TimePicker;
interface CustomDateProps extends RangePickerProps {
  dateFormat?: string;
  className?: string;
  data?: string;
  placeHolder?: string;
  disabled?: boolean;
}

const CustomRangePicker = (props: CustomDateProps) => {
  const { dateFormat, className, data, placeHolder, disabled, ...res } = props;
  return <RangePicker {...res} className="custom-range-picker" format={dateFormat ?? 'HH:mm'} />;
};

export default CustomRangePicker;
