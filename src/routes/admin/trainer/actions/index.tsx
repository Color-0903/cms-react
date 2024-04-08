import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { trainerApi } from '../../../../apis';
import { CreateCustomerDto, CreateTrainerDto, UpdateTrainerDto } from '../../../../apis/client-axios';
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
import {
  QUERY_LIST_TRAINER,
  QUERY_LIST_USER,
  QUERY_TRAINER_DETAIL,
  QUERY_USER_DETAIL,
} from '../../../../util/contanst';
import { useForm } from 'antd/es/form/Form';
import CustomSelect from '../../../../components/select/CustomSelect';

const n = (key: keyof CreateTrainerDto) => {
  return key;
};
const CreateTrainer = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteTrainer, setIsDeleteTrainer] = useState<boolean>(false);
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadNews, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateNews, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteNews, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateNews, authUser)),
      });
    }
  }, [authUser]);
  const { data: dataTrainer, isFetching: loadingData } = useQuery(
    [QUERY_TRAINER_DETAIL, id],
    () => trainerApi.trainerControllerGetById(id as string),
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
        });
      },
      enabled: !!id && permission.read,
      refetchOnWindowFocus: false,
    }
  );

  const {
    mutate: deleteTrainer,
    status: statusDeleteTrainer,
    isLoading: deleteLoading,
  } = useMutation((id: string) => trainerApi.trainerControllerDelete(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_LIST_TRAINER]);
      CustomHandleSuccess(ActionUser.DELETE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.TRAINER_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: trainerCreate,
    status: statusCreateTrainer,
    isLoading: createLoading,
  } = useMutation((createTrainer: CreateTrainerDto) => trainerApi.trainerControllerCreate(createTrainer), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([QUERY_LIST_TRAINER]);
      CustomHandleSuccess(ActionUser.CREATE, intl);
      navigate(`/admin/${ADMIN_ROUTE_NAME.TRAINER_MANAGEMENT}`);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const {
    mutate: trainerUpdate,
    status: statusUpdateTrainer,
    isLoading: updateLoading,
  } = useMutation(
    (updateTrainer: UpdateTrainerDto) => trainerApi.trainerControllerUpdate(id as string, updateTrainer),
    {
      onSuccess: ({ data }) => {
        CustomHandleSuccess(ActionUser.EDIT, intl);
        navigate(`/admin/${ADMIN_ROUTE_NAME.TRAINER_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const onFinish = (values: CreateTrainerDto) => {
    console.log(values);
    const dateOfBirth = values.dob ? dayjs(values.dob).format(FORMAT_DATE) : '';
    const isActive: number = +values.isActive;
    if (id) {
      trainerUpdate({
        ...values,
        dob: dateOfBirth,
        isActive: isActive === 1,
      });
    } else {
      trainerCreate({
        ...values,
        dob: dateOfBirth,
        isActive: isActive === 1,
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteTrainer && id) {
      deleteTrainer(id);
    }
    setIsDeleteTrainer(false);
  };

  useEffect(() => {
    if (!id) {
      form.setFieldValue('status', 1);
    }
  }, []);

  return (
    <Card id="create-trainer-management">
      <Spin
        className="custom-spin"
        size="large"
        spinning={loadingData || createLoading || updateLoading || deleteLoading}
      >
        <div className="create-trainer-header">
          <div className="create-trainer-header__title">
            {id
              ? intl.formatMessage({
                  id: 'trainer.edit.title',
                })
              : intl.formatMessage({
                  id: 'trainer.create.title',
                })}
          </div>
        </div>

        <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-trainer">
          <div className="trainer-info">
            <div className="trainer-info__header">
              <div className="trainer-info__header__title">
                <div className="trainer-info__header__title__label">
                  {intl.formatMessage({
                    id: 'trainer.create.info',
                  })}
                </div>
                <div className="line-title"></div>
              </div>
            </div>
            <div className="trainer-info__content">
              <div className="trainer-info__content__info">
                <div className="trainer-info__content__info__rows">
                  {/*<Form.Item*/}
                  {/*  className="name"*/}
                  {/*  label={intl.formatMessage({*/}
                  {/*    id: 'trainer.create.name',*/}
                  {/*  })}*/}
                  {/*  name={n('fullName')}*/}
                  {/*  rules={ValidateLibrary(intl).nameCustomer}*/}
                  {/*>*/}
                  {/*  <CustomInput*/}
                  {/*    placeholder={intl.formatMessage({*/}
                  {/*      id: 'trainer.create.name',*/}
                  {/*    })}*/}
                  {/*  />*/}
                  {/*</Form.Item>*/}
                  <Form.Item
                    className="email"
                    label={intl.formatMessage({
                      id: 'trainer.create.email',
                    })}
                    name={n('emailAddress')}
                    rules={ValidateLibrary(intl).email}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'trainer.create.email',
                      })}
                    />
                  </Form.Item>
                </div>
                <div className="trainer-info__content__info__rows">
                  <Form.Item
                    className="phone"
                    label={intl.formatMessage({
                      id: 'trainer.create.phone',
                    })}
                    name={n('phoneNumber')}
                    rules={ValidateLibrary(intl).phoneNumber}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'trainer.create.phone',
                      })}
                      onInput={formatPhoneNumberInput}
                    />
                  </Form.Item>
                  <Form.Item
                    className="dob"
                    label={intl.formatMessage({
                      id: 'trainer.create.dob',
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

                <div className="trainer-info__content__info__rows">
                  <Form.Item
                    className="name"
                    label={intl.formatMessage({
                      id: 'trainer.create.city',
                    })}
                    name={n('city')}
                    rules={ValidateLibrary(intl).nameCustomer}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'trainer.create.city',
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    className="status"
                    label={intl.formatMessage({
                      id: 'trainer.create.status',
                    })}
                    name={n('isActive')}
                  >
                    <CustomSelect
                      placeholder={intl.formatMessage({
                        id: 'trainer.create.status',
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
                {!id && (
                  <Form.Item
                    name={n('password')}
                    label={intl.formatMessage({
                      id: 'trainer.create.password',
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
                    id: 'trainer.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  disabled={!permission.delete}
                  className="button-delete"
                  onClick={() => {
                    setIsDeleteTrainer(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'trainer.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={() => form.submit()} disabled={!permission.create}>
                  {intl.formatMessage({
                    id: 'trainer.create.button.create',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'trainer.create.button.cancel',
                  })}
                </CustomButton>
              </div>
            )}
          </div>
        </FormWrap>

        <ConfirmDeleteModal
          name={`${dataTrainer?.data.lastName} ${dataTrainer?.data.firstName}` || ''}
          visible={isDeleteTrainer}
          onSubmit={handleDelete}
          onClose={() => setIsDeleteTrainer(false)}
        />
      </Spin>
    </Card>
  );
};

export default CreateTrainer;
