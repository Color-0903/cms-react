import { Rule } from 'antd/lib/form';
import { IntlShape, useIntl } from 'react-intl';
import { _validator } from './validator.validate';

interface Validate {
  [key: string]: Rule[];
}

export const ValidateLibrary: (_option?: any[]) => Validate = (_option?) => {
  const intl = useIntl();
  if (!_option) {
    _option = [];
  }

  const email = [
    {
      validator: _validator({
        required: intl.formatMessage({ id: 'validate.required' }),
        email: intl.formatMessage({ id: 'validate.email' }),
      }),
    },
    ..._option,
  ];

  const password = [
    {
      validator: _validator({
        required: intl.formatMessage({ id: 'validate.required' }),
        password: intl.formatMessage({ id: 'validate.password' }),
      }),
    },
    ..._option,
  ];

  const required = [
    {
      validator: _validator({
        required: intl.formatMessage({ id: 'validate.required' }),
      }),
    },
    ..._option,
  ];

  const phone = [
    {
      validator: _validator({
        required: intl.formatMessage({ id: 'validate.required' }),
        phone: intl.formatMessage({ id: 'validate.phone' }),
      }),
    },
    ..._option,
  ];

  const positiveInteger = [
    {
      validator: _validator({
        required: intl.formatMessage({ id: 'validate.required' }),
        positiveInteger: intl.formatMessage({ id: 'validate.positiveInteger' }),
      }),
    },
    ..._option,
  ];

  const percent = [
    {
      validator: _validator({
        required: intl.formatMessage({ id: 'validate.required' }),
        percent: intl.formatMessage({ id: 'validate.percent' }),
      }),
    },
    ..._option,
  ];
  return {
    percent,
    positiveInteger,
    email,
    password,
    required,
    phone,
  };
};
