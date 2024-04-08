import { Form, FormProps, Radio } from 'antd';
import { Children, ReactNode, useState } from 'react';
type LayoutType = Parameters<typeof Form>[0]['layout'];

function FormWrap(props: FormProps & { children: ReactNode }) {
  const [formLayout, setFormLayout] = useState<LayoutType>(props.layout || 'horizontal');

  const formItemLayout = formLayout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } } : null;

  return (
    <Form
      {...formItemLayout}
      layout={formLayout}
      form={props.form}
      // initialValues={{ layout: formLayout }}
      // style={{ maxWidth: formLayout === 'inline' ? 'none' : '600' }}
      {...props}
    >
      {/* <Form.Item label="Form Layout" name="layout">
        <Radio.Group value={formLayout}>
          <Radio.Button value="horizontal">Horizontal</Radio.Button>
          <Radio.Button value="vertical">Vertical</Radio.Button>
          <Radio.Button value="inline">Inline</Radio.Button>
        </Radio.Group>
      </Form.Item> */}
      {props.children}
    </Form>
  );
}

export default FormWrap;
