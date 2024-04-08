import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { authApi, otpApi } from '../../../../apis';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import ConfirmPassword from './confirmPassword';
import { CheckUsername, FilterOtpDto, VerifyOtpDto } from '../../../../apis/client-axios';
import { typeForgotPassword } from '../../../../util/contanst';
import ConfirmCode from './confirmCode';

const ForgotPassAdmin = () => {
  const regexPhone = useRef(
    /^(([^<>()[\]\\~!#$%^&()<>.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const intl = useIntl();
  const [pass, setPass] = useState({ identifier: '', type: '' });
  const navigate = useNavigate();

  const checkIdentifierMutation = useMutation(
    (identifier: CheckUsername) => authApi.authControllerCheckUsernameForgot(identifier),
    {
      onSuccess: ({ data }, identifier) => {
        if (!data) return message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
        sendOtpMutation.mutate({ emailAddress: identifier.identifier, type: identifier.type });
        setPass({ ...identifier });
      },
      onError: (error) => {
        console.log(error);
        message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
      },
    }
  );

  const sendOtpMutation = useMutation((otp: FilterOtpDto) => otpApi.otpControllerSend(otp), {
    onSuccess: ({ data }) => {},
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'forgot.otpInvalid' }));
    },
  });

  const onFinish = (values: any) => {
    console.log(values);
    console.log(regexPhone.current.test(values.identifier));
    if (!regexPhone.current.test(values.identifier))
      return message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
    checkIdentifierMutation.mutate({
      ...values,
      type: typeForgotPassword.administrator,
    });
  };

  const onFinishFailed = () => {};

  const backToLogin = () => {
    navigate(ADMIN_ROUTE_PATH.SIGNIN);
  };
  return pass?.identifier ? (
    <ConfirmCode data={pass} />
  ) : (
    <div className="vh-100 row justify-content-center align-items-center">
      <div id="login-form" className="row justify-content-center align-items-center">
        <div className="logo">
          <img src="/assets/images/logo.png" />
        </div>
        <div className="form-name">
          <header className="form-name-header">{intl.formatMessage({ id: 'forgot.innit' })}</header>
          <p>{intl.formatMessage({ id: 'forgot.requiredPhone' })}</p>
          <div></div>
        </div>
        <Form
          name="basic"
          layout="vertical"
          style={{ maxWidth: 374 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
          className="form-data"
        >
          <Form.Item
            label={intl.formatMessage({ id: 'sigin.username' })}
            name="identifier"
            className="mb-3"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              className="w-100"
              loading={checkIdentifierMutation.isLoading}
            >
              {intl.formatMessage({ id: 'forgot.submit' })}
            </Button>
          </Form.Item>
          <div className="d-flex justify-content-center txt-forgot" onClick={backToLogin}>
            {intl.formatMessage({ id: 'forgot.backToLogin' })}
          </div>
        </Form>
      </div>
    </div>
  );
};
export default ForgotPassAdmin;
