import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const languageData = [
  {
    languageId: 'vietnamese',
    locale: 'vi',
    name: 'Việt Nam',
    icon: 'vn',
  },
  {
    languageId: 'english',
    locale: 'en',
    name: 'English',
    icon: 'us',
  },
];

export interface ILocaleState {
  languageId: string;
  locale: string;
  name: string;
  icon: string;
}

export interface SettingState {
  locale: ILocaleState;
  initAdminURL: string;
  initCustomerURL: string;
  isDarkMode: boolean;
  width: number;
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState: (): SettingState => {
    let itemLocale = languageData[0];
    let isDarkMode = false;
    const locale = localStorage.getItem('locale');
    const filterLocale = languageData.find((x) => x.locale == locale);
    if (filterLocale) {
      itemLocale = filterLocale;
    }

    const savedIsDarkMode = localStorage.getItem('isDarkMode');
    if (savedIsDarkMode) {
      isDarkMode = savedIsDarkMode == 'true';
    }
    return {
      locale: itemLocale,
      initAdminURL: '/admin',
      initCustomerURL: '/',
      isDarkMode,
      width: window.innerWidth,
    };
  },
  reducers: {
    switchLanguage: (state, action: PayloadAction<ILocaleState>) => {
      state.locale = action.payload;
      localStorage.setItem('locale', action.payload.locale);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      localStorage.setItem('isDarkMode', action.payload.toString());
    },
    setInitAdminUrl: (state, action: PayloadAction<string>) => {
      state.initAdminURL = action.payload;
    },
    setInitCustomerUrl: (state, action: PayloadAction<string>) => {
      state.initCustomerURL = action.payload;
    },
    updateWindowWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
  },
});

export const { switchLanguage, setInitAdminUrl, setInitCustomerUrl, setDarkMode, updateWindowWidth } =
  settingSlice.actions;

export default settingSlice.reducer;
