import { UserTypeEnum } from '../../../../apis/client-axios';
import SignInCommon from '../../../../components/auth/login';

const SignIn = () => {
  return <SignInCommon userType={UserTypeEnum.Partner} />;
};

export default SignIn;
