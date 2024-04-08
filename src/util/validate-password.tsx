import IconSVG from '../components/icons/icons';

export interface passwordInterface {
  pass: string;
  confirm: string;
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MIN_LENGH_REGEX = /^.{8,}$/;
export const CAPITAL_SPECIAL_REGEX = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/\\-])(?=.*[A-Z]).+$/;

export const renderRequiredPassword = (value: passwordInterface) => {
  return (
    <>
      <div>
        <IconSVG type={EMAIL_REGEX.test(value.pass) ? 'password-un-checked' : 'password-checked'} />
        <span className="color-585858 font-weight-400 font-base font-size-14" style={{ marginLeft: '8px' }}>
          メール、名前等含めないで下さい
        </span>
      </div>
      <div className="mt-11">
        <IconSVG type={!MIN_LENGH_REGEX.test(value.pass) ? 'password-un-checked' : 'password-checked'} />
        <span className="color-585858 font-weight-400 font-base font-size-14" style={{ marginLeft: '8px' }}>
          8文字以上
        </span>
      </div>
      <div className="mt-11">
        <IconSVG type={!CAPITAL_SPECIAL_REGEX.test(value.pass) ? 'password-un-checked' : 'password-checked'} />
        <span className="color-585858 font-weight-400 font-base font-size-14" style={{ marginLeft: '8px' }}>
          大文字と特殊文字を含めて入力して下さい
        </span>
      </div>
      <div className="mt-11">
        <IconSVG type={value.pass === value.confirm ? 'password-checked' : 'password-un-checked'} />
        <span className="color-585858 font-weight-400 font-base font-size-14" style={{ marginLeft: '8px' }}>
          パスワードが合っています
        </span>
      </div>
    </>
  );
};
