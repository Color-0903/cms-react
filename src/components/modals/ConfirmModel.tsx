import { Avatar, Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomButton from '../buttons/CustomButton';
import { helper } from '../../util/helper';
import { ReactNode } from 'react';

export interface AccountInterface {
  userId: string;
  src: string | undefined;
  name: string | undefined;
  email: string | undefined;
}
interface ConfirmModelProps {
  visible: boolean;
  account?: AccountInterface | null;
  onSubmit: () => void;
  onClose: () => void;
  subContent?: ReactNode;
}

export const ConfirmModel = (props: ConfirmModelProps) => {
  const { visible, account, onSubmit, onClose, subContent } = props;
  const intl = useIntl();

  return (
    <Modal
      className="custom-modal"
      open={visible}
      centered
      closable={true}
      maskClosable={false}
      footer={null}
      onCancel={onClose}
    >
      <div className="title">
        <span className="color-000000 font-weight-500 font-size-16 d-block text-center font-base">
          {intl.formatMessage({ id: 'common.confirm.title' })}
        </span>
      </div>
      {account && (
        <div>
          <div className="d-flex justify-content-center align-items-center gap-2 mt-32">
            <Avatar size={72} src={helper.getSourceFile(account.src)} />
            <div className="d-flex flex-column">
              <span className="color-000000 font-weight-700 font-size-18 font-base">{account?.name ?? ''}</span>
              <span className="color-D82C1C font-weight-400 font-size-16 font-base">{account?.email}</span>
            </div>
          </div>
        </div>
      )}
      <div className="content text-center mt-32">
        <span className="color-3D3D3D font-weight-500 font-size-14 font-base">
          {intl.formatMessage({ id: 'common.confirm.content' })}
        </span>
        {subContent}
      </div>
      <div>
        <div className="mt-32 d-flex justify-content-between gap-2">
          <CustomButton className="bg-D9D9D9 color-1A1A1A width-240 height-42 " onClick={onClose}>
            {intl.formatMessage({ id: 'common.cancel' })}
          </CustomButton>
          <CustomButton className="bg-D82C1C color-FFFFFF width-240 height-42 " onClick={onSubmit} type="primary">
            {intl.formatMessage({ id: 'common.confirm' })}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};
