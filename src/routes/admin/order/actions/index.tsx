import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, SelectProps, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../../../../apis';
import { UpdateOrderDto, UpdateOrderDtoStatusEnum } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomArea from '../../../../components/input/CustomArea';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../../constants/common';
import { orderStatus } from '../../../../constants/constant';
import { QUERY_DETAIL_ORDER } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { ActionUser } from '../../../../constants/enum';

const ActionOrder = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<FormInstance>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [assetSelect, setAssetSelect] = useState<{ id: string; source: string } | undefined>(undefined);

  const { data: data, isLoading: isLoading } = useQuery({
    queryKey: [QUERY_DETAIL_ORDER],
    queryFn: () => orderApi.orderControllerGetById(id as string),
    onSuccess: ({ data }: any) => {
      form.setFieldsValue({
        ...data,
        createdOnDate: moment(data?.createdOnDate).format(FORMAT_DATE),
        user: data?.user?.identifier,
        total: helper.showVnd(data?.total),
        detail: data?.order_detail?.map((item: any) => {
          return {
            value: item?.id,
            label: `${item?.color ?? ''} x ${item?.size} x ${item?.quantity}`,
          };
        }),
      });
    },
    enabled: !!id,
    staleTime: 1000,
  });

  const { mutate: Update, isLoading: isUpdate } = useMutation(
    (dto: { id: string; dto: UpdateOrderDto }) => orderApi.orderControllerUpdate(dto.id as string, dto.dto),
    {
      onSuccess: (data: any) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
        queryClient.invalidateQueries([QUERY_DETAIL_ORDER]);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const handleOnFinish = (values: any) => {
    if (id) {
      Update({
        id,
        dto: {
          status: values?.status,
        },
      });
    }
  };

  const selectOption = Object.keys(orderStatus).map((item: any) => {
    return {
      value: item,
      label: intl.formatMessage({ id: `order.${item}` }),
      disabled: orderStatus[`${data?.data?.status as UpdateOrderDtoStatusEnum}`]?.includes(item),
    };
  }) as SelectProps['options'];

  return (
    <Spin spinning={!!id && isLoading}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish} className="pb-5">
          <div>
            <span className="font-weight-700 font-size-18 font-base">{intl.formatMessage({ id: 'order.detail' })}</span>
          </div>
          <div className="d-flex mt-35 gap-3">
            <div className="w-30" style={{ maxWidth: '250px' }}>
              <div className="w-100">
                <div style={{ maxWidth: '250px' }}>
                  <div className="w-100">
                    <CustomImage
                      src={
                        form.getFieldValue('asset')
                          ? helper.getSourceFile(form.getFieldValue('asset'))
                          : '/assets/images/default-product.jpg'
                      }
                      alt="avatar"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow-1" style={{ maxWidth: '980px' }}>
              <div>
                <div className="row">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.name' })}
                      </span>
                    }
                    name={'name'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'order.name' })} disabled />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.status' })}
                      </span>
                    }
                    name={'status'}
                    className="col-6 mb-0"
                    initialValue={1}
                  >
                    <CustomSelect defaultActiveFirstOption={true} options={selectOption}></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.product' })}
                      </span>
                    }
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({ id: 'order.product' })}
                      options={form.getFieldValue('detail')}
                    ></CustomSelect>
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.created' })}
                      </span>
                    }
                    name={'createdOnDate'}
                    className="col-6 mb-0"
                    initialValue={1}
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'order.created' })} disabled />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.user' })}
                      </span>
                    }
                    name={'user'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'order.user' })} disabled />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.phone' })}
                      </span>
                    }
                    name={'phone'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'order.phone' })} disabled />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.total' })} (đ)
                      </span>
                    }
                    name={'total'}
                    className="mb-0"
                    initialValue={1}
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'order.total' })} disabled />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.address' })}
                      </span>
                    }
                    name={'address'}
                    className="col-12 mb-0"
                  >
                    <CustomArea rows={2} placeholder={intl.formatMessage({ id: 'order.address' })} disabled />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'order.des' })}
                      </span>
                    }
                    name={'note'}
                    className="col-12 mb-0"
                  >
                    <CustomArea rows={3} placeholder={intl.formatMessage({ id: 'order.des' })} disabled />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-12">
                <div className="d-flex align-items-end justify-content-end gap-4 mt-12">
                  <CustomButton onClick={() => form.submit()}>
                    {intl.formatMessage({ id: id ? 'common.edit' : 'common.create' })}
                  </CustomButton>
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

export default ActionOrder;
