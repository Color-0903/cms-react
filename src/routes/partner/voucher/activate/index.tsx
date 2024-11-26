import { SearchOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Divider, Form, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomButton from '../../../../components/buttons/CustomButton';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import { RootState } from '../../../../store';
import { ValidateLibrary } from '../../../../validate';
import { voucherApi } from '../../../../apis';
import { ActivateVoucherDto } from '../../../../apis/client-axios';

const VoucherActivate = () => {
  const intl = useIntl();
  const [form] = useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams('code');
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [code, setCode] = useState<string | undefined>(undefined);

  const UpdateVoucher = useMutation((dto: ActivateVoucherDto) => voucherApi.voucherControllerActivate(dto), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.useSuccess` }));
      form.resetFields();
    },
  });

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setCode(code);
    }
  }, [searchParams]);

  const onFinish = (value: any) => {
    if (value?.code) {
      setCode(value?.code);
    }
  };

  const onSubmit = () => {
    if (code) {
      UpdateVoucher.mutate({ code });
    }
    setCode(undefined);
  };

  return (
    <Card className="h-100">
      <div className="d-flex align-item-center flex-column mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="mx-auto">
          <span className="font-weight-700 font-size-24 font-base color-0d6efd" style={{ letterSpacing: '2px' }}>
            {intl.formatMessage({ id: 'voucher.activate' })}
          </span>
        </div>
        <Divider></Divider>
        <div className="mx-auto mt-4" style={{ maxWidth: '28%' }}>
          <CustomImage preview={false} src={'/assets/images/activate.png'} alt=".." />
        </div>
        <FormWrap className="mt-4" form={form} layout="vertical" onFinish={onFinish}>
          <div className="row">
            <Form.Item name={'code'} className="col-12 mb-0" required rules={ValidateLibrary().required}>
              <CustomInput
                placeholder={intl.formatMessage({ id: 'voucher.code' })}
                prefix={<SearchOutlined />}
                style={{ borderRadius: '32px', paddingLeft: '25px' }}
                autoFocus
              />
            </Form.Item>
          </div>
        </FormWrap>
        <div className="d-flex justify-content-center gap-4 mt-4">
          <Button className="bg-D9D9D9 color-1A1A1A width-240 height-42 " onClick={() => form.resetFields()}>
            {intl.formatMessage({ id: 'common.refesh' })}
          </Button>
          <CustomButton onClick={() => form.submit()} type="primary">
            <span className="text-white">{intl.formatMessage({ id: 'voucher.activate' })}</span>
          </CustomButton>
        </div>
      </div>
      <ConfirmModel
        visible={!!code}
        onSubmit={onSubmit}
        onClose={() => {
          setCode(undefined);
        }}
      />
    </Card>
  );
};

export default VoucherActivate;
