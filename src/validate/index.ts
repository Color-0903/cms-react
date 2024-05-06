import { Rule } from 'antd/lib/form';
import { IntlShape } from 'react-intl';
import { _validator } from './validator.validate';

interface Validate {
  [key: string]: Rule[];
}

export const ValidateLibrary: (_option?: any[]) => Validate = (_option?) => {
  if (!_option) {
    _option = [];
  }

  const email = [
    {
      validator: _validator({
        required: ' ',
        email: ' ',
      }),
    },
    ..._option,
  ];

  const password = [
    {
      validator: _validator({
        required: ' ',
        password: ' ',
      }),
    },
    ..._option,
  ];

  const required = [
    {
      validator: _validator({
        required: ' ',
      }),
    },
    ..._option,
  ];

  const phone = [
    {
      validator: _validator({
        required: ' ',
        phone: ' ',
      }),
    },
    ..._option,
  ];
  return {
    email,
    password,
    required,
    phone,
  };
};
