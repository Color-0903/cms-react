import { Col } from 'antd';
import IconSVG from '../icons/icons';

interface Props<T = any> {
  children: /* String | JSX.Element | Function; */ any;
  isShowClose?: boolean;
  className?: string;
  onDelete: () => void;
}

export const LessonElement = ({ children, isShowClose, className, onDelete }: Props) => {
  return (
    <Col span={6} className={`${className} gutter-row position-relative mt-16`}>
      {children}
      {!!isShowClose && (
        <span
          className="position-absolute translate-middle rounded-circle p-1 pointer z-999 bg-FFFFFF top-0"
          style={{ left: '96%' }}
          onClick={onDelete}
        >
          <IconSVG type="lesson-close"></IconSVG>
        </span>
      )}
    </Col>
  );
};
