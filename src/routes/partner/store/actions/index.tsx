import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Divider, Form, Spin, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, roleApi } from '../../../../apis';
import { Cadastral, StoreTypeEnum } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomDatePicker from '../../../../components/dateTime/CustomRangePicker';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import { STORE_FOLDER } from '../../../../constants/common';
import { UploadDto } from '../../../../constants/dto';
import { QUERY_LIST_ROLE } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { regexImage } from '../../../../util/regex';
import { UseDistrict, UseProvince, UseWard } from '../../../../hooks/useCadastral';

const StoreAction = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<any>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteAdmin, setIsDeleteAdmin] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [avatar, setAvatar] = useState<{ id: string; source: string } | undefined>(undefined);
  const [cadastral, setCadastral] = useState<
    { province: string | undefined; district: string | undefined; ward: string | undefined } | undefined
  >({
    province: 'c92a251d-9461-47ce-acd0-e06dd3f0dea9',
    district: '83f6cd6d-9403-43b7-9b36-56fafdd28f7c',
    ward: undefined,
  });

  const useProvince = UseProvince();
  const useDistrict = UseDistrict(cadastral?.province);
  const useWard = UseWard(cadastral?.district);

  // const { data: dataAdmin, isFetching: loadingData } = useQuery(
  //   [QUERY_ADMIN_DETAIL, id],
  //   () => adminApi.administratorControllerGetByUserId(id as string),
  //   {
  //     onError: (error) => { },
  //     onSuccess: (response) => {
  //       form.setFieldsValue({
  //         ...response.data,
  //         roleIds: response.data?.user?.roles?.map((item: any) => item.id) ?? []
  //       });
  //       if (response.data.avatar) {
  //         setAvatar({
  //           ...response.data.avatar
  //         })
  //       }
  //     },
  //     enabled: !!id,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const { data: listRole, isLoading } = useQuery({
    queryKey: [QUERY_LIST_ROLE],
    queryFn: () => roleApi.roleControllerGet(1, 0),
    enabled: !!id,
    staleTime: 1000,
  });

  const { mutate: UploadFile, isLoading: isLoadingUploadFile } = useMutation(
    (dto: UploadDto) => assetsApi.assetControllerUploadFile(dto.file, undefined),
    {
      onSuccess: (data: any) => {
        setAvatar({
          id: data?.data?.id,
          source: data?.data?.source as string,
        });
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      helper.showErroMessage('validate.not.support', intl);
      return;
    }
    UploadFile({ file, assetFolderId: undefined, s3FilePath: STORE_FOLDER.avatar });
  };

  const handleOnFinish = (values: any) => {
    console.log(values);
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

  return (
    <Spin spinning={false}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="font-weight-700 font-size-18 font-base">{intl.formatMessage({ id: 'store.create' })}</span>
          </div>
          <div className="d-flex mt-35">
            <div className="w-30">
              <div className="width-354 height-354">
                <CustomImage src={helper.getSourceFile(avatar?.source)} alt=".." />
                <div className="mt-12 text-center">
                  <Upload showUploadList={false} customRequest={customRequest}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </div>
            </div>
            <div className="flex-grow-1" style={{ maxWidth: '980px', marginLeft: '124px' }}>
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
                    name={'firstName'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.type' })}
                      </span>
                    }
                    name={'gender'}
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
                        {intl.formatMessage({ id: 'store.phone' })}
                      </span>
                    }
                    name={'phoneNumber'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.time' })}
                      </span>
                    }
                    // name={'dob'}
                    className="col-6 mb-0"
                  >
                    <CustomDatePicker />
                  </Form.Item>
                  {/*  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.email' })}
                      </span>
                    }
                    name={'emailAddress'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item> */}
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'store.province' })}
                      </span>
                    }
                    name={'province'}
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
                    name={'district'}
                    className="col-6 mb-0"
                    initialValue={cadastral?.district}
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
                    name={'ward'}
                    className="col-6 mb-0"
                    initialValue={cadastral?.ward}
                  >
                    <CustomSelect
                      options={useWard?.data?.map((ward: any) => {
                        return { label: ward?.name, value: ward?.id };
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
                  <Form.Item label={intl.formatMessage({ id: 'store.address' })} name={'detail'}>
                    <TextArea rows={2} placeholder={intl.formatMessage({ id: 'store.address' })} />
                  </Form.Item>
                </div>
                <Divider type="horizontal" className="mt-32 mb-0" />
              </div>
              <div className="mt-20">
                <Form.Item label={intl.formatMessage({ id: 'store.des' })} name={'note'}>
                  <TextArea rows={3} placeholder={intl.formatMessage({ id: 'store.des' })} />
                </Form.Item>
              </div>
              <div className="mt-48">
                <div className="d-flex justify-content-end mt-32">
                  {id ? (
                    <div className="d-flex gap-2">
                      <CustomButton onClick={() => setIsShowModal({ id: id, name: 'roleName' })}>
                        {intl.formatMessage({ id: 'role.delete' })}
                      </CustomButton>
                      <CustomButton type="primary" onClick={() => form.submit()}>
                        {intl.formatMessage({ id: 'role.edit' })}
                      </CustomButton>
                    </div>
                  ) : (
                    <CustomButton onClick={() => form.submit()}>
                      {intl.formatMessage({
                        id: 'role.create',
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
