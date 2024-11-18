import { DatePicker, DatePickerProps } from 'antd';
import { disabledPastDate } from '../../constants/function';
import IconSVG from '../icons/icons';
import './index.scss';

interface CustomDateProps extends DatePickerProps {
  dateFormat?: string;
  className?: string;
  data?: string;
  placeHolder?: string;
}

const CustomDatePicker = (props: CustomDateProps) => {
  const { dateFormat, className, data, placeHolder, disabled, ...res } = props;
  return (
    <DatePicker
      className={`custom-date-picker ${className}`}
      suffixIcon={<IconSVG type="date-picker" />}
      format={dateFormat}
      placeholder={placeHolder}
      {...res}
      disabled={disabled}
      disabledDate={disabledPastDate}
    />
  );
};

export default CustomDatePicker;
