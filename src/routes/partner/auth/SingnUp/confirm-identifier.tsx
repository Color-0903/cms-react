import { Form } from 'antd';
import { useIntl } from 'react-intl';
import { UserTypeEnum } from '../../../../apis/client-axios';
import CustomInput from '../../../../components/input/CustomInput';
import { ValidateLibrary } from '../../../../validate';

export interface ISignInCommon {
  userType: UserTypeEnum;
}
const ConfirmIdentifier = () => {
  const intl = useIntl();

  return (
    <Form.Item
      label={
        <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
          {intl.formatMessage({ id: `sigup.username` })}
        </span>
      }
      name={'identifier'}
      className="mb-3"
      rules={ValidateLibrary().email}
    >
      <CustomInput placeholder={intl.formatMessage({ id: 'sigup.username.placeholder' })} />
    </Form.Item>
  );
};

export default ConfirmIdentifier;
