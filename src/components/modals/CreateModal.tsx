import { Form, Modal } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { useIntl } from 'react-intl';
import { ValidateLibrary } from '../../validate';
import FormWrap from '../FormWrap';
import CustomArea from '../input/CustomArea';
import CustomInput from '../input/CustomInput';

export interface CreateModalInterface {
  alias: string;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
  form: FormInstance;
}

const CreateModal = (props: CreateModalInterface) => {
  const { isOpen, onSubmit, onClose, form } = props;
  const intl = useIntl();

  return (
    <>
      <Modal
        title={
          <div className="font-weight-700 font-size-18 font-base mt-2">
            {' '}
            {intl.formatMessage({ id: `${props.alias}.detail` })}
          </div>
        }
        open={isOpen}
        onOk={() => form.submit()}
        onCancel={onClose}
        okText={intl.formatMessage({ id: 'common.confirm' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
        style={{ minWidth: '60%' }}
      >
        <FormWrap form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            rules={ValidateLibrary().required}
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `${props.alias}.name` })}
              </span>
            }
            name={'name'}
            className="w-100 mb-0"
          >
            <CustomInput placeholder={intl.formatMessage({ id: `${props.alias}.name` })} />
          </Form.Item>
          <Form.Item
            label={
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-3">
                {intl.formatMessage({ id: `${props.alias}.des` })}
              </span>
            }
            name={'description'}
            className="w-100 mb-4"
          >
            <CustomArea placeholder={intl.formatMessage({ id: `${props.alias}.des` })} />
          </Form.Item>
        </FormWrap>
      </Modal>
    </>
  );
};

export default CreateModal;
