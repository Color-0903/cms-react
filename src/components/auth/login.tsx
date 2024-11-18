import { useMutation } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { authAdminApi, authPartnerApi } from '../../apis';
import { LoginDto, UserTypeEnum } from '../../apis/client-axios';
import { ADMIN_ROUTE_PATH, PARTNER_ROUTE_PATH } from '../../constants/route';
import { useAppDispatch } from '../../store';
import { login } from '../../store/authSlice';
import CustomButton from '../buttons/CustomButton';
import CustomInput from '../input/CustomInput';

export interface ISignInCommon {
  userType: UserTypeEnum;
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
    // onError: (error) => {
    //   message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
    // },
  });

  const loginPartnernMutation = useMutation(
    (loginDto: LoginDto) => authPartnerApi.authPartnerControllerLogin(loginDto),
    {
      onSuccess: ({ data }) => {
        dispatch(login(data as any));
        navigate(PARTNER_ROUTE_PATH.DASHBOARD);
      },
      // onError: (error) => {
      //   message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
      // },
    }
  );

  const onFinish = (values: any) => {
    if (userType == UserTypeEnum.Admin) {
      loginAdminMutation.mutate({
        ...values,
      });
    } else {
      loginPartnernMutation.mutate({
        ...values,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const navigateToForgotPassword = () => {
    if (userType == UserTypeEnum.Admin) {
      navigate(ADMIN_ROUTE_PATH.FORGOT_PASSWORD);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center w-100 px-4">
      <div
        className="d-flex flex-column justify-content-center align-items-center border rounded shadow pt-2 px-4 w-100"
        style={{ maxWidth: '560px' }}
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

          {userType == UserTypeEnum.Partner && (
            <div className="d-flex justify-content-end mt-2" /* onClick={navigateToForgotPassword} */>
              <span>{intl.formatMessage({ id: 'sigin.signup.suggest' })} </span>
              <a className="pointer" onClick={() => navigate(PARTNER_ROUTE_PATH.SIGNUP)}>
                {' '}
                <small className="ml-2">{intl.formatMessage({ id: 'sigin.signup' })}</small>
              </a>
            </div>
          )}
          <Form.Item className="text-right mt-3">
            <CustomButton className="w-100" type="primary" loading={loginAdminMutation.isLoading} htmlType="submit">
              <span className="text-white">{intl.formatMessage({ id: 'sigin.submit' })}</span>
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInCommon;
