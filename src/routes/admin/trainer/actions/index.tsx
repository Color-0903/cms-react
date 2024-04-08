import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Divider, Form, Spin, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { trainerApi } from '../../../../apis';
import { CreateTrainerDto, UpdateTrainerDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { CustomHandleError } from '../../../../components/response/error';
import { CustomHandleSuccess } from '../../../../components/response/success';
import CustomSelect from '../../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../../constants/common';
import { ActionUser, PERMISSIONS } from '../../../../constants/enum';
import { formatPhoneNumber } from '../../../../constants/function';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { RootState } from '../../../../store';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import {
  QUERY_LIST_TRAINER,
  QUERY_TRAINER_DETAIL
} from '../../../../util/contanst';

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
      onError: (error) => { },
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

  const handleOnFinish = () => { }
  return (
    <Spin>
      <Card id="customer-management" style={{ paddingBottom: '20px' }}>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="color-D82C1C font-weight-700 font-base font-size-32">生徒情報</span>
          </div>
          <div className="d-flex mt-35">
            <div className="w-30">
              <div className="width-354 height-354">
                {/* <CustomImage src={helper.getSourceFile(undefined)} alt="avatar" /> */}
                <Image
                  preview={false}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                  width={200} />
              </div>
            </div>
            <div className="flex-grow-1" style={{ maxWidth: '980px', marginLeft: '124px' }}>
              <span
                className="color-1A1A1A font-weight-700 font-base font-size-20"
                style={{ borderBottom: '4px solid #1A1A1A' }}
              >
                プロフィール
              </span>
              <div className="mt-40">
                <div className="row">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">firstName</span>}
                    name={'firstName'}
                    className="col-3 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">firstNameFurigana</span>
                    }
                    name={'firstNameFurigana'}
                    className="col-3 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">lastName</span>}
                    name={'lastName'}
                    className="col-3 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">lastNameFurigana</span>
                    }
                    name={'lastNameFurigana'}
                    className="col-3 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                </div>
                <div className="row mt-20">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">メール</span>}
                    name={'emailAddress'}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">生年月日</span>}
                    name={'dob'}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                </div>
                <div className="row mt-20">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">電話番号</span>}
                    name={'phoneNumber'}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">性別</span>}
                    name={'gender'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      disabled
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
                <Divider type="horizontal" className="mt-40 mb-0" />
              </div>
            </div>
            <div className="mt-20">
              <Form.Item label="Ghi chú" name={'note'}>
                <TextArea rows={3} placeholder="Ghi chú" disabled />
              </Form.Item>
            </div>
            <div className="mt-48">
              <span
                className="color-1A1A1A font-weight-700 font-base font-size-20 width-110 d-block"
                style={{ borderBottom: '4px solid #1A1A1A' }}
              >
                実績
              </span>

              <div className="mt-39  text-right">
                <CustomButton onClick={form.submit} className="bg-D9D9D9 color-1A1A1A width-278">
                  不合格
                </CustomButton>
                <CustomButton
                  onClick={form.submit}
                  className="bg-D82C1C color-FFFFFF width-278"
                  style={{ marginLeft: '12px' }}
                >
                  合格
                </CustomButton>
              </div>
            </div>
          </div>
        </FormWrap>
      </Card>
    </Spin >
  );
};

export default CreateTrainer;
