import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import forgot from './forgot.password.json';
import menu from './menu.json';
import role from './role.json';
import table from './table.json';
import admin from './admin.json';


const viLang = {
  messages: {
    ...common,
    ...signin,
    ...forgot,
    ...menu,
    ...role,
    ...table,
    ...admin,
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
