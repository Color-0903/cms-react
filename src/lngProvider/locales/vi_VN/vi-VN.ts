import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import signup from './signup.json';
import forgot from './forgot.password.json';
import menu from './menu.json';
import table from './table.json';
import category from './category.json';
import error from './error.json';
import partner from './partner.json';
import size from './size.json';
import user from './user.json';
import validate from './validate.json';
import product from './product.json';
import order from './order.json';
import banner from './banner.json';

const viLang = {
  messages: {
    ...common,
    ...signin,
    ...signup,
    ...forgot,
    ...menu,
    ...table,
    ...category,
    ...error,
    ...partner,
    ...size,
    ...user,
    ...validate,
    ...product,
    ...order,
    ...banner,
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
