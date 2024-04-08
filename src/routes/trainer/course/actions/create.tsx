import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, Form, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { assetsApi, courseApi } from '../../../../apis';
import { CreateCourseDto, Lesson } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { UploadLesson } from '../../../../components/modals/UploadLesson';
import { UploadDto } from '../../../../constants/dto';
import { ActionUser } from '../../../../constants/enum';
import { helper } from '../../../../util/common';
import { regexImage } from '../../../../validate/validator.validate';
import ListItem from '../../lesson';

interface backgroudInterface {
  id: string | undefined;
  source: string | undefined;
}

const CreateCourse = () => {
  const intl = useIntl();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Lesson[]>([]);
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [backgroud, setBackgroud] = useState<backgroudInterface>({ id: undefined, source: undefined });

  const { mutate: UploadFile, status: statusUploadFile } = useMutation(
    (dto: UploadDto) => assetsApi.assetControllerUploadFile(dto.file, undefined, dto.s3FilePath),
    {
      onSuccess: ({ data }) => {
        setBackgroud({
          ...data,
        } as backgroudInterface);
        setLoading(false);
      },
      onError: (error: any) => {
        console.log('error: ', error);
      },
    }
  );

  const { mutate: CreateCourse, status: statusCreateCourse } = useMutation(
    (dto: CreateCourseDto) => courseApi.courseControllerCreate(dto),
    {
      onSuccess: (data) => {
        helper.showSuccessMessage(ActionUser.CREATE, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      helper.showErroMessage('FILE.NOT_SUPPORT', intl);
      return;
    }
    setLoading(true);
    UploadFile({ file, assetFolderId: undefined, s3FilePath: 'course' });
  };

  const handleOnFinish = (value: any) => {
    CreateCourse({
      ...value,
      backgroundId: backgroud?.id ?? undefined,
      lesson: items,
    });
    navigate(-1);
  };

  return (
    <>
      <FormWrap
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
        className="mx-auto"
        style={{ maxWidth: '723px' }}
      >
        <div className="d-flex align-items-center">
          <span className="pointer width-24" onClick={() => navigate(-1)}>
            <IconSVG type="left-arrow" />
          </span>
          <span className="color-000000 font-weight-400 font-base font-size-18" style={{ marginLeft: '7px' }}>
            科目追加
          </span>
        </div>
        <div className="border border-D9D9D9 rounded p-4 mt-24">
          <div className="mt-43 d-flex align-items-center">
            <Divider type="vertical" className="height-37 bg-000000" />
            <Form.Item name={'title'} className="m-0 flex-grow-1">
              <CustomInput
                placeholder="科目名"
                className="border-unset color-8B8B8B font-weight-700 font-base font-size-32"
              />
            </Form.Item>
          </div>
          <div className="mt-28">
            <Form.Item name={'backgroundId'} rules={[{ required: true, message: 'Hãy chọn ảnh bìa' }]}>
              {!!loading ? (
                <Spin></Spin>
              ) : (
                <div className="width-230 height-160 bg-F1F1F1 rounded position-relative">
                  {!!backgroud?.source ? (
                    <CustomImage src={helper.getSourceFile(backgroud?.source)} alt="alt" />
                  ) : (
                    <Upload
                      customRequest={customRequest}
                      maxCount={1}
                      disabled={loading}
                      className="position-absolute top-50 start-50 translate-middle"
                    >
                      <Button type="text" icon={<UploadOutlined />} className="color-D82C1C">
                        アップロード
                      </Button>
                    </Upload>
                  )}
                </div>
              )}
            </Form.Item>
          </div>

          <div className="mt-39">
            <Form.Item label="概要" name={'introduce'} className="color-000000 font-weight-500 font-base font-size-16">
              <TextArea rows={4} placeholder="内容" className="color-8B8B8B font-weight-400 font-base font-size-14" />
            </Form.Item>
          </div>

          <div className="mt-40">
            <ListItem
              items={items}
              setItems={setItems}
              isShowCreate={isShowCreate}
              setIsShowCreate={setIsShowCreate}
              col={8}
            ></ListItem>
          </div>
          {items.length > 0 && (
            <div className="mt-4 text-left">
              <CustomButton onClick={form.submit} className="bg-D82C1C color-FFFFFF">
                Save
              </CustomButton>
            </div>
          )}
        </div>
      </FormWrap>
      <UploadLesson
        items={items}
        setItems={setItems}
        isShowCreate={isShowCreate}
        setIsShowCreate={() => setIsShowCreate(!isShowCreate)}
      ></UploadLesson>
    </>
  );
};
export default CreateCourse;
