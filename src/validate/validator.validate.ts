import * as _ from 'lodash';
import isEmail from 'validator/lib/isEmail';
type Option = {
  message: string;
  min?: number;
  max?: number;
};

type validateType = 'required' | 'email' | 'phone' | 'postCode' | 'password' | 'space';

type ValidatorOption = string | boolean | Option;
type Validators = { [key in validateType]?: ValidatorOption };

const regexPass = /^.{8,16}$/;
const spaceRegex = /\s+/;
const REGEX_PHONE_NUMBER = /^0[1-9][0-9]{8}$/;

const getMessage = (option: ValidatorOption): string => {
  return typeof option === 'object' ? option.message : (option as string);
};

const VALIDATOR: any = {
  required: (value: string | number | undefined | null, option: ValidatorOption) => {
    if (value === undefined || value === null || value.toString().trim() === '') {
      throw new Error(getMessage(option));
    }
    const type = typeof value;
    let isValid = true;
    if (type === 'string') {
      isValid = !!(value as string).trim();
    }

    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  password: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }

    const isValid = regexPass.test(value.trim());
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },

  space: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }
    if (spaceRegex.test(value)) {
      throw new Error(getMessage(option));
    }
  },

  email: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }
    const isValid = isEmail(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  phone: (value: string, option: ValidatorOption) => {
    const phoneNumber = value?.replace(/\s/g, '');
    if (!REGEX_PHONE_NUMBER.test(phoneNumber)) {
      throw new Error(getMessage(option));
    }
  },
};

export const _validator = (validators: Validators) => {
  return async (rule: any, text: string) => {
    _.map(validators, (options, type) => {
      options && VALIDATOR[type] && VALIDATOR[type](text, options);
    });
  };
};
