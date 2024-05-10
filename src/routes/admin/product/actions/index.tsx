import { CloudUploadOutlined, SyncOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Carousel, Form, Spin, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInstance } from 'antd/lib/form';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { assetsApi, categoryApi, colorApi, productApi, sizeApi } from '../../../../apis';
import { CreateProductDto, DeleteFileDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomArea from '../../../../components/input/CustomArea';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import CustomSwitch from '../../../../components/switch/CustomSwitch';
import { ActionUser } from '../../../../constants/enum';
import {
  QUERY_DETAIL_PRODUCT,
  QUERY_LIST_CATEGPRY,
  QUERY_LIST_COLOR,
  QUERY_LIST_SIZE,
} from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { regexImage } from '../../../../util/regex';
import { ValidateLibrary } from '../../../../validate';

const ActionProduct = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<FormInstance>();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [assetSelect, setAssetSelect] = useState<{ id: string; source: string } | undefined>(undefined);

  const { data: data, isLoading: isLoadingProduct } = useQuery({
    queryKey: [QUERY_DETAIL_PRODUCT],
    queryFn: () => productApi.productControllerGetById(id as string),
    onSuccess: ({ data }: any) => {
      console.log(data);
      form.setFieldsValue({
        ...data,
        status: +data.status,
        categories: data?.categories.map((item: any) => item?.id),
        colors: data?.colors.map((item: any) => item?.id),
        sizes: data?.sizes.map((item: any) => item?.id),
      });
    },
    enabled: !!id,
    staleTime: 1000,
  });

  const { data: colorData, isLoading: isLoadingColor } = useQuery({
    queryKey: [QUERY_LIST_COLOR],
    queryFn: () => colorApi.colorControllerGetAll(1),
    enabled: true,
    staleTime: 1000,
  });

  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: [QUERY_LIST_CATEGPRY],
    queryFn: () => categoryApi.categoryControllerGetAll(1),
    enabled: true,
    staleTime: 1000,
  });

  const { data: sizeData, isLoading: isLoadingSize } = useQuery({
    queryKey: [QUERY_LIST_SIZE],
    queryFn: () => sizeApi.sizeControllerGetAll(1),
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: Create, isLoading: isCreate } = useMutation(
    (dto: CreateProductDto) => productApi.productControllerCreate(dto),
    {
      onSuccess: (data: any) => {
        // queryClient.invalidateQueries([QUERY_PROFILE]);
        helper.showSuccessMessage(ActionUser.CREATE, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const { mutate: UploadFile, isLoading: isLoadingUploadFile } = useMutation(
    (file: File) => assetsApi.assetControllerUploadFile(file),
    {
      onSuccess: async ({ data }: any) => {
        if (!id) {
          form.setFieldValue('assets', data);
        } else {
          await DeleteFile({
            id: assetSelect?.id,
            oldSource: assetSelect?.source,
            updateFor: {
              id: '',
              table: 'product',
              assets: [],
            },
          });
        }
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
    }
  );

  const { mutate: DeleteFile, isLoading: isLoadingDeleteFile } = useMutation(
    (dto: DeleteFileDto) => assetsApi.assetControllerDelete(dto),
    {
      onSuccess: async ({ data }: any) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || regexImage.test(file.name)) {
      helper.showErroMessage('validate.not.support', intl);
      return;
    }
    UploadFile(file);
  };

  const handleOnFinish = (values: any) => {
    if (!id) {
      Create({
        ...values,
        assets: [form.getFieldValue('assets')],
        categories: values?.categories?.map((item: string) => {
          return { id: item };
        }),
        sizes: values?.sizes?.map((item: string) => {
          return { id: item };
        }),
        colors: values?.colors?.map((item: string) => {
          return { id: item };
        }),
      });
    }
  };

  return (
    <Spin spinning={isLoadingUploadFile || isCreate}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish} className="pb-5">
          <div>
            <span className="font-weight-700 font-size-18 font-base">
              {intl.formatMessage({ id: 'product.title' })}
            </span>
          </div>
          <div className="d-flex mt-35 gap-3">
            <div className="w-30" style={{ maxWidth: '250px' }}>
              <div className="w-100">
                {!id ? (
                  <div className="w-100 position-relative">
                    <CustomImage
                      src={
                        form.getFieldValue('assets')
                          ? helper.getSourceFile(form.getFieldValue('assets')?.source)
                          : '/assets/images/default-product.jpg'
                      }
                      alt="avatar"
                    />
                    <div className="text-center mt-1">
                      <Upload showUploadList={false} customRequest={customRequest}>
                        <Button
                          icon={<CloudUploadOutlined className="font-size-18 color-0d6efd" />}
                          className="rounded-circle"
                        ></Button>
                      </Upload>
                    </div>
                  </div>
                ) : (
                  <Carousel arrows infinite={false} autoplay>
                    <div className="w-100 position-relative">
                      {/* <CustomImage
                      src={avatar?.source ? helper.getSourceFile(avatar?.source) : '/assets/images/default-product.jpg'}
                      alt="avatar"
                    /> */}
                      <div className="position-absolute top-50 start-50 translate-middle opacity-75">
                        <Upload showUploadList={false} customRequest={customRequest}>
                          <Button
                            icon={<SyncOutlined className="font-size-18 color-0d6efd" />}
                            className="rounded-circle"
                          ></Button>
                        </Upload>
                      </div>
                    </div>
                  </Carousel>
                )}
              </div>
            </div>
            <div className="flex-grow-1" style={{ maxWidth: '980px' }}>
              <div>
                <div className="row">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.name' })}
                      </span>
                    }
                    rules={ValidateLibrary().required}
                    name={'name'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'product.name' })} />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.status' })}
                      </span>
                    }
                    name={'status'}
                    className="col-6 mb-0"
                    initialValue={1}
                  >
                    <CustomSelect
                      options={[
                        {
                          value: 1,
                          label: intl.formatMessage({ id: 'product.still' }),
                        },
                        {
                          value: 0,
                          label: intl.formatMessage({ id: 'product.unStill' }),
                        },
                      ]}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.price_in' })}
                      </span>
                    }
                    name={'price_in'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'product.price_in' })} />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.price_out' })}
                      </span>
                    }
                    name={'price_out'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'product.price_out' })} />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.sale_off' })} (%)
                      </span>
                    }
                    name={'sale_off'}
                    className="col-6 mb-0"
                    initialValue={0}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'product.sale_off' })}
                      type="number"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.price_view' })}
                      </span>
                    }
                    name={'price_view'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'product.price_view' })} />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.category' })}
                      </span>
                    }
                    name={'categories'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({ id: 'product.category' })}
                      allowClear
                      mode="multiple"
                      maxTagCount={2}
                      options={categoryData?.data?.content?.map((item: any) => {
                        return {
                          value: item?.id,
                          label: item?.name,
                        };
                      })}
                    ></CustomSelect>
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.size' })}
                      </span>
                    }
                    name={'sizes'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({ id: 'product.size' })}
                      allowClear
                      mode="multiple"
                      maxTagCount={2}
                      options={sizeData?.data?.content?.map((item: any) => {
                        return {
                          value: item?.id,
                          label: item?.name,
                        };
                      })}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.color' })}
                      </span>
                    }
                    name={'colors'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({ id: 'product.color' })}
                      allowClear
                      mode="multiple"
                      maxTagCount={2}
                      options={colorData?.data?.content?.map((item: any) => {
                        return {
                          value: item?.id,
                          label: item?.name,
                        };
                      })}
                    ></CustomSelect>
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.created' })}
                      </span>
                    }
                    name={'created'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'product.created' })} disabled={true} />
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.des' })}
                      </span>
                    }
                    name={'description'}
                    className="col-12 mb-0"
                  >
                    <CustomArea rows={3} placeholder={intl.formatMessage({ id: 'product.des' })} />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-12">
                <div className="d-flex align-items-end justify-content-end gap-4 mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.isHidden' })}
                      </span>
                    }
                    name={'isHidden'}
                    className="mb-0 text-right"
                    initialValue={true}
                  >
                    <CustomSwitch />
                  </Form.Item>
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

export default ActionProduct;
