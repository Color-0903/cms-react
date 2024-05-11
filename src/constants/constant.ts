export const MANAGEMENT_TYPE = {
  ADMIN: '/admin/',
};

// key and array disable key
export const orderStatus = {
  PENDING: ['RETURN', 'COMPLETED'],
  ACCEPT: ['PENDING', 'RETURN'],
  SHIPPING: ['CANCEL', 'ACCEPT', 'PENDING', 'RETURN'],
  COMPLETED: ['PENDING', 'ACCEPT', 'SHIPPING', 'CANCEL'],
  CANCEL: ['RETURN', 'SHIPPING', 'COMPLETED'],
  RETURN: ['PENDING', 'ACCEPT', 'SHIPPING', 'CANCEL', 'COMPLETED'],
};
