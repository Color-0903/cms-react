import SignInCommon from '../../../../components/auth/login';
import { USER_TYPE } from '../../../../constants/enum';

const SignInTrainer = () => {
  return <SignInCommon userType={USER_TYPE.Trainer} />;
};

export default SignInTrainer;
