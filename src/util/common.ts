import { message } from 'antd';
import { IntlShape } from 'react-intl';
import { ActionUser } from '../constants/enum';

const actions = ['create', 'update', 'delete', 'read'];
const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1);

export const helper = {
  generatePermission: (value: string) => actions.map((action) => action + capitalize(value)), // return ["readRole", "createRole", "updateRo...]

  showDetail: (id: string) => `detail/${id}`,

  getSourceFile: (source?: string) => (source ? process.env.REACT_APP_URL_IMG_S3 + source : ''),

  convertByteToMb: (bytes: number) => Math.ceil(bytes / (1024 * 1024)),

  showErroMessage: (error: any, intl: IntlShape) => {
    if (error.statusCode === 500 || error.statusCode === 501) {
      message.error(intl.formatMessage({ id: 'error.500' }));
    } else if (error.statusCode === 403) {
      message.error(intl.formatMessage({ id: 'error.403' }));
    } else if (error.statusCode === 401) {
      message.error(intl.formatMessage({ id: 'error.401' }));
    } else {
      const errorMessage = (error.message || '').replace(/\s/g, '_').toUpperCase();
      if (errorMessage) {
        message.error(intl.formatMessage({ id: `error.${errorMessage}` }));
      } else {
        message.error(intl.formatMessage({ id: `common.message.err` }));
      }
    }
  },

  showSuccessMessage: (type: ActionUser, intl: IntlShape) => {
    if (type === ActionUser.CREATE) {
      message.success(intl.formatMessage({ id: `common.createSuccess` }));
    } else if (type === ActionUser.EDIT) {
      message.success(intl.formatMessage({ id: `common.updateSuccess` }));
    } else if (type === ActionUser.DELETE) {
      message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
    } else if (type === ActionUser.LOCK) {
      message.success(intl.formatMessage({ id: `common.lockSuccess` }));
    }
  },
};
