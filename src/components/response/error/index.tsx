import { message } from 'antd';
import { IntlShape } from 'react-intl';

export function CustomHandleError(error: any, intl: IntlShape) {
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
}
