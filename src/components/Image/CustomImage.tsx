import { ImageProps, Select, SelectProps, Image } from 'antd';
import { useIntl } from 'react-intl';

interface CustomImageProps<T = any> extends ImageProps {}

const CustomImage = <T extends any>(props: CustomImageProps<T>) => {
  const intl = useIntl();
  return <Image {...props} className="w-100 h-100 rounded" />;
};

export default CustomImage;
