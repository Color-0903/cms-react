import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import forgot from './forgot.password.json';
import menu from './menu.json';
import role from './role.json';
import news from './news.json';
import recruit from './recruit.json';
import help from './help.json';
import faq from './faq.json';
import doc from './doc.json';
import survey from './survey.json';
import customer from './customer.json';
import validate from './validate.json';
import trainer from './trainer.json';
import admin from './admin.json';

const viLang = {
  messages: {
    ...common,
    ...signin,
    ...forgot,
    ...menu,
    ...role,
    ...news,
    ...recruit,
    ...help,
    ...faq,
    ...doc,
    ...survey,
    ...customer,
    ...validate,
    ...trainer,
    ...admin,
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
