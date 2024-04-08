import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Divider, Form } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { authApi, trainerApi } from '../../../apis';
import { UpdatePasswordDto, UpdateTrainerDto } from '../../../apis/client-axios';
import FormWrap from '../../../components/FormWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import DatePickerCustom from '../../../components/date/DatePickerCustome';
import CustomInput from '../../../components/input/CustomInput';
import CustomSelect from '../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../constants/common';
import { ActionUser } from '../../../constants/enum';
import { RootState } from '../../../store';
import { helper } from '../../../util/common';
import { passwordInterface, renderRequiredPassword } from '../../../util/validate-password';
import { searchPostalCode } from '../../../util/search-postCode';
import { debounce } from 'lodash';
import CustomImage from '../../../components/Image/CustomImage';

const tabs = {
  profile: 'profile',
  password: 'password',
  company: 'company',
};

const TrainerProfile = () => {
  const intl = useIntl();
  const [form] = Form.useForm<any>();
  const queryClient = useQueryClient();
  const [tab, setTabs] = useState<string>(tabs.profile);
  const [password, setPassword] = useState<passwordInterface>({ pass: '', confirm: '' });
  const [cadastral, setCadastral] = useState<{ province: string; district: string; ward: string }>({
    province: '',
    district: '',
    ward: '',
  });
  const { authUser } = useSelector((state: RootState) => state.auth);

  const { mutate: UpdateTrainer, isLoading: isLoadingUpdateTrainer } = useMutation(
    (dto: UpdateTrainerDto) => trainerApi.trainerControllerUpdateMe(dto),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['trainerMe']);
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdatePassword, isLoading: isLoadingUpdatePassword } = useMutation(
    (dto: UpdatePasswordDto) => authApi.authControllerUpdatePassword(dto),
    {
      onSuccess: (data) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  useEffect(() => {
    if (authUser) {
      form.setFieldsValue({ ...authUser, dob: authUser?.dob && dayjs(moment(authUser?.dob).format(FORMAT_DATE)) });
      if (authUser?.postCode) {
        searchPostalCode(authUser?.postCode).then((data: any) =>
          setCadastral({ province: data?.region, district: data?.locality, ward: data?.street })
        );
      }
    }
  }, [authUser]);

  const renderTab = () => {
    if (tab === tabs.password) {
      return passwordTab;
    } else if (tab === tabs.company) {
      return companyTab;
    } else {
      return profileTab;
    }
  };

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

  const handleOnFinish = (value: any) => {
    if (tab === tabs.profile) {
      UpdateTrainer({
        ...value,
        dob: value?.dob ? moment(value?.dob).format(FORMAT_DATE) : '',
      });
    } else if (tab === tabs.password) {
      UpdatePassword({
        ...value,
      });
    }
  };

  const profileTab = (
    <div className="mt-35">
      <span className="color-D82C1C font-weight-700 font-base font-size-32">プロフィール</span>
      <div className="d-flex flex-column gap-3 mt-40">
        <div className="row">
          <Form.Item
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">姓</span>}
            name={'firstName'}
            className="col-3 mb-0"
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">名</span>}
            name={'lastName'}
            className="col-3 mb-0"
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">姓(フリガナ)</span>}
            name={'firstNameFurigana'}
            className="col-3 mb-0"
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">名(フリガナ)</span>}
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
            <CustomInput />
          </Form.Item>
          <Form.Item
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">生年月日</span>}
            name={'dob'}
            className="col-6 mb-0"
          >
            <DatePickerCustom placeHolder="生年月日" className="height-44 w-100" />
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
      <div className="text-right mt-33">
        <CustomButton disabled={!!isLoadingUpdateTrainer} onClick={form.submit} className="bg-D82C1C color-FFFFFF">
          不合格
        </CustomButton>
      </div>
    </div>
  );

  const passwordTab = (
    <>
      <div className="text-left color-D82C1C font-weight-700 font-base font-size-32 mt-35">パスワード変更</div>
      <div className="mt-40">
        <div>
          <Form.Item
            className="mb-0"
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">旧パスワード</span>}
            name={'currentPassword'}
          >
            <CustomInput placeholder="旧パスワード" isPassword={true} />
          </Form.Item>
        </div>
        <div className="mt-20">
          <Form.Item
            className="mb-0"
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">新しいパスワード</span>}
            name={'newPassword'}
          >
            <CustomInput
              placeholder="新しいパスワード"
              isPassword={true}
              onChange={(e) => setPassword({ ...password, pass: e.target.value.trim() })}
            />
          </Form.Item>
        </div>
        <div className="mt-20">
          <Form.Item
            className="mb-0"
            label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">新しいパスワード</span>}
            name={'newPassword-confirm'}
          >
            <CustomInput
              placeholder="新しいパスワード"
              isPassword={true}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value.trim() })}
            />
          </Form.Item>
        </div>
      </div>
      <div className="mt-32">{renderRequiredPassword(password)}</div>
      <div className="mt-42">
        <CustomButton
          disabled={!!isLoadingUpdatePassword}
          onClick={form.submit}
          className="bg-D82C1C color-FFFFFF width-232"
        >
          合格
        </CustomButton>
      </div>
    </>
  );

  const companyTab = (
    <>
      <div className="color-D82C1C font-weight-700 font-base font-size-32 mt-35">会社情報</div>
      <div className="mt-53">
        <img width={264} height={172} className="my-auto" src={'/assets/images/logo.png'} />
      </div>
      <div className="color-D82C1C font-weight-700 font-base font-size-32 mt-29">社名</div>
      <div className="mt-35">
        <span className="color-000000 font-weight-700 font-base font-size-14">Điều khoản 1</span>
        <span className="color-8B8B8B font-weight-400 font-base font-size-12">
          Lorem ipsum dolor sit amet consectetur. Tincidunt faucibus risus aenean parturient. Consectetur est in ut
          porttitor eget sit. Condimentum sed pharetra dictum quis. Vestibulum sed et consectetur sed elit fusce mattis
          enim. Rutrum leo ut eu mi. Morbi ut in sollicitudin nisl ac proin euismod. Egestas turpis est enim eleifend.
          Amet magna nisl in aliquet dui lacus elit.
        </span>
      </div>
    </>
  );

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center border-585858 height-68"
        style={{ padding: '0 48px' }}
      >
        <div>
          <span
            onClick={() => setTabs(tabs.profile)}
            className={`${tab === tabs.profile && 'profile-item-active'} width-108 text-center pointer`}
          >
            プロフィール
          </span>
        </div>
        <Divider type="vertical" className="height-44 color-585858" />
        <div>
          <span
            onClick={() => setTabs(tabs.password)}
            className={`${tab === tabs.password && 'profile-item-active'} width-108 text-center pointer`}
          >
            プロフィール
          </span>
        </div>
        <Divider type="vertical" className="height-44 color-585858" />
        <div>
          <span
            onClick={() => setTabs(tabs.company)}
            className={`${tab === tabs.company && 'profile-item-active'} width-108 text-center pointer`}
          >
            プロフィール
          </span>
        </div>
      </div>
      <FormWrap
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
        className="w-50 mt-4 mx-auto border-D9D9D9"
        style={{ padding: '0 32px 58px' }}
      >
        {renderTab()}
      </FormWrap>
    </div>
  );
};

export default TrainerProfile;
