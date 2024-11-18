import { InfoCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Divider, Form, message, Spin, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { storeApi, voucherApi } from '../../../../apis';
import { CreateVoucherDto, UpdateVoucherDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomDatePicker from '../../../../components/date/DatePickerCustome';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../../constants/common';
import { GenerateCode } from '../../../../constants/function';
import { UseStore } from '../../../../hooks/useStore';
import { RootState } from '../../../../store';
import { QUERY_LIST_STORE } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { ValidateLibrary } from '../../../../validate';

const voucherStatus = [
  { label: 'Có thể sử dụng', value: 1 },
  { label: 'Ngưng sử dụng', value: 0 },
];

const VoucherAction = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();

  const useStore = UseStore(authUser?.id);

  const { data: storeById, isLoading } = useQuery({
    queryKey: [QUERY_LIST_STORE, id],
    queryFn: () => storeApi.storeControllerGetById(id as string),
    enabled: !!id,
    staleTime: 1000,
  });

  const CreateVoucher = useMutation((dto: CreateVoucherDto) => voucherApi.voucherControllerCreate(dto), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.createSuccess` }));
      navigate(-1);
    },
  });

  const UpdateVoucher = useMutation((dto: UpdateVoucherDto) => voucherApi.voucherControllerUpdate(id as string, dto), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.updateSuccess` }));
      navigate(-1);
    },
  });

  useEffect(() => {
    if (useStore?.data?.content) {
      form.setFieldValue('storeId', useStore?.data?.content?.[0]?.id);
    }
  }, [useStore]);

  useEffect(() => {
    if (id && storeById?.data) {
      form.setFieldsValue({ ...storeById?.data });
    }
  }, [storeById]);

  const handleOnFinish = async (values: any) => {
    const params = {
      ...values,
      releaseAt: dayjs(values?.releaseAt).format(FORMAT_DATE),
      maxDiscount: +helper.vndToNumber(values?.maxDiscount),
      minInvoice: +helper.vndToNumber(values?.minInvoice),
      quantity: +helper.vndToNumber(values?.quantity),
    };

    console.log(params);

    !id ? CreateVoucher.mutate(params) : UpdateVoucher.mutate(params);
  };

  return (
    <Spin spinning={(!!id && isLoading) || CreateVoucher.isLoading || useStore.isLoading}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="font-weight-700 font-size-18 font-base">
              {intl.formatMessage({ id: 'voucher.create' })}
            </span>
          </div>
          <div className="d-flex mt-35" style={{ gap: '16px' }}>
            <div className="w-30">
              <div>
                <CustomImage src={'/assets/images/gift.jpg'} alt=".." />
              </div>
            </div>
            <div className="flex-grow-1">
              <span className="font-weight-700 font-size-16 font-base" style={{ borderBottom: '1px solid #1A1A1A' }}>
                {intl.formatMessage({ id: 'voucher.info' })}
              </span>
              <div className="mt-32">
                <div className="row">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.name' })}
                      </span>
                    }
                    name={'name'}
                    className="col-6 mb-0"
                    required
                    rules={ValidateLibrary().required}
                    initialValue={`vouher-${GenerateCode(6)}`}
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.status' })}
                      </span>
                    }
                    required
                    name={'isEnable'}
                    className="col-6 mb-0"
                    initialValue={1}
                  >
                    <CustomSelect options={voucherStatus}></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <div className="d-flex justify-content-end">
                        <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                          {intl.formatMessage({ id: 'voucher.createdAt' })}
                        </span>
                        <Tooltip
                          className="ml-5"
                          placement="top"
                          title={'Ngày phát hành voucher cho người dùng'}
                          arrow={true}
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </div>
                    }
                    name={'releaseAt'}
                    className="col-6 mb-0"
                    required
                    initialValue={dayjs()}
                  >
                    <CustomDatePicker
                      format={{
                        format: FORMAT_DATE,
                        type: 'mask',
                      }}
                      placeHolder={intl.formatMessage({ id: 'voucher.createdAt' })}
                      // onChange={onChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.expired' })}
                      </span>
                    }
                    name={'expired'}
                    className="col-6 mb-0"
                  >
                    <CustomDatePicker
                      format={{
                        format: FORMAT_DATE,
                        type: 'mask',
                      }}
                      placeHolder={intl.formatMessage({ id: 'voucher.expired' })}
                      // onChange={onChange}
                    />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.discount' })}
                      </span>
                    }
                    name={'discount'}
                    className="col-6 mb-0"
                    required
                    rules={ValidateLibrary().percent}
                    initialValue={10}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'voucher.discount' })}
                      type="number"
                      min={1}
                      max={100}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.maxDiscount' })}
                      </span>
                    }
                    name={'maxDiscount'}
                    className="col-6 mb-0"
                    required
                    rules={ValidateLibrary().positiveInteger}
                    initialValue={helper.showVnd(20000)}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'voucher.maxDiscount' })}
                      onChange={(e) => {
                        const value = helper.vndToNumber(e?.target?.value);
                        const vnd = helper.showVnd(+value).toString();
                        form.setFieldValue('maxDiscount', vnd);
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.minInvoice' })}
                      </span>
                    }
                    name={'minInvoice'}
                    className="col-6 mb-0"
                    required
                    rules={ValidateLibrary().positiveInteger}
                    initialValue={helper.showVnd(250000)}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'voucher.minInvoice' })}
                      onChange={(e) => {
                        const value = helper.vndToNumber(e?.target?.value);
                        const vnd = helper.showVnd(+value).toString();
                        form.setFieldValue('minInvoice', vnd);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.store' })}
                      </span>
                    }
                    required
                    name={'storeId'}
                    className="col-6 mb-0"
                    initialValue={undefined}
                  >
                    <CustomSelect
                      options={useStore?.data?.content?.map((item) => {
                        return {
                          label: item?.name,
                          value: item?.id,
                        };
                      })}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.quantity' })}
                      </span>
                    }
                    name={'quantity'}
                    className="col-6 mb-0"
                    required
                    rules={ValidateLibrary().positiveInteger}
                    initialValue={999}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'voucher.minInvoice' })}
                      onChange={(e) => {
                        const value = helper.vndToNumber(e?.target?.value);
                        const vnd = helper.showVnd(+value).toString();
                        form.setFieldValue('quantity', vnd);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    className="col-6 mb-0"
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.used' })}
                      </span>
                    }
                    name={'used'}
                    required
                    rules={ValidateLibrary().required}
                    initialValue={0}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'voucher.used' })}
                      type="number"
                      min={1}
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'voucher.des' })}
                      </span>
                    }
                    name={'description'}
                  >
                    <TextArea rows={2} placeholder={intl.formatMessage({ id: 'voucher.des' })} />
                  </Form.Item>
                </div>
                <Divider type="horizontal" className="mt-32 mb-0" />
              </div>
              <div className="mt-48">
                <div className="d-flex justify-content-end mt-32">
                  {id ? (
                    <CustomButton onClick={() => form.submit()}>
                      {intl.formatMessage({ id: 'common.edit' })}
                    </CustomButton>
                  ) : (
                    <CustomButton onClick={() => form.submit()}>
                      {intl.formatMessage({
                        id: 'common.create',
                      })}
                    </CustomButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FormWrap>
        <ConfirmModel
          visible={!!isShowModal}
          onSubmit={() => {}}
          onClose={() => {
            setIsShowModal(undefined);
          }}
        />
      </Card>
    </Spin>
  );
};

export default VoucherAction;
