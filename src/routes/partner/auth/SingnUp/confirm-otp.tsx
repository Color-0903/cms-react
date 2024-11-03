import { Form } from 'antd';
import { InputOTP } from 'antd-input-otp';
import { useIntl } from 'react-intl';
import { Fragment } from 'react/jsx-runtime';
import { UserTypeEnum } from '../../../../apis/client-axios';
import { ValidateLibrary } from '../../../../validate';
import './index.scss';

export interface ISignInCommon {
  userType: UserTypeEnum;
}
const ConfirmOtp = () => {
  const intl = useIntl();

  return (
    <Fragment>
      <Form.Item label={intl.formatMessage({ id: 'sigup.otp' })} name="otp" rules={ValidateLibrary().required}>
        <InputOTP /* autoSubmit={form} */ inputType="numeric" />
      </Form.Item>
    </Fragment>
  );
};

export default ConfirmOtp;
