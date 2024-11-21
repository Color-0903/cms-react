import { WechatOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Form, message, Modal, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { notifyApi } from '../../apis';
import { CreateNotifyDto, CreateNotifyDtoTypeEnum } from '../../apis/client-axios';
import { ValidateLibrary } from '../../validate';
import CustomButton from '../buttons/CustomButton';
import FormWrap from '../FormWrap';
import CustomInput from '../input/CustomInput';

const { Text } = Typography;
// call when UI view support button
const SupportRouter = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const CreateNotify = useMutation((dto: CreateNotifyDto) => notifyApi.notifyControllerCreate(dto), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.createSuccess` }));
    },
  });

  useEffect(() => {
    form.resetFields();
  }, []);

  const onFinish = (value: any) => {
    const params = {
      ...value,
      type: CreateNotifyDtoTypeEnum.Support,
    };
    CreateNotify.mutate(params);
    setOpen(false);
  };

  return (
    <>
      <div>
        <CustomButton
          onClick={() => setOpen(true)}
          className="position-absolute z-3 shadow"
          shape="circle"
          icon={<WechatOutlined style={{ fontSize: '30px' }} />}
          style={{ bottom: '34px', right: '34px', width: '68px', height: '68px' }}
        ></CustomButton>
        <Modal
          title="Gửi yêu cầu hỗ trợ"
          open={open}
          onOk={form.submit}
          onCancel={() => setOpen(false)}
          okText="Gửi"
          cancelText="Hủy"
        >
          <FormWrap form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">Tiêu đề</span>}
              name={'title'}
              className="col-12 mb-0"
              required
              rules={ValidateLibrary().required}
            >
              <CustomInput placeholder="Tiêu đề" />
            </Form.Item>
            <Form.Item
              label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">Nội dung</span>}
              name={'content'}
              className="col-12 mb-0 mt-4"
              required
              rules={ValidateLibrary().required}
            >
              <TextArea rows={4} placeholder="Nội dung yêu cầu" />
            </Form.Item>
            <div className="text-center">
              <Text type="secondary" className="font-size-11 ">
                (Bạn có thể gửi kèm thông tin liên hệ vào nội dung nếu cần nhận phản hồi từ chúng tôi!)
              </Text>
            </div>
          </FormWrap>
        </Modal>
      </div>
      <Outlet />
    </>
  );
};

export default SupportRouter;
