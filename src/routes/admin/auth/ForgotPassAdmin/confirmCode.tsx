import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { authApi, otpApi } from '../../../../apis';
import { ForgotPasswordDto, VerifyOtpDto } from '../../../../apis/client-axios';
import ForgotSuccess from './forgotSuccess';
import OTPInput from 'react-otp-input';
import ConfirmPassword from './confirmPassword';

const ConfirmCode = ({ data }: any) => {
  const intl = useIntl();
  const [pass, setPass] = useState({ emailAddress: '', type: '', otpCode: '' });

  const [codes, setCodes] = useState([]);
  const [time, setTime] = useState('');

  const [otp, setOTP] = useState('');

  const regex = useRef(/^[a-zA-Z0-9]{6}$/);

  const onFinish = ({ code }: any) => {
    const sendData: VerifyOtpDto = { otpCode: otp, emailAddress: data.identifier, type: data.type };
    console.log(otp);
    console.log(sendData);
    checkOtpMutation.mutate(sendData);
  };

  const checkOtpMutation = useMutation((otp: VerifyOtpDto) => otpApi.otpControllerVerifyOtp(otp), {
    onSuccess: ({ data }) => {
      setPass({
        type: data.type,
        emailAddress: data.emailAddress,
        otpCode: data.otpCode,
      });
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'forgot.otpInvalid' }));
    },
  });

  // const forgotPasswordMutation = useMutation(
  //   (forgotPasswordDto: ForgotPasswordDto) => authApi.authControllerForgotPassword(forgotPasswordDto),
  //   {
  //     onSuccess: ({ data }) => {
  //       // if (!data) return message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
  //       setPass(true);
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
  //     },
  //   }
  // );

  const sendOTPMutation = useMutation(
    (findUserByIdentifierType: any) => authApi.authControllerForgotPassword(findUserByIdentifierType),
    {
      onSuccess: ({ data }, findUserByIdentifierType): any => {
        console.log(data);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'forgot.error.tryAgain' }));
      },
    }
  );

  const onFinishFailed = () => {};

  const handlleOnpaste = (e: any) => {
    const pastedData = e.clipboardData.getData('text');
    if (regex.current.test(pastedData)) setCodes(Array.from(pastedData));
  };

  const startTimer = (duration: number) => {
    let timer: number = duration,
      minutes: any,
      seconds: any;
    setInterval(function () {
      minutes = parseInt((timer / 60).toString(), 10);
      seconds = parseInt((timer % 60).toString(), 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      if (--timer < -1) {
        // timer = duration;
      } else {
        setTime(`${minutes}:${seconds}s`);
      }
    }, 1000);
  };

  const handleResendOTP = () => {
    if (time !== '00:00s') return message.error(intl.formatMessage({ id: 'forgot.otp.time' }));
    sendOTPMutation.mutate(data);
    startTimer(60 * 2);
  };

  return pass.otpCode !== '' ? (
    <ConfirmPassword data={pass} />
  ) : (
    <>
      <div className="vh-100 row justify-content-center align-items-center">
        <div id="login-form" className="row justify-content-center align-items-center">
          <div className="logo">
            <img src="/assets/images/logo.png" />
          </div>
          <div className="form-name">
            <header className="form-name-header">{intl.formatMessage({ id: 'forgot.code' })}</header>
            <p>{intl.formatMessage({ id: 'forgot.requiredCode' })}</p>
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
            <div className="confirm-code">
              <div className="confirm-code-input">
                <OTPInput
                  onChange={setOTP}
                  value={otp}
                  inputStyle="inputStyle"
                  numInputs={4}
                  inputType="number"
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input {...props} className="otp-input" />}
                />
                {/* {codes.length > 0 ? (
                  <>
                    {codes.map((val, index) => (
                      <Input key={index} value={val} onPaste={handlleOnpaste} />
                    ))}
                  </>
                ) : (
                  <>
                    <Input name={'otpIndex0'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex1'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex2'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex3'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex4'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex5'} onPaste={handlleOnpaste} />
                  </>
                )} */}
              </div>
              <p className="confirm-code-messenger">
                <span onClick={handleResendOTP}>
                  {intl.formatMessage({ id: 'forgot.confirmCodeMessenger' })} ({time})
                </span>
              </p>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" shape="round" className="w-100">
                {intl.formatMessage({ id: 'forgot.submit' })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default ConfirmCode;
