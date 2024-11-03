import AppLocale from '../../lngProvider';
import Notification, { NotificationType } from '../notification';

export function CustomHandleError(error: any) {
  const locale = localStorage.getItem('locale') === 'en' ? 'en' : 'vi';
  const { messages } = AppLocale[locale] as any;

  const errMessage = messages[`error.${error.statusCode}`];

  if (error.statusCode === 404) {
    Notification(errMessage, NotificationType.ERROR);
  } else if (error.error === 403) {
    Notification(errMessage, NotificationType.ERROR);
  } else if (error.statusCode === 401) {
    Notification(errMessage, NotificationType.ERROR);
  } else if (error.statusCode === 409) {
    console.log('run me vo day r');
    Notification(errMessage, NotificationType.ERROR);
  } else {
    const errorMessage = (error.message || '').replace(/\s/g, '_').toUpperCase();
    const errorContent = messages[`error.${errorMessage}`]
      ? messages[`error.${errorMessage}`]
      : messages[`error.common`];

    if (errorContent) {
      Notification(errorContent, NotificationType.ERROR);
    } else {
      Notification(messages[`error.common`], NotificationType.ERROR);
    }
  }
}
