import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { useIntl } from 'react-intl';
import { authAdminApi } from '../../apis';
import { LoginDto } from '../../apis/client-axios';
import { USER_TYPE } from '../../constants/enum';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import { useAppDispatch } from '../../store';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

export interface ISignInCommon {
  userType: USER_TYPE;
}
const SignInCommon = (props: ISignInCommon) => {
  const { userType } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const loginAdminMutation = useMutation((loginDto: LoginDto) => authAdminApi.authAdminControllerAdminLogin(loginDto), {
    onSuccess: ({ data }) => {
      dispatch(login(data as any));
      navigate(ADMIN_ROUTE_PATH.DASHBOARD);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
    },
  });

  const onFinish = (values: any) => {
    if (userType == USER_TYPE.Admin) {
      loginAdminMutation.mutate({
        ...values,
      });
    }

    if (userType == USER_TYPE.Admin) {
      loginAdminMutation.mutate({
        ...values,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const navigateToForgotPassword = () => {
    if (userType == USER_TYPE.Admin) {
      navigate(ADMIN_ROUTE_PATH.FORGOT_PASSWORD);
    }
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div id="login-form" className=" justify-content-center align-items-center">
        <div className="logo">
          <img src="/assets/images/logo.png" />
        </div>
        <div className="d-flex title">
          <div>{intl.formatMessage({ id: 'sigin.title' })}</div>
        </div>
        <Form
          name="basic"
          layout="vertical"
          style={{ maxWidth: 350 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label={intl.formatMessage({ id: 'sigin.username' })}
            name={'identifier'}
            className="mb-3"
            rules={[{ required: true, min: 1, max: 255, type: 'email' }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'sigin.username.placeholder' })} />
          </Form.Item>

          <Form.Item
            className="form-item-password"
            label={intl.formatMessage({ id: 'sigin.password' })}
            name={'password'}
            rules={[{ required: true, min: 8, max: 16 }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'sigin.password.placeholder' })} />
          </Form.Item>

          <div className="d-flex justify-content-end txt-forgot" onClick={navigateToForgotPassword}>
            {intl.formatMessage({ id: 'sigin.forgot' })}
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              className="w-100"
              loading={loginAdminMutation.isLoading}
            >
              {intl.formatMessage({ id: 'sigin.submit' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInCommon;
