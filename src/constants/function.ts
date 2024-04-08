import dayjs, { Dayjs } from 'dayjs';

export function handleInputChangeUpperCase(e: any) {
  e.target.value = e.target.value.toUpperCase();
}

export const formatPhoneNumberInput = (e: any) => {
  const input = e.target;
  const cleanedValue = input.value.replace(/\D/g, '');
  let cursorPosition = input.selectionStart;
  let formattedValue = '';
  for (let i = 0; i < cleanedValue.length; i++) {
    if (i === 4 || i === 7) {
      formattedValue += ' ';
      if (e?.nativeEvent?.inputType !== 'deleteContentBackward' && input.value.length === cursorPosition) {
        cursorPosition += 1;
      }
    }
    formattedValue += cleanedValue[i];
  }

  console.log(cursorPosition);
  input.value = formattedValue;
  input.setSelectionRange(cursorPosition, cursorPosition);
};

export function generateRandomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const disabledFutureDate = (current: Dayjs | undefined) => {
  if (current) {
    const today = dayjs();
    return current && dayjs(current).isAfter(today, 'day');
  }
  return false;
};

export const disabledPastDate = (current: Dayjs | undefined) => {
  if (current) {
    const today = dayjs();
    return current && dayjs(current).isBefore(today, 'day');
  }
  return false;
};

export function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) {
    return '';
  }

  return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}
