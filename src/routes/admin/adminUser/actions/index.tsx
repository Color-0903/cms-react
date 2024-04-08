import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi, customerApi, roleApi } from '../../../../apis';
import { CreateAdminDto, UpdateAdminDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { ActionUser, PERMISSIONS, Status } from '../../../../constants/enum';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import dayjs from 'dayjs';
import { FORMAT_DATE } from '../../../../constants/common';
import { ValidateLibrary } from '../../../../validate';
import { formatPhoneNumber, formatPhoneNumberInput } from '../../../../constants/function';
import { CustomHandleError } from '../../../../components/response/error';
import DatePickerCustom from '../../../../components/date/DatePickerCustome';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { QUERY_ADMIN_DETAIL, QUERY_LIST_ADMIN, QUERY_LIST_ROLE, QUERY_LIST_USER } from '../../../../util/contanst';
import { useForm } from 'antd/es/form/Form';
import CustomSelect from '../../../../components/select/CustomSelect';

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
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.SuperAdmin, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.SuperAdmin, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.SuperAdmin, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.SuperAdmin, authUser)),
      });
    }
  }, [authUser]);
  const { data: dataAdmin, isFetching: loadingData } = useQuery(
    [QUERY_ADMIN_DETAIL, id],
    () => adminApi.administratorControllerGetByUserId(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        form.setFieldsValue({
          // fullName: response.data.fullName,
          city: response.data.city,
          emailAddress: response.data.emailAddress,
          isActive: response.data.user.isActive ? 1 : 0,
          dob: response.data.dob ? dayjs(response.data.dob, FORMAT_DATE) : null,
          phoneNumber: response.data.phoneNumber ? formatPhoneNumber(response.data.phoneNumber) : null,
          roleIds: response.data.user.roles.map((item: any) => item.id),
        });
      },
      enabled: !!id && permission.read,
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
    status: statusDeleteCustomer,
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

  const onFinish = (values: CreateAdminDto) => {
    console.log(values);
    const dateOfBirth = values.dob ? dayjs(values.dob).format(FORMAT_DATE) : '';
    const isActive: number = +values.isActive;
    if (id) {
      adminUpdate({
        ...values,
        dob: dateOfBirth,
        isActive: isActive === 1,
      });
    } else {
      adminCreate({
        ...values,
        dob: dateOfBirth,
        isActive: isActive === 1,
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteAdmin && id) {
      deleteAdmin(id);
    }
    setIsDeleteAdmin(false);
  };

  useEffect(() => {
    if (!id) {
      form.setFieldValue('status', 1);
    }
  }, []);

  // @ts-ignore
  return (
    <Card id="create-customer-management">
      <Spin
        className="custom-spin"
        size="large"
        spinning={loadingData || createLoading || updateLoading || deleteLoading}
      >
        <div className="create-customer-header">
          <div className="create-customer-header__title">
            {id
              ? intl.formatMessage({
                  id: 'admin.edit.title',
                })
              : intl.formatMessage({
                  id: 'admin.create.title',
                })}
          </div>
        </div>

        <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-customer">
          <div className="customer-info">
            <div className="customer-info__header">
              <div className="customer-info__header__title">
                <div className="customer-info__header__title__label">
                  {intl.formatMessage({
                    id: 'admin.create.info',
                  })}
                </div>
                <div className="line-title"></div>
              </div>
            </div>
            <div className="customer-info__content">
              <div className="customer-info__content__info">
                <div className="customer-info__content__info__rows">
                  {/*<Form.Item*/}
                  {/*  className="name"*/}
                  {/*  label={intl.formatMessage({*/}
                  {/*    id: 'admin.create.name',*/}
                  {/*  })}*/}
                  {/*  name={n('fullName')}*/}
                  {/*  rules={ValidateLibrary(intl).nameCustomer}*/}
                  {/*>*/}
                  {/*  <CustomInput*/}
                  {/*    placeholder={intl.formatMessage({*/}
                  {/*      id: 'admin.create.name',*/}
                  {/*    })}*/}
                  {/*  />*/}
                  {/*</Form.Item>*/}
                  <Form.Item
                    className="email"
                    label={intl.formatMessage({
                      id: 'admin.create.email',
                    })}
                    name={n('emailAddress')}
                    rules={ValidateLibrary(intl).email}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'admin.create.email',
                      })}
                    />
                  </Form.Item>
                </div>
                <div className="customer-info__content__info__rows">
                  <Form.Item
                    className="phone"
                    label={intl.formatMessage({
                      id: 'admin.create.phone',
                    })}
                    name={n('phoneNumber')}
                    rules={ValidateLibrary(intl).phoneNumber}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'admin.create.phone',
                      })}
                      onInput={formatPhoneNumberInput}
                    />
                  </Form.Item>
                  <Form.Item
                    className="dob"
                    label={intl.formatMessage({
                      id: 'admin.create.dob',
                    })}
                    name={n('dob')}
                  >
                    <DatePickerCustom
                      placeHolder={intl.formatMessage({
                        id: 'common.place-holder.dob',
                      })}
                      dateFormat={FORMAT_DATE}
                    />
                    {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                  </Form.Item>
                </div>

                <div className="customer-info__content__info__rows">
                  <Form.Item
                    className="name"
                    label={intl.formatMessage({
                      id: 'admin.create.city',
                    })}
                    name={n('city')}
                    rules={ValidateLibrary(intl).nameCustomer}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'admin.create.city',
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    className="status"
                    label={intl.formatMessage({
                      id: 'admin.create.status',
                    })}
                    name={n('isActive')}
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({
                        id: 'admin.create.status',
                      })}
                      onChange={(e) => {
                        form.setFieldValue(n('isActive'), e);
                      }}
                      options={[
                        {
                          value: 1,
                          label: intl.formatMessage({
                            id: `common.user.${Status.ACTIVE}`,
                          }),
                        },
                        {
                          value: 0,
                          label: intl.formatMessage({
                            id: `common.user.${Status.INACTIVE}`,
                          }),
                        },
                      ]}
                    />
                  </Form.Item>
                </div>
                <div className="customer-info__content__info__rows">
                  <Form.Item
                    className="status"
                    label={intl.formatMessage({
                      id: 'admin.create.status',
                    })}
                    name={n('roleIds')}
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({
                        id: 'admin.create.status',
                      })}
                      mode="multiple"
                      options={
                        listRole && listRole.data && listRole.data.content && listRole.data.content.length > 0
                          ? listRole?.data.content?.map((item: any) => {
                              return {
                                value: item.id,
                                label: item.name,
                              };
                            })
                          : []
                      }
                    />
                  </Form.Item>
                </div>
                {!id && (
                  <Form.Item
                    name={n('password')}
                    label={intl.formatMessage({
                      id: 'admin.create.password',
                    })}
                    rules={ValidateLibrary(intl).password}
                  >
                    <CustomInput
                      isPassword={true}
                      placeholder={intl.formatMessage({
                        id: 'sigin.password',
                      })}
                      maxLength={16}
                    />
                  </Form.Item>
                )}
              </div>
            </div>
          </div>
          <div className="button-action">
            {id ? (
              <div className="more-action">
                <CustomButton className="button-save" onClick={() => form.submit()} disabled={!permission.update}>
                  {intl.formatMessage({
                    id: 'admin.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  disabled={!permission.delete}
                  className="button-delete"
                  onClick={() => {
                    setIsDeleteAdmin(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'admin.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={() => form.submit()} disabled={!permission.create}>
                  {intl.formatMessage({
                    id: 'admin.create.button.create',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'admin.create.button.cancel',
                  })}
                </CustomButton>
              </div>
            )}
          </div>
        </FormWrap>

        <ConfirmDeleteModal
          name={`${dataAdmin?.data.lastName} ${dataAdmin?.data.firstName}` || ''}
          visible={isDeleteAdmin}
          onSubmit={handleDelete}
          onClose={() => setIsDeleteAdmin(false)}
        />
      </Spin>
    </Card>
  );
};

export default CreateAdmin;
