import { Select } from 'antd';
import { useIntl } from 'react-intl';

interface CustomeVideoProps<T = any> {
  src?: string | undefined;
  controls?: boolean;
  className?: string;
}

const CustomeVideo = <T extends any>(props: CustomeVideoProps<T>) => {
  const intl = useIntl();
  return (
    <video className={`${props.className} w-100 h-auto rounded`} controls={props.controls ?? true}>
      <source {...props} />
    </video>
  );
};

export default CustomeVideo;
