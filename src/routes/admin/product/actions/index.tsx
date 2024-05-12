import { CloudUploadOutlined, SyncOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Carousel, Form, Spin, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, categoryApi, colorApi, productApi, sizeApi } from '../../../../apis';
import { CreateProductDto, DeleteFileDto, UpdateProductDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomArea from '../../../../components/input/CustomArea';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import CustomSwitch from '../../../../components/switch/CustomSwitch';
import { FORMAT_DATE } from '../../../../constants/common';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [assetSelect, setAssetSelect] = useState<{ id: string; source: string } | undefined>(undefined);

  const { data: dataProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: [QUERY_DETAIL_PRODUCT],
    queryFn: () => productApi.productControllerGetById(id as string),
    onSuccess: ({ data }: any) => {
      form.setFieldsValue({
        ...data,
        status: +data.status,
        categories: data?.categories?.map((item: any) => item?.id),
        colors: data?.colors?.map((item: any) => item?.id),
        sizes: data?.sizes?.map((item: any) => item?.id),
        createdOnDate: moment(data?.createdOnDate).format(FORMAT_DATE),
        price_in: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price_in),
        price_out: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price_out),
        price_view: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price_view),
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
        helper.showSuccessMessage(ActionUser.CREATE, intl);
        navigate(-1);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const { mutate: Update, isLoading: isUpdate } = useMutation(
    (dto: UpdateProductDto) => productApi.productControllerUpdate(id as string, dto),
    {
      onSuccess: (data: any) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
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
          const lastValue = form.getFieldValue('assets') ?? [];
          form.setFieldValue('assets', [...lastValue, data]);
        } else {
          const assets = !!assetSelect
            ? [...dataProduct?.data?.assets.filter((item: any) => item?.id !== assetSelect?.id), data]
            : [...dataProduct?.data?.assets, data];
          await DeleteFile({
            id: dataProduct?.data?.id,
            oldSource: dataProduct?.data?.source,
            updateFor: {
              id: dataProduct?.data?.id,
              table: 'product',
              assets,
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
      onSuccess: () => {
        form.resetFields();
        queryClient.invalidateQueries([QUERY_DETAIL_PRODUCT]);
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

  const handleChangPrice = (field: string, value: number | string) => {
    const priceViewR = value.toString().replace(/[\s.₫]/g, '');
    form.setFieldValue(field, Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(+priceViewR));
    if (field !== 'price_out') return;
    const salseOff = form.getFieldValue('sale_off');
    const price = +priceViewR - (+salseOff * +priceViewR) / 100;
    form.setFieldValue('price_view', Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(+price));
  };

  const handelChangeSale = (value: number) => {
    const priceV = form
      .getFieldValue('price_out')
      .toString()
      .replace(/[\s.₫]/g, '');
    const price = +priceV - (+value * +priceV) / 100;
    form.setFieldValue('price_view', Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(+price));
  };

  const handleOnFinish = (values: any) => {
    const params = {
      ...values,
      assets: form.getFieldValue('assets'),
      categories: values?.categories?.map((item: string) => {
        return { id: item };
      }),
      sizes: values?.sizes?.map((item: string) => {
        return { id: item };
      }),
      colors: values?.colors?.map((item: string) => {
        return { id: item };
      }),
      price_in: values?.price_in.toString().replace(/[\s.₫]/g, ''),
      price_out: values?.price_out.toString().replace(/[\s.₫]/g, ''),
      price_view: values?.price_view.toString().replace(/[\s.₫]/g, ''),
    };
    if (!id) {
      Create(params);
    } else {
      Update(params);
    }
  };

  return (
    <Spin spinning={isLoadingUploadFile || isCreate || (!!id && isLoadingProduct)}>
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
                  !!form.getFieldValue('assets')?.length ? (
                    <>
                      <Carousel arrows infinite={false} autoplay className="bg-secondary rounded">
                        {form.getFieldValue('assets')?.map((asset: any) => {
                          return (
                            <div className="w-100 position-relative">
                              <CustomImage
                                src={asset ? helper.getSourceFile(asset?.source) : '/assets/images/default-product.jpg'}
                                alt="avatar"
                              />
                            </div>
                          );
                        })}
                      </Carousel>
                      {form.getFieldValue('assets')?.length < 4 && (
                        <div className="text-center mt-1" onClick={() => setAssetSelect(undefined)}>
                          <Upload showUploadList={false} customRequest={customRequest}>
                            <Button
                              icon={<CloudUploadOutlined className="font-size-18 color-0d6efd" />}
                              className="rounded-circle"
                            ></Button>
                          </Upload>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-100 position-relative">
                      <CustomImage src={'/assets/images/default-product.jpg'} alt="avatar" />
                      <div className="text-center mt-1">
                        <Upload showUploadList={false} customRequest={customRequest}>
                          <Button
                            icon={<CloudUploadOutlined className="font-size-18 color-0d6efd" />}
                            className="rounded-circle"
                          ></Button>
                        </Upload>
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    <Carousel arrows infinite={false} autoplay className="bg-secondary rounded">
                      {!!dataProduct?.data?.assets?.length ? (
                        dataProduct?.data?.assets?.map((asset: any) => {
                          return (
                            <div className="w-100 position-relative">
                              <CustomImage
                                src={
                                  asset?.source
                                    ? helper.getSourceFile(asset?.source)
                                    : '/assets/images/default-product.jpg'
                                }
                                alt="avatar"
                              />
                              <div className="position-absolute top-50 start-50 translate-middle opacity-75">
                                <Upload showUploadList={false} customRequest={customRequest}>
                                  <Button
                                    onClick={() => setAssetSelect(asset)}
                                    icon={<SyncOutlined className="font-size-18 color-0d6efd" />}
                                    className="rounded-circle"
                                  ></Button>
                                </Upload>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-100 position-relative">
                          <CustomImage src={'/assets/images/default-product.jpg'} alt="avatar" />
                        </div>
                      )}
                    </Carousel>

                    {dataProduct?.data?.assets?.length < 4 && (
                      <div className="text-center mt-1" onClick={() => setAssetSelect(undefined)}>
                        <Upload showUploadList={false} customRequest={customRequest}>
                          <Button
                            icon={<CloudUploadOutlined className="font-size-18 color-0d6efd" />}
                            className="rounded-circle"
                          ></Button>
                        </Upload>
                      </div>
                    )}
                  </>
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
                          label: intl.formatMessage({ id: 'product.status.true' }),
                        },
                        {
                          value: 0,
                          label: intl.formatMessage({ id: 'product.status.false' }),
                        },
                      ]}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-12">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.price_in' })} (đ)
                      </span>
                    }
                    name={'price_in'}
                    className="col-6 mb-0"
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'product.price_in' })}
                      onChange={(e) => handleChangPrice('price_in', e?.target?.value?.trim())}
                    />
                  </Form.Item>
                  <Form.Item
                    rules={ValidateLibrary().required}
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.price_out' })} (đ)
                      </span>
                    }
                    name={'price_out'}
                    className="col-6 mb-0"
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({ id: 'product.price_out' })}
                      onChange={(e) => handleChangPrice('price_out', e?.target?.value?.trim())}
                    />
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
                      onChange={(e) => handelChangeSale(+e?.target?.value)}
                      placeholder={intl.formatMessage({ id: 'product.sale_off' })}
                      type="number"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'product.price_view' })} (đ)
                      </span>
                    }
                    name={'price_view'}
                    className="col-6 mb-0"
                  >
                    <CustomInput placeholder={intl.formatMessage({ id: 'product.price_view' })} disabled={true} />
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
                    name={'createdOnDate'}
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
                    rules={ValidateLibrary().required}
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
