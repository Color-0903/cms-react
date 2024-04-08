import antdEN from 'antd/locale/en_US';
import common from './common_en.json';
import signin from './signin.json';
import forgotpassword from './forgot.password.json';
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
import admin from './admin.json';
import trainer from './trainer.json';

const EnLang = {
  messages: {
    ...common,
    ...signin,
    ...forgotpassword,
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
  antd: antdEN,
  locale: 'en-US',
};
export default EnLang;
