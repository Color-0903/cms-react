import { toast } from 'react-toastify';

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

const Notification = (values: string, type: NotificationType) => {
  type === NotificationType.SUCCESS
    ? toast.success(values, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        // progress: undefined,
      })
    : toast.error(values, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        // progress: undefined,
      });
  return <></>;
};

export default Notification;
