import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Divider, Form, Spin, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { assetsApi, authAdminApi, userApi } from '../../../apis';
import { DeleteFileDto, UpdateUserDto } from '../../../apis/client-axios';
import FormWrap from '../../../components/FormWrap';
import CustomImage from '../../../components/Image/CustomImage';
import CustomButton from '../../../components/buttons/CustomButton';
import CustomDatePicker from '../../../components/dateTime/CustomDatePicker';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { FORMAT_DATE } from '../../../constants/common';
import { ActionUser } from '../../../constants/enum';
import { QUERY_PROFILE } from '../../../util/contanst';
import { helper } from '../../../util/helper';
import { regexImage } from '../../../util/regex';

const Profile = () => {
  const intl = useIntl();
  const [form] = useForm<FormInstance>();
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [avatar, setAvatar] = useState<{ id: string; source: string } | undefined>(undefined);

  const { data: dataMe, isLoading } = useQuery({
    queryKey: [QUERY_PROFILE],
    queryFn: () => authAdminApi.authAdminControllerMe(),
    onSuccess: ({ data }: any) => {
      if (data?.asset) {
        setAvatar({
          id: data?.asset?.id,
          source: data?.asset?.source,
        });
      }
      form.setFieldsValue({ ...(data as any), dob: data?.dob && dayjs(moment(data?.dob).format(FORMAT_DATE)) });
    },
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: Update, isLoading: isUpdate } = useMutation((dto: UpdateUserDto) => userApi.userControllerEdit(dto), {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries([QUERY_PROFILE]);
      helper.showSuccessMessage(ActionUser.EDIT, intl);
    },
    onError: (error: any) => {
      helper.showErroMessage(error?.response?.data, intl);
    },
  });

  const { mutate: DeleteFile, isLoading: isLoadingDeleteFile } = useMutation(
    (dto: DeleteFileDto) => assetsApi.assetControllerDelete(dto),
    {
      onSuccess: () => {
        form.resetFields();
        queryClient.invalidateQueries([QUERY_PROFILE]);
      },
    }
  );

  const { mutate: UploadFile, isLoading: isLoadingUploadFile } = useMutation(
    (file: File) => assetsApi.assetControllerUploadFile(file),
    {
      onSuccess: async ({ data }: any) => {
        await DeleteFile({
          id: dataMe?.data?.id,
          oldSource: dataMe?.data?.source,
          updateFor: {
            id: dataMe?.data?.id,
            table: 'user',
            asset: data,
          },
        });
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
    Update(values);
  };

  return (
    <Spin spinning={isLoading || isLoadingUploadFile || isUpdate}>
      <Card>
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish} className="pb-5">
          <div>
            <span className="font-weight-700 font-size-18 font-base">
              {intl.formatMessage({ id: 'profile.title' })}
            </span>
          </div>
          <div className="d-flex mt-35 gap-3">
            <div className="w-30" style={{ maxWidth: '250px' }}>
              <div className="w-100">
                <CustomImage src={helper.getSourceFile(avatar?.source)} alt="avatar" />
                <div className="mt-12 text-center">
                  <Upload showUploadList={false} customRequest={customRequest}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </div>
            </div>
            <div className="flex-grow-1" style={{ maxWidth: '980px' }}>
              <span className="font-weight-700 font-size-16 font-base" style={{ borderBottom: '4px solid #1A1A1A' }}>
                {intl.formatMessage({ id: 'profile.title' })}
              </span>
              <div className="mt-32">
                <div className="row">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'common.field.identifier' })}
                      </span>
                    }
                    name={'identifier'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'common.field.displayName' })}
                      </span>
                    }
                    name={'displayName'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className="row mt-32">
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'common.field.phone' })}
                      </span>
                    }
                    name={'phone'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">
                        {intl.formatMessage({ id: 'common.field.dob' })}
                      </span>
                    }
                    name={'dob'}
                    className="col-6 mb-0"
                  >
                    <CustomDatePicker />
                  </Form.Item>
                </div>

                <Divider type="horizontal" className="mt-32 mb-0" />
              </div>
              <div className="mt-48">
                <div className="d-flex justify-content-end mt-32">
                  <CustomButton onClick={() => form.submit()}>
                    {intl.formatMessage({
                      id: 'common.edit',
                    })}
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

export default Profile;
