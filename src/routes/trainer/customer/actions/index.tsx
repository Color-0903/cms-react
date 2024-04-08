import { useQuery } from '@tanstack/react-query';
import { Button, Card, Divider, Form, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { customerApi, lessonLearnAPi, lessonQuestionAddOnTimeApi } from '../../../../apis';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';
import CustomeVideo from '../../../../components/video/CustomVideo';
import { helper } from '../../../../util/common';
import { searchPostalCode } from '../../../../util/search-postCode';

const ActionCustomer = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const [tab, setTab] = useState<'default' | 'test' | 'image'>('default');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [cadastral, setCadastral] = useState<{ province: string; district: string; ward: string }>({
    province: '',
    district: '',
    ward: '',
  });

  const { data: customerData, isLoading: customerDataLoading } = useQuery({
    queryKey: ['getCustomerById', id],
    queryFn: () => customerApi.customerControllerGetById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      setAvatar(data.avatar?.source);
      form.setFieldsValue({ ...data });
      if (data?.postCode) {
        searchPostalCode(data?.postCode).then((data: any) =>
          setCadastral({ province: data?.region, district: data?.locality, ward: data?.street })
        );
      }
    },
  });

  const { data: lessonQuestionAddOnTime, isLoading: lessonQuestionAddOnTimeLoading } = useQuery({
    queryKey: ['getLessonQuestionAddOnTimeByUserId', id],
    queryFn: () =>
      lessonQuestionAddOnTimeApi.lessonquestionAddOnTimeControllerGetByUserId(
        id as string,
        1,
        undefined,
        undefined,
        undefined
      ),
    enabled: !!id,
    onSuccess: ({ data }) => {},
  });

  const { data: lessonLearnData, isLoading: lessonLearnDataLoading } = useQuery({
    queryKey: ['getLessonLearnDataByUserId', id],
    queryFn: () => lessonLearnAPi.lessonLearnControllerGetByUserId(id as string, 1, undefined, undefined, undefined),
    enabled: !!id,
    onSuccess: ({ data }) => {},
  });

  const renderVideo = () => {
    return (
      <div className="row mt-32">
        {customerData?.data?.lesson_learn?.map((item) => (
          <div className="col-4 position-relative mt-14">
            <div className="d-flex flex-column">
              <CustomeVideo src={helper.getSourceFile(item?.lesson?.video?.source)} />
              <span className="mt-8 color-000000 font-weight-500 font-base font-size-14 text-one-line">
                ビデオ学習 {item?.lesson?.index}
              </span>
              <span className="color-292929 font-weight-400 font-base font-size-12 text-one-line">
                {item?.lesson?.introduce}
              </span>
            </div>
            {+item.progress >= 90 && (
              <span
                className="position-absolute translate-middle rounded-circle z-999"
                style={{ left: '90%', top: '10%' }}
              >
                <IconSVG type="completed-lesson"></IconSVG>
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTest = () => {
    return (
      <div className="row mt-16">
        {lessonQuestionAddOnTime?.data?.content?.map((item, index) => (
          <div className="col-6 mt-16">
            <div className="bg-D9D9D9 rounded" style={{ padding: '12px 16px' }}>
              <Button type="text" className="min-width-113 height-34 bg-D82C1C3D color-D82C1C rounded">
                ビデオ学習: {index + 1}
              </Button>
              <div>
                <span className="color-585858 font-weight-400 font-base font-size-14">質問数: </span>{' '}
                <span className="color-000000 font-weight-600 font-base font-size-16">
                  {item?.Lesson?.lessonQuestion?.length}
                </span>
              </div>
              <div>
                <span className="color-585858 font-weight-400 font-base font-size-14">正解: </span>
                <span className="color-000000 font-weight-600 font-base font-size-16">
                  {item?.correctly} / {item?.Lesson?.lessonQuestion?.length}
                </span>
              </div>
              <div>
                <span className="color-585858 font-weight-400 font-base font-size-14">時間: </span>{' '}
                <span className="color-000000 font-weight-600 font-base font-size-16">{item?.timeCompleted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderImage = () => {
    return (
      <div className="row mt-2">
        {lessonLearnData?.data?.content?.map((item) => {
          return item?.lessonLearnCheck?.map((check, index) => (
            <div className="col-6 mt-20 position-relative">
              <CustomImage src={helper.getSourceFile(check?.avatar?.source)} />
              <Button
                type="text"
                className="min-width-113 height-34 position-absolute bg-D82C1C3D color-D82C1C rounded"
                style={{ left: '12px', top: '10px' }}
              >
                ビデオ学習 {index + 1}
              </Button>
            </div>
          ));
        })}
      </div>
    );
  };

  const renderTabContent = () => {
    if (tab === 'default') {
      return renderVideo();
    } else if (tab === 'test') {
      return !!lessonQuestionAddOnTimeLoading ? <Spin></Spin> : renderTest();
    } else return !!lessonLearnDataLoading ? <Spin></Spin> : renderImage();
  };

  const handleOnFinish = (value: any) => {
    console.log(value);
  };

  return (
    <Card id="customer-management" style={{ paddingBottom: '20px' }}>
      {!!customerDataLoading ? (
        <Spin></Spin>
      ) : (
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div>
            <span className="color-D82C1C font-weight-700 font-base font-size-32">生徒情報</span>
          </div>
          <div className="d-flex mt-35">
            <div className="w-30">
              <div className="width-354 height-354">
                <CustomImage src={helper.getSourceFile(avatar)} alt="avatar" />
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
                <div className="row mt-40">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">郵便番号</span>}
                    name={'postCode'}
                    className="col-6 mb-0"
                  >
                    <CustomInput disabled />
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
                <div className="border mt-40">
                  <div className="d-flex justify-content-between align-items-center border-bottom">
                    <div
                      className="w-100 text-center pointer"
                      style={{ padding: '18px 0' }}
                      onClick={() => setTab('default')}
                    >
                      <span className={`${tab === 'default' && 'profile-item-active'}`}>ビデオ学習</span>
                    </div>
                    <Divider type="vertical" className="height-44 color-585858" />
                    <div
                      className="w-100 text-center pointer"
                      style={{ padding: '18px 0' }}
                      onClick={() => setTab('test')}
                    >
                      <span className={`${tab === 'test' && 'profile-item-active'}`}>テスト</span>
                    </div>
                    <Divider type="vertical" className="height-44 color-585858" />
                    <div
                      className="w-100 text-center pointer"
                      style={{ padding: '18px 0' }}
                      onClick={() => setTab('image')}
                    >
                      <span className={`${tab === 'image' && 'profile-item-active'}`}>撮影</span>
                    </div>
                  </div>
                  <div style={{ margin: '0 34px 12px', maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {renderTabContent()}
                  </div>
                </div>
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
          </div>
        </FormWrap>
      )}
    </Card>
  );
};
export default ActionCustomer;
