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
import CustomInput from '../input/CustomInput';
import CustomButton from '../buttons/CustomButton';

export interface ISignInCommon {
  userType: USER_TYPE;
}
const SignInCommon = (props: ISignInCommon) => {
  const { userType } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const loginAdminMutation = useMutation((loginDto: LoginDto) => authAdminApi.authAdminControllerLogin(loginDto), {
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
    <div className="vh-100 d-flex justify-content-center align-items-center w-100 px-4">
      <div
        className="d-flex flex-column justify-content-center align-items-center border rounded shadow pt-2 px-4 w-100"
        style={{ maxWidth: '490px' }}
      >
        <div className="logo">
          <img src="/assets/images/logo.png" />
        </div>
        <div className="d-flex title">
          <div className="font-weight-700 font-size-24 color-0d6efd font-base mt-2">
            {intl.formatMessage({ id: 'sigin.title' })}
          </div>
        </div>
        <Form
          name="basic"
          className="w-100"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `sigin.username` })}
              </span>
            }
            name={'identifier'}
            className="mb-3"
            rules={[{ required: true, min: 1, max: 255, type: 'email', message: ' ' }]}
          >
            <CustomInput placeholder={intl.formatMessage({ id: 'sigin.username.placeholder' })} />
          </Form.Item>

          <Form.Item
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `sigin.password` })}
              </span>
            }
            name={'password'}
            rules={[{ required: true, min: 8, max: 16, message: ' ' }]}
          >
            <CustomInput placeholder={intl.formatMessage({ id: 'sigin.password.placeholder' })} isPassword={true} />
          </Form.Item>

          <div className="d-flex justify-content-end" onClick={navigateToForgotPassword}>
            <span className=" pointer">{intl.formatMessage({ id: 'sigin.forgot' })}</span>
          </div>

          <Form.Item className="text-right mt-3">
            <CustomButton type="primary" loading={loginAdminMutation.isLoading} htmlType="submit">
              {intl.formatMessage({ id: 'sigin.submit' })}
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInCommon;
