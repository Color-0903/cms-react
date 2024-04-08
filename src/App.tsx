import React, { useEffect } from 'react';
import { ConfigProvider, Menu, theme } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import AppLocale from './lngProvider';
import { IntlProvider } from 'react-intl';
import { RootState, useAppDispatch } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RoutesApp from './routes';
import { updateWindowWidth } from './store/settingSlice';
import { PRIMARY_COLOR } from './constants/ThemeSetting';

const App: React.FC = () => {
  const { locale, isDarkMode } = useSelector((state: RootState) => state.setting);
  const dispatch = useAppDispatch();
  const currentAppLocale = (AppLocale as any)[locale.locale];
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  // useEffect(() => {
  //   window.addEventListener('resize', () => {
  //     dispatch(updateWindowWidth(window.innerWidth));
  //   });
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: {
            Button: {
              colorPrimary: PRIMARY_COLOR,
            },
          },
        }}
        locale={currentAppLocale.antd}
      >
        <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
          <RoutesApp />
        </IntlProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
