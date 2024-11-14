import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Button, Card, Col, Divider, Form, message, Row, Spin, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, roleApi, storeApi } from '../../../../apis';
import { CreateStoreDto, StoreTypeEnum } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomDatePicker from '../../../../components/dateTime/CustomRangePicker';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import { UploadDto } from '../../../../constants/dto';
import { UseDistrict, UseProvince, UseWard } from '../../../../hooks/useCadastral';
import { QUERY_LIST_ROLE } from '../../../../util/contanst';
import { ValidateLibrary } from '../../../../validate';
import moment from 'moment';
import { FORMAT_DATE, FORMAT_TIME } from '../../../../constants/common';

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
  const [avatar, setAvatar] = useState<{ id: string; source: string } | undefined>(undefined);
  const [cadastral, setCadastral] = useState<
    { province: string | undefined; district: string | undefined; ward: string | undefined } | undefined
  >({
    province: 'c92a251d-9461-47ce-acd0-e06dd3f0dea9',
    district: '83f6cd6d-9403-43b7-9b36-56fafdd28f7c',
    ward: '957a733e-82c8-47df-84ad-06850ce81498',
  });
  const [fileView, setFileView] = useState<{ preview: string; file: File | undefined } | undefined>(undefined);
  const [files, setFiles] = useState<
    { previews: UploadFile[] | undefined; fileUploads: File[] | undefined } | undefined
  >(undefined);

  const useProvince = UseProvince();
  const useDistrict = UseDistrict(cadastral?.province);
  const useWard = UseWard(cadastral?.district);

  const { data: listRole, isLoading } = useQuery({
    queryKey: [QUERY_LIST_ROLE],
    queryFn: () => roleApi.roleControllerGet(1, 0),
    enabled: !!id,
    staleTime: 1000,
  });

  const CreateStore = useMutation((dto: CreateStoreDto) => storeApi.storeControllerCreate(dto), {
    onSuccess: (data: any) => {
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

  const handleOnFinish = async (values: any) => {
    let prams = {
      ...values,
      openTime: {
        am: values?.am
          ? moment(values?.am[0]).format(FORMAT_TIME) + ' - ' + moment(values?.am[1]).format(FORMAT_TIME)
          : '',
        pm: values?.pm
          ? moment(values?.pm[0]).format(FORMAT_TIME) + ' - ' + moment(values?.pm[1]).format(FORMAT_TIME)
          : '',
      },
    };
    let assetPromisse, assetsPromisse;
    if (fileView && (fileView?.file as any)?.uid) {
      assetPromisse = UploadFile.mutateAsync({ file: fileView?.file as File });
    }
    if (files && !!files?.fileUploads?.length) {
      const uploads = files?.fileUploads?.map((file) => UploadFile.mutateAsync({ file: file as File }));
      assetsPromisse = Promise.all(uploads);
    }
    const [asset, assets] = await Promise.all([assetPromisse, assetsPromisse]);
    prams = {
      ...prams,
      asset,
      assets,
    };
    CreateStore.mutate(prams);
  };

  const handleChangeCadastral = (id: string, type: number) => {
    if (!cadastral) return;

    if (type == 2) {
      setCadastral({
        ...cadastral,
        district: id,
        ward: undefined,
      });
      form.setFieldValue('ward', undefined);
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
          const fileToBase = await getBase64(file?.originFileObj as FileType);
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

  return (
    <Spin spinning={false}>
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
                      onChange={(value) => {
                        const [from, to] = value || [undefined, undefined];
                        if (from && to) {
                          form.setFieldValue('am', [from, to]);
                        }
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
                      onChange={(value) => {
                        const [from, to] = value || [undefined, undefined];
                        if (from && to) {
                          form.setFieldValue('pm', [from, to]);
                        }
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
                    name={'phone'}
                    rules={ValidateLibrary().phone}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={intl.formatMessage({ id: 'store.address' })}
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
                  label={intl.formatMessage({ id: 'store.des' })}
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
                    <div className="d-flex gap-2">
                      <CustomButton onClick={() => setIsShowModal({ id: id, name: 'roleName' })}>
                        {intl.formatMessage({ id: 'common.delete' })}
                      </CustomButton>
                      <CustomButton type="primary" onClick={() => form.submit()}>
                        {intl.formatMessage({ id: 'common.edit' })}
                      </CustomButton>
                    </div>
                  ) : (
                    <CustomButton onClick={() => form.submit()} loading={UploadFile.isLoading || CreateStore.isLoading}>
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
