import { Button, ButtonProps, Pagination, Row, Table } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import './index.scss';

function SaveButton(props: ButtonProps) {
  return (
    <Button icon={<SaveOutlined />} type="primary" {...props}>
      Lưu
    </Button>
  );
}

export default SaveButton;
