import { message } from 'antd';
import { IntlShape } from 'react-intl';
import { ActionUser } from '../../../constants/enum';

export function CustomHandleSuccess(type: ActionUser, intl: IntlShape) {
  if (type === ActionUser.CREATE) {
    message.success(intl.formatMessage({ id: `common.createSuccess` }));
  } else if (type === ActionUser.EDIT) {
    message.success(intl.formatMessage({ id: `common.updateSuccess` }));
  } else if (type === ActionUser.DELETE) {
    message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
  } else if (type === ActionUser.LOCK) {
    message.success(intl.formatMessage({ id: `common.lockSuccess` }));
  }
}
