import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Divider, Form, Spin, Upload } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { assetsApi, customerApi } from '../../../../apis';
import { UpdateAdminDtoGenderEnum } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { AccountInterface, ConfirmModel } from '../../../../components/modals/ConfirmModel';
import CustomSelect from '../../../../components/select/CustomSelect';
import { UploadDto } from '../../../../constants/dto';
import { ActionUser } from '../../../../constants/enum';
import { helper } from '../../../../util/helper';
import { searchPostalCode } from '../../../../util/search-postCode';
import { regexImage } from '../../../../validate/validator.validate';
import { UpdateCustomerInterface } from '../../../trainer/customer';

const CreateCustomer = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<{ id: string; source: string | undefined } | undefined>(undefined);
  const [cadastral, setCadastral] = useState<{ province: string; district: string; ward: string }>({
    province: '',
    district: '',
    ward: '',
  });
  const [accountBlock, setAccoutBlock] = useState<AccountInterface | null>(null);

  const { data: customerData, isLoading: customerDataLoading } = useQuery({
    queryKey: ['getCustomerById', id],
    queryFn: () => customerApi.customerControllerGetById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      setAvatar({ id: data.avatar?.id as string, source: data.avatar?.source });
      form.setFieldsValue({ ...data, isActive: Number(data.user?.isActive) });
      if (data?.postCode) {
        searchPostalCode(data?.postCode).then((data: any) =>
          setCadastral({ province: data?.region, district: data?.locality, ward: data?.street })
        );
      }
    },
  });

  const { mutate: updateCustomer, isLoading: isLoadingUpdateCustomer } = useMutation(
    (dto: UpdateCustomerInterface) => customerApi.customerControllerUpdate(dto.userId, dto.dto),
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries(['getCustomers']);
        queryClient.invalidateQueries(['getCustomerById', id]);
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const { mutate: UploadFile, isLoading: isLoadingUploadFile } = useMutation(
    (dto: UploadDto) => assetsApi.assetControllerUploadFile(dto.file, undefined, dto.s3FilePath),
    {
      onSuccess: (data: any) => {
        setAvatar({
          id: data?.data?.id,
          source: data?.data?.source as string,
        });
      },
      onError: (error: any) => {
        console.log('error: ', error);
      },
    }
  );

  const debouncedUpdateInputValue = debounce((value) => {
    if (!!value.trim()) {
      searchPostalCode(value)
        .then((data: any) => {
          setCadastral({ province: data?.region, district: data?.locality, ward: data?.street });
        })
        .catch(() => {
          setCadastral({ province: '', district: '', ward: '' });
          helper.showErroMessage('post code không hợp lệ', intl);
        });
    }
  }, 1500);

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      helper.showErroMessage('FILE.NOT_SUPPORT', intl);
      return;
    }
    UploadFile({ file, assetFolderId: undefined, s3FilePath: 'course' });
  };

  const handleBlockUser = (userId: string) => {
    const params = {
      userId: userId,
      dto: {
        isActive: false,
      },
    };
    setAccoutBlock(null);
    updateCustomer(params as UpdateCustomerInterface);
  };

  const handleOnFinish = (value: any) => {
    const params = {
      userId: id,
      dto: { ...value, avatarId: avatar?.id ?? '' },
    };
    updateCustomer(params as UpdateCustomerInterface);
  };

  return (
    <Card id="customer-management" style={{ paddingBottom: '20px' }}>
      {customerDataLoading || isLoadingUpdateCustomer ? (
        <Spin></Spin>
      ) : (
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="color-D82C1C font-weight-700 font-base font-size-32">生徒</span>
          </div>
          <div className="d-flex mt-35">
            <div className="w-30">
              <div className="width-354 height-354">
                {isLoadingUploadFile ? (
                  <Spin></Spin>
                ) : (
                  <CustomImage src={helper.getSourceFile(avatar?.source)} alt="avatar" />
                )}
                <div className="mt-24 width-146 mx-auto" style={{ border: '1px dotted #D82C1C' }}>
                  <Upload
                    customRequest={customRequest}
                    maxCount={1}
                    showUploadList={false}
                    disabled={isLoadingUploadFile}
                    className="text-center"
                  >
                    <Button type="text" icon={<UploadOutlined />} className="color-000000">
                      アップロード
                    </Button>
                  </Upload>
                </div>
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
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">firstNameFurigana</span>
                    }
                    name={'firstNameFurigana'}
                    className="col-3 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">lastName</span>}
                    name={'lastName'}
                    className="col-3 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="color-8B8B8B font-weight-400 font-base font-size-12">lastNameFurigana</span>
                    }
                    name={'lastNameFurigana'}
                    className="col-3 mb-0"
                  >
                    <CustomInput />
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
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className="row mt-20">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">電話番号</span>}
                    name={'phoneNumber'}
                    className="col-6 mb-0"
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">性別</span>}
                    name={'gender'}
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      options={[
                        {
                          value: UpdateAdminDtoGenderEnum.Male,
                          label: 'Male',
                        },
                        {
                          value: UpdateAdminDtoGenderEnum.Female,
                          label: 'Femal',
                        },
                      ]}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <Divider type="horizontal" className="mt-40 mb-0" />
                <div className="row mt-40">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">郵便番号</span>}
                    name={'postCode'}
                    className="col-6 mb-0"
                  >
                    <CustomInput onChange={(e) => debouncedUpdateInputValue(e.target?.value?.toString().trim())} />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">都道府県</span>}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled value={cadastral.province} />
                  </Form.Item>
                </div>
                <div className="row mt-20">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">市区町村</span>}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled value={cadastral.district} />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">町名・建物名</span>}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled value={cadastral.ward} />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-48">
                <span
                  className="color-1A1A1A font-weight-700 font-base font-size-20 width-110 d-block text-center"
                  style={{ borderBottom: '4px solid #1A1A1A' }}
                >
                  アカウント
                </span>
                <div className="row mt-20">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">メール</span>}
                    name={'emailAddress'}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled />
                  </Form.Item>
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">状態</span>}
                    name="isActive"
                    className="col-6 mb-0"
                  >
                    <CustomSelect
                      options={[
                        {
                          value: 1,
                          label: '活動',
                        },
                        {
                          value: 0,
                          label: 'ブロック',
                        },
                      ]}
                    ></CustomSelect>
                  </Form.Item>
                </div>
                <div className="row mt-20">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12 ">パスワード</span>}
                    name={'password'}
                    className="col-6 mb-0"
                  >
                    <CustomInput isPassword={true} placeholder="******" />
                  </Form.Item>
                </div>
                <div className="mt-39  text-right">
                  <CustomButton
                    onClick={() => {
                      const firstName = customerData?.data?.firstName ?? '';
                      const lastName = customerData?.data?.lastName ?? '';
                      return setAccoutBlock({
                        userId: customerData?.data?.userId ?? '',
                        src: customerData?.data?.avatar?.source,
                        name: firstName + ' ' + lastName,
                        email: customerData?.data?.emailAddress,
                      });
                    }}
                    className="bg-D9D9D9 color-1A1A1A width-278"
                    disabled={!Number(customerData?.data?.user?.isActive)}
                  >
                    ブロック
                  </CustomButton>
                  <CustomButton
                    onClick={form.submit}
                    className="bg-D82C1C color-FFFFFF width-278"
                    style={{ marginLeft: '12px' }}
                  >
                    保存
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </FormWrap>
      )}
      <ConfirmModel
        visible={!!accountBlock}
        account={accountBlock}
        onSubmit={() => handleBlockUser(accountBlock?.userId as string)}
        onClose={() => setAccoutBlock(null)}
      />
    </Card>
  );
};
export default CreateCustomer;
