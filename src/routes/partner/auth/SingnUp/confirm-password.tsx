import { Form } from 'antd';
import { useIntl } from 'react-intl';
import { Fragment } from 'react/jsx-runtime';
import { UserTypeEnum } from '../../../../apis/client-axios';
import CustomInput from '../../../../components/input/CustomInput';
import { ValidateLibrary } from '../../../../validate';
import { useContext, useState } from 'react';
import { SignInContext } from '.';

export interface ISignInCommon {
  userType: UserTypeEnum;
}
const ConfirmPassword = () => {
  const intl = useIntl();
  const { steps, form } = useContext(SignInContext) as any;

  return (
    <Fragment>
      <Form.Item
        label={
          <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
            {intl.formatMessage({ id: `sigup.password` })}
          </span>
        }
        name={'password'}
        className="mb-3"
        rules={ValidateLibrary().password}
      >
        <CustomInput placeholder={intl.formatMessage({ id: 'sigup.password.placeholder' })} isPassword />
      </Form.Item>
      <Form.Item
        label={
          <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
            {intl.formatMessage({ id: `sigup.password.confirm` })}
          </span>
        }
        name={'password-confirm'}
        className="mb-3"
        rules={ValidateLibrary().password}
      >
        <CustomInput placeholder={intl.formatMessage({ id: 'sigup.password.confirm' })} isPassword />
      </Form.Item>
    </Fragment>
  );
};

export default ConfirmPassword;
