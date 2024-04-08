import { Form, FormInstance, Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import CustomArea from '../input/CustomArea';
import CustomInput from '../input/CustomInput';

interface AddMedicineModalProps {
  form?: FormInstance;
  visible: boolean;
  onSubmit: Function;
  onClose: () => void;
}

export const AddMedicineModal = (props: AddMedicineModalProps) => {
  const { form, visible, onSubmit, onClose } = props;
  const intl = useIntl();

  return (
    <Modal className="modal-add-medicine" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="modal-add-medicine__content">
        <div className="modal-add-medicine__content__title">
          {intl.formatMessage({
            id: 'medicine.order.modal.create.title',
          })}
        </div>
        <div className="modal-add-medicine__content__rows">
          <Form.Item
            name="name"
            className="name"
            label={intl.formatMessage({
              id: 'medicine.order.modal.create.name',
            })}
          >
            <CustomInput className="flex-reverse" prefix={<IconSVG type="search" />} />
          </Form.Item>
          <Form.Item
            name="quantity"
            className="quantity"
            label={intl.formatMessage({
              id: 'medicine.order.modal.create.quantity',
            })}
          >
            <CustomInput />
          </Form.Item>
        </div>
        <Form.Item
          name="feature"
          label={intl.formatMessage({
            id: 'medicine.modal.create.feature',
          })}
        >
          <CustomArea rows={6} style={{ resize: 'none' }} />
        </Form.Item>
        <div className="modal-add-medicine__content__action">
          <CustomButton className="button-submit" onClick={() => onSubmit({ data: 'ok' })}>
            {intl.formatMessage({
              id: 'medicine.order.modal.create.button.create',
            })}
          </CustomButton>
          <CustomButton className="button-cancel" onClick={onClose}>
            {intl.formatMessage({
              id: 'medicine.order.modal.create.button.cancel',
            })}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};
