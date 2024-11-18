import { useMutation } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { createContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { authPartnerApi, otpApi } from '../../../../apis';
import {
  CreateOtpDto,
  CreateOtpDtoTypeEnum,
  CreateOtpDtoUserTypeEnum,
  CreatePartnerDto,
  OtpApi,
  UserTypeEnum,
} from '../../../../apis/client-axios';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ADMIN_ROUTE_PATH, PARTNER_ROUTE_PATH } from '../../../../constants/route';
import { useAppDispatch } from '../../../../store';
import { login } from '../../../../store/authSlice';
import ConfirmIdentifier from './confirm-identifier';
import ConfirmOtp from './confirm-otp';
import ConfirmPassword from './confirm-password';

export interface ISignInCommon {
  userType: UserTypeEnum;
}

interface Steps {
  step: number;
  data: CreatePartnerDto | undefined;
}

const handleRenderForm = (step: number) => {
  if (step == 2) {
    return <ConfirmPassword />;
  } else if (step == 3) {
    return <ConfirmOtp />;
  } else {
    return <ConfirmIdentifier />;
  }
};

export const SignInContext = createContext(null);
const SignUp = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Steps>({ step: 1, data: undefined });

  const SignUpMutation = useMutation((dto: CreatePartnerDto) => authPartnerApi.authPartnerControllerSignUp(dto), {
    onSuccess: ({ data }) => {
      navigate(PARTNER_ROUTE_PATH.SIGNIN);
    },
  });

  const sendOtpMutation = useMutation((dto: CreateOtpDto) => otpApi.otpControllerSendOtp(dto), {
    onSuccess: ({ data }) => {
      setSteps({
        ...steps,
        step: 3,
      });
      return data;
    },
  });

  const onFinish = async (values: any) => {
    if (steps.step == 1) {
      setSteps({
        data: { ...steps.data, ...values },
        step: 2,
      });
      return;
    }

    if (values['password'] && values['password-confirm']) {
      if (values['password'].trim() !== values['password-confirm'].trim()) {
        const err = intl.formatMessage({ id: 'validate.password.confirm' });
        form.setFields([
          {
            name: ['password-confirm'],
            errors: [err],
          },
        ]);
        return;
      }
    }

    if (steps.step == 2) {
      const identifier = values?.identifier ?? steps?.data?.identifier;
      setSteps({
        data: { ...steps.data, ...values },
        step: 2,
      });
      await sendOtpMutation.mutate({
        identifier: identifier as string,
        type: CreateOtpDtoTypeEnum.Register,
        userType: CreateOtpDtoUserTypeEnum.Partner,
      });
    }

    if (values['otp'] && steps.data) {
      const code = values['otp'].join('') as string;

      SignUpMutation.mutate({
        code: code?.trim(),
        identifier: steps.data.identifier?.trim(),
        password: steps.data.password?.trim(),
      });
    }

    const nextStep = steps.step + 1;
  };

  return (
    <SignInContext.Provider
      value={
        {
          steps: steps,
          form: form,
        } as any
      }
    >
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
              {intl.formatMessage({ id: 'sigup.title' })}
            </div>
          </div>
          <Form
            form={form}
            name="basic"
            className="w-100"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            {handleRenderForm(steps.step)}
            <div className="d-flex justify-content-end mt-2" /* onClick={navigateToForgotPassword} */>
              <span>{intl.formatMessage({ id: 'sigup.signup.suggest' })} </span>
              <a className="pointer" onClick={() => navigate(PARTNER_ROUTE_PATH.SIGNIN)}>
                {' '}
                <small className="ml-2">{intl.formatMessage({ id: 'sigup.signup' })}</small>
              </a>
            </div>
            <Form.Item className="text-right mt-3">
              <CustomButton
                className="w-100"
                type="primary"
                loading={sendOtpMutation.isLoading || SignUpMutation.isLoading}
                onClick={form.submit}
              >
                <span className="text-white">{intl.formatMessage({ id: 'common.confirm' })}</span>
              </CustomButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </SignInContext.Provider>
  );
};

export default SignUp;
