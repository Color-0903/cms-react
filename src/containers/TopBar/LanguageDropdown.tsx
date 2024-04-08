import { Popover } from 'antd';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import './flag/sprite-flags-24x24.css';
import languageData from './languageData';
import { switchLanguage } from '../../store/settingSlice';
import { memo } from 'react';
import { TAB_SIZE } from '../../constants/ThemeSetting';

interface LanguageItemProps {
  language: {
    icon: string;
    name: string;
  };
  onClick?: Function;
}
const LanguageItem = ({ language, onClick }: LanguageItemProps) => {
  const { width } = useSelector((state: RootState) => state.setting);

  return (
    <div className="d-flex cursor-pointer" key={JSON.stringify(language)} onClick={() => onClick && onClick(language)}>
      <i className={`my-auto flag flag-24 flag-${language.icon}`} />
      <span className="ms-1 font-base">{width < TAB_SIZE ? '' : language.name}</span>
    </div>
  );
};

const LanguageDropdown = () => {
  const { locale } = useSelector((state: RootState) => state.setting);
  const dispatch = useAppDispatch();

  const languageMenu = () => (
    <>
      {languageData.map((language) => (
        <LanguageItem language={language} key={language.locale} onClick={() => dispatch(switchLanguage(language))} />
      ))}
    </>
  );

  return (
    <>
      <Popover overlayClassName="gx-popover-horizantal" placement="bottom" content={languageMenu()} trigger="click">
        <LanguageItem language={locale} />
      </Popover>
    </>
  );
};

export default memo(LanguageDropdown);
