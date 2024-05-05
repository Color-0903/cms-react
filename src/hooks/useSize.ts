import { useEffect, useState } from 'react';
import { TAB_SIZE } from '../constants/ThemeSetting';

const useSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth ?? TAB_SIZE,
    height: window.innerHeight ?? TAB_SIZE,
  });

  useEffect(() => {
    const windowSizeHandler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', windowSizeHandler);
    window.addEventListener('load', windowSizeHandler);

    return () => {
      window.removeEventListener('resize', windowSizeHandler);
      window.removeEventListener('load', windowSizeHandler);
    };
  }, []);
  return windowSize;
};

export default useSize;
