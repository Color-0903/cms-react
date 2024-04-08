import { useEffect } from 'react';
import { useIntl } from 'react-intl';

const useIntlHook = () => {
  const intl = useIntl();

  useEffect(() => {}, []);

  return intl;
};

export default useIntlHook;
