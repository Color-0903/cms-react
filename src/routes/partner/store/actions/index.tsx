import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Button, Card, Col, Divider, Form, message, Row, Spin, TimePicker, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, storeApi } from '../../../../apis';
import { Asset, CreateStoreDto, StoreTypeEnum, UpdateStoreDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomDatePicker from '../../../../components/range/CustomRangePicker';
import CustomSelect from '../../../../components/select/CustomSelect';
import { FORMAT_TIME } from '../../../../constants/common';
import { UploadDto } from '../../../../constants/dto';
import { UseDistrict, UseProvince, UseWard } from '../../../../hooks/useCadastral';
import { QUERY_LIST_STORE } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { ValidateLibrary } from '../../../../validate';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const limitedImage = 4;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const StoreAction = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [cadastral, setCadastral] = useState<{
    province: string | undefined;
    district: string | undefined;
    ward: string | undefined;
  }>({
    province: 'c92a251d-9461-47ce-acd0-e06dd3f0dea9',
    district: '83f6cd6d-9403-43b7-9b36-56fafdd28f7c',
    ward: '957a733e-82c8-47df-84ad-06850ce81498',
  });
  const [fileView, setFileView] = useState<{ preview: string; file: File | Asset | undefined } | undefined>(undefined);
  const [files, setFiles] = useState<
    { previews: UploadFile[] | undefined; fileUploads: File[] | undefined } | undefined
  >(undefined);
  const [openTime, setOpenTime] = useState<{ am: any | undefined; pm: any | undefined }>({
    am: undefined,
    pm: undefined,
  });

  const useProvince = UseProvince();
  const useDistrict = UseDistrict(cadastral?.province);
  const useWard = UseWard(cadastral?.district);

  const { data: storeById, isLoading } = useQuery({
    queryKey: [QUERY_LIST_STORE, id],
    queryFn: () => storeApi.storeControllerGetById(id as string),
    enabled: !!id,
    staleTime: 1000,
  });

  useEffect(() => {
    if (id && storeById?.data) {
      form.setFieldsValue({ ...storeById?.data });
      if (storeById?.data?.asset) {
        setFileView({
          preview: helper.getSourceFile(storeById?.data?.asset?.source),
          file: { ...storeById?.data?.asset, uid: storeById?.data?.asset?.id } as any,
        });
      }
      if (storeById?.data?.assets) {
        const previews = storeById?.data?.assets?.map((file) => {
          return { ...file, preview: helper.getSourceFile(file?.source), uid: file?.id, id: file?.id };
        }) as any;
        setFiles({ previews, fileUploads: previews });
      }
      if (!!(storeById?.data?.openTime as any)?.am?.length) {
        const [from, to] = (storeById?.data?.openTime as any)?.am?.split(' - ');

        form.setFieldValue('am', [dayjs(from, FORMAT_TIME), dayjs(to, FORMAT_TIME)]);
        setOpenTime((prev) => {
          return {
            ...prev,
            am: [from, to],
          };
        });
      }
      if (!!(storeById?.data?.openTime as any)?.pm?.length) {
        const [from, to] = (storeById?.data?.openTime as any)?.pm?.split(' - ');

        form.setFieldValue('pm', [dayjs(from, FORMAT_TIME), dayjs(to, FORMAT_TIME)]);
        setOpenTime((prev) => {
          return {
            ...prev,
            pm: [from, to],
          };
        });
      }
      if (storeById?.data?.provinceId) {
        setCadastral((prev) => {
          return { ...prev, province: storeById?.data?.provinceId as string };
        });
      }

      if (storeById?.data?.districtId) {
        setCadastral((prev) => {
          return { ...prev, district: storeById?.data?.districtId as string };
        });
      }

      if (storeById?.data?.wardId) {
        setCadastral((prev) => {
          return { ...prev, ward: storeById?.data?.wardId as string };
        });
      }
    }
  }, [storeById]);

  useEffect(() => {
    form.resetFields();
  }, []);

  const CreateStore = useMutation((dto: CreateStoreDto) => storeApi.storeControllerCreate(dto), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.createSuccess` }));
      navigate(-1);
    },
  });

  const UpdateStore = useMutation((dto: UpdateStoreDto) => storeApi.storeControllerUpdate(id as string, dto), {
    onSuccess: (data: any) => {
      form.resetFields();
      message.success(intl.formatMessage({ id: `common.updateSuccess` }));
      navigate(-1);
    },
  });

  const UploadFile = useMutation(
    (dto: UploadDto) => assetsApi.assetControllerUploadFile(dto.file, undefined).then((res) => res?.data),
    {
      onSuccess: (data: any) => {
        return data;
        // setAvatar({
        //   id: data?.data?.id,
        //   source: data?.data?.source as string,
        // });
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    // if (!file || !regexImage.test(file.name)) {
    //   helper.showErroMessage('validate.not.support', intl);
    //   return;
    // }
    if (!fileView) {
      setFileView((prev) => {
        return {
          file: file,
          preview: prev?.preview as string,
        };
      });
      return;
    }

    setFiles((prev) => {
      const uploadFile = !!prev?.fileUploads?.length ? [...prev?.fileUploads, file] : [file];
      return {
        ...(prev as any),
        fileUploads: uploadFile as any,
      };
    });
  };

  const handleChangeCadastral = (id: string, type: number) => {
    if (!cadastral) return;

    if (type == 2) {
      setCadastral({
        ...cadastral,
        district: id,
        ward: undefined,
      });
      form.setFieldValue('wardId', undefined);
    }
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList }) => {
    if (!fileView) {
      const file = fileList[0];
      const fileToBase = await getBase64(file?.originFileObj as FileType);
      setFileView((prev) => {
        return {
          file: prev?.file as any,
          preview: fileToBase as string,
        };
      });
      return;
    }

    const listFile = [...(files?.previews ?? []), ...fileList];
    if (listFile?.length > limitedImage) {
      message.error(intl.formatMessage({ id: `validate.limited` }));
      return;
    }
    const file = await Promise.all(
      listFile
        .filter((file) => file.uid !== (fileView?.file as any)?.uid)
        .map(async (file) => {
          const fileToBase = !(file as any)?.preview
            ? await getBase64(file?.originFileObj as FileType)
            : (file as any)?.preview;
          return {
            ...file,
            preview: fileToBase,
          };
        })
    );
    setFiles((prev) => {
      return {
        ...(prev as any),
        previews: file as any,
      };
    });
  };

  const handleSelect = (file: any) => {
    setFiles((prev) => {
      const findFileUpload = files?.fileUploads?.find((item: any) => item?.uid == (file as any)?.uid);
      if (findFileUpload) {
        const previewFile = { ...fileView?.file, preview: fileView?.preview };
        setFileView({
          file: findFileUpload,
          preview: file?.preview as string,
        });
        return {
          previews: [...(prev?.previews ?? []), previewFile as any]?.filter(
            (item: any) => item?.uid != (findFileUpload as any)?.uid
          ),
          fileUploads: [...(prev?.fileUploads ?? []), fileView?.file as any]?.filter(
            (item: any) => item?.uid != (findFileUpload as any)?.uid
          ),
        };
      }
      return prev;
    });
  };

  const handleRemoveFile = (file: any) => {
    setFiles((prev) => {
      const findFileUpload = files?.fileUploads?.find((item: any) => item?.uid == (file as any)?.uid);
      if (findFileUpload) {
        return {
          previews: prev?.previews?.filter((item: any) => item?.uid != (findFileUpload as any)?.uid),
          fileUploads: prev?.fileUploads?.filter((item: any) => item?.uid != (findFileUpload as any)?.uid),
        };
      }
      return prev;
    });
  };

  const handleOnFinish = async (values: any) => {
    const am = !!openTime?.am?.length ? openTime?.am.join(' - ') : '';
    const pm = !!openTime?.pm?.length ? openTime?.pm.join(' - ') : '';
    let params: any = storeById?.data ?? undefined;

    params = {
      ...values,
      openTime: {
        am,
        pm,
      },
    };

    let assetPromisse, assetsPromisse;
    if (fileView && (fileView?.file as any)?.uid && !(fileView?.file as any)?.id) {
      assetPromisse = UploadFile.mutateAsync({ file: fileView?.file as File });
    }
    if (files && !!files?.fileUploads?.length) {
      const uploads = files?.fileUploads
        ?.filter((file) => !(file as any)?.id)
        ?.map((file) => UploadFile.mutateAsync({ file: file as File }));
      assetsPromisse = Promise.all(uploads);
    }
    const [asset, assets] = await Promise.all([assetPromisse, assetsPromisse]);

    const ids = files?.fileUploads?.map((file) => (file as any)?.id) ?? [];
    const oldAssets = files?.fileUploads?.filter((asset) => ids?.includes((asset as any)?.id)) ?? [];
    params = {
      ...params,
      asset: asset ?? fileView?.file,
      assets: assets ? [...assets, ...oldAssets] : files?.fileUploads,
    };

    !id ? CreateStore.mutate(params) : UpdateStore.mutate(params);
  };

  return (
    <Spin spinning={(!!id && isLoading) || UploadFile.isLoading || CreateStore.isLoading || UpdateStore.isLoading}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="font-weight-700 font-size-18 font-base">{intl.formatMessage({ id: 'store.create' })}</span>
          </div>
          <div className="d-flex mt-35" style={{ gap: '16px' }}>
            <div className="w-30">
              <div>
                <CustomImage src={fileView?.preview} alt=".." style={{ minHeight: '200px' }} />
                <div className="mt-12 text-center">
                  <Row gutter={16} className="mb-3">
                    {files?.previews?.map((file) => {
                      return (
                        <Col className="gutter-row" span={6}>
                          <CustomImage
                            preview={false}
                            src={file?.preview}
                            alt=".."
                            onClick={() => handleSelect(file)}
                          />
                          <div
                            className="position-absolute end-0 cursor-pointer"
                            style={{ top: '-12px' }}
                            onClick={() => handleRemoveFile(file)}
                          >
                            <CloseOutlined />
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                  <Upload
                    disabled={(files?.previews ?? [])?.length >= limitedImage}
                    customRequest={customRequest}
                    multiple={true}
                    accept=".png,.jpg,.jpeg"
                    listType="picture-card"
                    fileList={[]}
                    onChange={handleChange}
                  >
                    <Button
                      style={{ border: 0, background: 'none', gap: '4px' }}
                      className="d-flex align-items-center justify-content-between"
                      disabled={(files?.previews ?? [])?.length >= limitedImage}
                    >
                      <PlusOutlined />
                      <div>Upload</div>
                    </Button>
                  </Upload>
                </div>
              </div>
            </div>
            <div className="flex-grow-1" /* style={{ maxWidth: '980px', marginLeft: '124px' }} */>
              <span className="font-weight-700 font-size-16 font-base" style={{ borderBottom: '1px solid #1A1A1A' }}>
                {intl.formatMessage({ id: 'store.info' })}
              </span>
              <div className="mt-32">
                <div className="row">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.name' })}
                      </span>
                    }
                    name={'name'}
                    className="col-6 mb-0"
                    required
                    rules={ValidateLibrary().required}
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.type' })}
                      </span>
                    }
                    name={'type'}
                    className="col-6 mb-0"
                    initialValue={StoreTypeEnum.Coffe}
                  >
                    <CustomSelect
                      options={Object.values(StoreTypeEnum).map((item) => {
                        return {
                          value: item,
                          label: item,
                        };
                      })}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.am' })}
                      </span>
                    }
                    name={'am'}
                    className="col-6 mb-0"
                  >
                    <CustomDatePicker
                      onChange={(_, date) => {
                        const am = !_ ? undefined : date;
                        setOpenTime({ ...openTime, am });
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.pm' })}
                      </span>
                    }
                    name={'pm'}
                    className="col-6 mb-0"
                  >
                    <CustomDatePicker
                      onChange={(_, date) => {
                        const pm = !_ ? undefined : date;
                        setOpenTime({ ...openTime, pm });
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.province' })}
                      </span>
                    }
                    name={'provinceId'}
                    className="col-6 mb-0"
                    initialValue={cadastral?.province}
                  >
                    <CustomSelect
                      // maxTagCount={2}
                      // mode="multiple"
                      disabled={true}
                      options={useProvince?.data?.map((province: any) => {
                        return { label: province?.name, value: province?.id };
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.district' })}
                      </span>
                    }
                    name={'districtId'}
                    className="col-6 mb-0"
                    initialValue={cadastral?.district}
                    required
                    rules={ValidateLibrary().required}
                  >
                    <CustomSelect
                      onChange={(value) => handleChangeCadastral(value as string, 2)}
                      options={useDistrict?.data?.map((district: any) => {
                        return { label: district?.name, value: district?.id };
                      })}
                      // maxTagCount={2}
                      // mode="multiple"
                      // options={listRole?.data.content?.map((role: any) => {
                      //   return { label: role?.name, value: role?.id };
                      // })}
                    />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.ward' })}
                      </span>
                    }
                    name={'wardId'}
                    className="col-6 mb-0"
                    initialValue={cadastral?.ward}
                    required
                    rules={ValidateLibrary().required}
                  >
                    <CustomSelect
                      options={useWard?.data?.map((ward: any) => {
                        return { label: ward?.name, value: ward?.id };
                      })}
                      onSelect={(value: string) => setCadastral({ ...cadastral, ward: value } as any)}
                      // maxTagCount={2}
                      // mode="multiple"
                      // options={listRole?.data.content?.map((role: any) => {
                      //   return { label: role?.name, value: role?.id };
                      // })}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.phone' })}
                      </span>
                    }
                    required
                    name={'phone'}
                    rules={ValidateLibrary().phone}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.address' })}
                      </span>
                    }
                    name={'detail'}
                    required
                    rules={ValidateLibrary().required}
                  >
                    <TextArea rows={2} placeholder={intl.formatMessage({ id: 'store.address' })} />
                  </Form.Item>
                </div>
                <Divider type="horizontal" className="mt-32 mb-0" />
              </div>
              <div className="mt-20">
                <Form.Item
                  label={
                    <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                      {intl.formatMessage({ id: 'store.des' })}
                    </span>
                  }
                  name={'description'}
                  required
                  rules={ValidateLibrary().required}
                >
                  <TextArea rows={3} placeholder={intl.formatMessage({ id: 'store.des' })} />
                </Form.Item>
              </div>
              <div className="mt-48">
                <div className="d-flex justify-content-end mt-32">
                  {id ? (
                    <CustomButton onClick={() => form.submit()}>
                      {intl.formatMessage({ id: 'common.edit' })}
                    </CustomButton>
                  ) : (
                    <CustomButton
                      onClick={() => form.submit()}
                      loading={UploadFile.isLoading || CreateStore.isLoading || UpdateStore.isLoading}
                    >
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

export default StoreAction;
