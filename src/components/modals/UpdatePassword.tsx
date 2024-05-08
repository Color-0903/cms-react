import { useMutation } from '@tanstack/react-query';
import { Form, Modal, message } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { useIntl } from 'react-intl';
import { userApi } from '../../apis';
import { UpdatePasswordDto } from '../../apis/client-axios';
import { ActionUser } from '../../constants/enum';
import { helper } from '../../util/helper';
import { ValidateLibrary } from '../../validate';
import FormWrap from '../FormWrap';
import CustomInput from '../input/CustomInput';

export interface UpdatePasswordInterface {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePassword = (props: UpdatePasswordInterface) => {
  const { isOpen, onClose } = props;
  const [form] = useForm<FormInstance>();
  const intl = useIntl();

  const { mutate: Update, isLoading: isUpdate } = useMutation(
    (dto: UpdatePasswordDto) => userApi.userControllerPassword(dto),
    {
      onSuccess: (data: any) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
        form.resetFields();
        onClose();
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const onFinish = (value: any) => {
    if (value.current === value?.new) return message.error(intl.formatMessage({ id: `password.invalid` }));
    if (value.new !== value?.confirm) return message.error(intl.formatMessage({ id: `password.mismatch` }));
    Update(value);
  };

  return (
    <>
      <Modal
        title={
          <div className="font-weight-700 font-size-18 font-base mt-2">
            {intl.formatMessage({ id: `password.title` })}
          </div>
        }
        open={isOpen}
        onOk={() => form.submit()}
        onCancel={onClose}
        okText={intl.formatMessage({ id: 'common.confirm' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
        style={{ minWidth: '50%' }}
      >
        <FormWrap form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            rules={ValidateLibrary().required}
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `password.current` })}
              </span>
            }
            name={'current'}
            className="w-100 mb-0"
          >
            <CustomInput placeholder={intl.formatMessage({ id: `password.current` })} isPassword={true} />
          </Form.Item>
          <Form.Item
            rules={ValidateLibrary().password}
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `password.new` })}
              </span>
            }
            name={'new'}
            className="w-100 mb-0"
          >
            <CustomInput placeholder={intl.formatMessage({ id: `password.new` })} isPassword={true} />
          </Form.Item>
          <Form.Item
            rules={ValidateLibrary().password}
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `password.confirm` })}
              </span>
            }
            name={'confirm'}
            className="w-100 mb-4"
          >
            <CustomInput placeholder={intl.formatMessage({ id: `password.confirm` })} isPassword={true} />
          </Form.Item>
        </FormWrap>
      </Modal>
    </>
  );
};

export default UpdatePassword;
