import { Rule, RuleObject } from 'antd/lib/form';
import { IntlShape } from 'react-intl';
import { validator } from './validator.validate';
interface Validate {
  [key: string]: Rule[];
}

const REGEX_URL = '';
const POSTAL_CODE = '';
const START_SPACE = /^(?![\s])[\s\S]*/;

export const ValidateLibrary: (intl: IntlShape) => Validate = (intl) => {
  return {
    email: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.required' }),
      // },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.space',
          }),
          email: intl.formatMessage({
            id: 'validate.email',
          }),
        }),
      },
    ],
    password: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.password' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.password.space',
          }),
          password: intl.formatMessage({
            id: 'validate.password',
          }),
        }),
      },
    ],
    // editPassword: [
    //   {
    //     validator: validator({
    //       space: intl.formatMessage({
    //         id: 'validate.space',
    //       }),
    //       password: intl.formatMessage({
    //         id: 'validate.password',
    //       }),
    //     }),
    //   },
    // ],
    phoneNumber: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.phone.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.phone.required',
          }),
          phone: intl.formatMessage({
            id: 'validate.phone',
          }),
        }),
      },
    ],
    phoneClinic: [
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.space',
          }),
          phone: intl.formatMessage({
            id: 'validate.phone',
          }),
        }),
      },
    ],
    dob: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.required' }),
      // },
    ],
    name: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required',
          }),
        }),
      },
      {
        min: 4,
        message: intl.formatMessage({ id: 'validate.min_4_char' }),
      },
    ],
  };
};
