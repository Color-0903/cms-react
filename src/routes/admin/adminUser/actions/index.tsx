import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Divider, Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi, roleApi } from '../../../../apis';
import { CreateAdminDto, UpdateAdminDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { CustomHandleError } from '../../../../components/response/error';
import { CustomHandleSuccess } from '../../../../components/response/success';
import CustomSelect from '../../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../../constants/common';
import { ActionUser } from '../../../../constants/enum';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { QUERY_ADMIN_DETAIL, QUERY_LIST_ADMIN, QUERY_LIST_ROLE, QUERY_LIST_USER } from '../../../../util/contanst';
import { helper } from '../../../../util/helper';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';

const n = (key: keyof CreateAdminDto) => {
  return key;
};
const CreateAdmin = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<any>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteAdmin, setIsDeleteAdmin] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();

  const { data: dataAdmin, isFetching: loadingData } = useQuery(
    [QUERY_ADMIN_DETAIL, id],
    () => adminApi.administratorControllerGetByUserId(id as string),
    {
      onError: (error) => { },
      onSuccess: (response) => {
        // form.setFieldsValue({
        //   city: response.data.city,
        //   emailAddress: response.data.emailAddress,
        //   dob: response.data.dob ? dayjs(response.data.dob, FORMAT_DATE) : null,
        //   phoneNumber: response.data.phoneNumber ? formatPhoneNumber(response.data.phoneNumber) : null,
        //   roleIds: response.data.user.roles.map((item: any) => item.id),
        // });
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
      CustomHandleSuccess(ActionUser.DELETE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: adminCreate,
    status: statusCreateAdmin,
    isLoading: createLoading,
  } = useMutation((createCustomer: CreateAdminDto) => adminApi.administratorControllerCreate(createCustomer), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_LIST_ADMIN]);
      CustomHandleSuccess(ActionUser.CREATE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: adminUpdate,
    status: statusUpdateAdmin,
    isLoading: updateLoading,
  } = useMutation((updateAdmin: UpdateAdminDto) => adminApi.administratorControllerUpdate(id as string, updateAdmin), {
    onSuccess: ({ data }) => {
      CustomHandleSuccess(ActionUser.EDIT, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

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
                <CustomImage src={helper.getSourceFile(undefined)} alt="avatar" />
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
                          value: 'Male',
                          label: 'Male',
                        },
                        {
                          value: 'Femal',
                          label: 'Femal',
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
                    name={'dob'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect mode='multiple' />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{intl.formatMessage({ id: 'common.field.dob' })}</span>}
                    name={'dob'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
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

export default CreateAdmin;
