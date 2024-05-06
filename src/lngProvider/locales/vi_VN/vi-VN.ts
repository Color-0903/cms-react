import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import forgot from './forgot.password.json';
import menu from './menu.json';
import table from './table.json';
import category from './category.json';
import error from './error.json';

const viLang = {
  messages: {
    ...common,
    ...signin,
    ...forgot,
    ...menu,
    ...table,
    ...category,
    ...error,
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
