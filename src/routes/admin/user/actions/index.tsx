import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Divider, Form, Spin, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi, assetsApi, roleApi } from '../../../../apis';
import { CreateAdminDto, UpdateAdminDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomDatePicker from '../../../../components/dateTime/CustomDatePicker';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import { STORE_FOLDER } from '../../../../constants/common';
import { UploadDto } from '../../../../constants/dto';
import { ActionUser } from '../../../../constants/enum';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { QUERY_ADMIN_DETAIL, QUERY_LIST_ADMIN, QUERY_LIST_ROLE, QUERY_LIST_USER } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { regexImage } from '../../../../util/regex';

const UserAction = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<any>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteAdmin, setIsDeleteAdmin] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [avatar, setAvatar] = useState<{ id: string, source: string } | undefined>(undefined);

  const { data: dataAdmin, isFetching: loadingData } = useQuery(
    [QUERY_ADMIN_DETAIL, id],
    () => adminApi.administratorControllerGetByUserId(id as string),
    {
      onError: (error) => { },
      onSuccess: (response) => {
        form.setFieldsValue({
          ...response.data,
          roleIds: response.data?.user?.roles?.map(item => item.id) ?? []
        });
        if (response.data.avatar) {
          setAvatar({
            ...response.data.avatar
          })
        }
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: listRole, isLoading } = useQuery({
    queryKey: [QUERY_LIST_ROLE],
    queryFn: () => roleApi.roleControllerGet(1, 0),
    enabled: true,
    staleTime: 1000,
  });

  const {
    mutate: deleteAdmin,
    isLoading: deleteLoading,
  } = useMutation((id: string) => adminApi.administratorControllerDelete(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_LIST_USER]);
      helper.showSuccessMessage(ActionUser.DELETE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
    },
    onError: (error: any) => {
      helper.showErroMessage(error.response.data, intl);
    },
  });

  const {
    mutate: adminCreate, isLoading: createLoading } = useMutation((createCustomer: CreateAdminDto) => adminApi.administratorControllerCreate(createCustomer), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_LIST_ADMIN]);
      helper.showSuccessMessage(ActionUser.CREATE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
    },
    onError: (error: any) => {
      helper.showErroMessage(error.response.data, intl);
    },
  });

  const {
    mutate: adminUpdate, isLoading: updateLoading } = useMutation((updateAdmin: UpdateAdminDto) => adminApi.administratorControllerUpdate(id as string, updateAdmin), {
    onSuccess: ({ data }) => {
      helper.showSuccessMessage(ActionUser.EDIT, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
    },
    onError: (error: any) => {
      helper.showErroMessage(error.response.data, intl);
    },
  });

  const { mutate: UploadFile, isLoading: isLoadingUploadFile } = useMutation(
    (dto: UploadDto) => assetsApi.assetControllerUploadFile(dto.file, undefined, dto.s3FilePath),
    {
      onSuccess: (data: any) => {
        setAvatar({
          id: data?.data?.id,
          source: data?.data?.source as string,
        });
      }
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

  const handleOnFinish = (values: CreateAdminDto) => {
    console.log(values);

  };

  const handleDelete = () => {
    if (isDeleteAdmin && id) {
      deleteAdmin(id);
    }
  };

  return (
    <Spin spinning={loadingData}>
      <Card >
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="font-weight-700 font-size-18 font-base">{intl.formatMessage({ id: 'admin.detail.title' })}</span>
          </div>
          <div className="d-flex mt-35">
            <div className="w-30">
              <div className="width-354 height-354">
                <CustomImage src={helper.getSourceFile(avatar?.source)} alt="avatar" />
                <div className='mt-12 text-center'>
                  <Upload showUploadList={false} customRequest={customRequest}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </div>
            </div>
            <div className="flex-grow-1" style={{ maxWidth: '980px', marginLeft: '124px' }}>
              <span
                className="font-weight-700 font-size-16 font-base"
                style={{ borderBottom: '4px solid #1A1A1A' }}
              >
                {intl.formatMessage({ id: 'admin.detail.info' })}
              </span>
              <div className="mt-32">
                <div className="row">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.fullName' })}</span>}
                    name={'firstName'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.gender' })}</span>}
                    name={'gender'}
                    className="col-6 mb-0">
                    <CustomSelect
                      options={[
                        {
                          value: 'MALE',
                          label: intl.formatMessage({ id: 'common.field.MALE' }),
                        },
                        {
                          value: 'FEMALE',
                          label: intl.formatMessage({ id: 'common.field.FEMALE' }),
                        },
                      ]}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.phone' })}</span>}
                    name={'phoneNumber'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.email' })}</span>}
                    name={'emailAddress'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.role' })}</span>}
                    name={'roleIds'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect maxTagCount={2} mode='multiple' options={listRole?.data.content?.map(role => { return { label: role.name, value: role.id } })} />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.dob' })}</span>}
                    // name={'dob'}
                    className="col-6 mb-0"
                  >
                    <CustomDatePicker />
                  </Form.Item>
                </div>
                <Divider type="horizontal" className="mt-32 mb-0" />
              </div>
              <div className="mt-20">
                <Form.Item label="Ghi chú" name={'note'}>
                  <TextArea rows={3} placeholder="Ghi chú" />
                </Form.Item>
              </div>
              <div className="mt-48">
                <div className="d-flex justify-content-end mt-32">
                  {id ? (
                    <div className="d-flex gap-2">
                      <CustomButton
                        onClick={() => setIsShowModal({ id: id, name: 'roleName' })}>
                        {intl.formatMessage({ id: 'role.delete' })}
                      </CustomButton>
                      <CustomButton
                        type='primary'
                        onClick={() => form.submit()}>
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
          onSubmit={handleDelete}
          onClose={() => {
            setIsShowModal(undefined);
          }}
        />
      </Card>
    </Spin >
  );
};

export default UserAction;
