import { Avatar, Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomButton from '../buttons/CustomButton';
import { helper } from '../../util/common';

export interface AccountInterface {
  userId: string;
  src: string | undefined;
  name: string | undefined;
  email: string | undefined;
}
interface ConfirmDeleteModalProps {
  name: string;
  content?: string;
  visible: boolean;
  account?: AccountInterface | null;
  confirmBtnText?: string;
  onSubmit: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
  const { name, content, visible, account, confirmBtnText, onSubmit, onClose } = props;
  const intl = useIntl();

  return (
    <Modal
      className="confirm-delete-modal height-451 width-566 mt-12"
      open={visible}
      centered
      closable={true}
      maskClosable={false}
      footer={null}
      onCancel={onClose}
    >
      <div className="title">
        <span className="color-000000 font-weight-500 font-size-16 d-block text-center font-base">{name}</span>
      </div>
      {account && (
        <div>
          <div className="d-flex justify-content-center align-items-center gap-2 mt-19">
            <Avatar size={72} src={helper.getSourceFile(account.src)} />
            <div className="d-flex flex-column">
              <span className="color-000000 font-weight-700 font-size-18 font-base">{account?.name ?? ''}</span>
              <span className="color-D82C1C font-weight-400 font-size-16 font-base">{account?.email}</span>
            </div>
          </div>
        </div>
      )}
      <div className="content  text-center mt-3">
        <span className="text-lowercase color-3D3D3D font-weight-500 font-size-14 font-base">{content}</span>
      </div>
      <div className="action">
        <div className="mt-4 d-flex justify-content-between">
          <CustomButton className="bg-D9D9D9 color-1A1A1A width-240" onClick={onClose}>
            キャンセル
          </CustomButton>
          <CustomButton className="bg-D82C1C color-FFFFFF width-240" onClick={onSubmit}>
            {confirmBtnText ?? '提出する'}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};
