import SignInCommon from '../../../../components/auth/login';
import { USER_TYPE } from '../../../../constants/enum';

const SignInAdmin = () => {
  return <SignInCommon userType={USER_TYPE.Admin} />;
};

export default SignInAdmin;
