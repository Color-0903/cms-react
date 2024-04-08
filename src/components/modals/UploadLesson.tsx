import { PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Modal, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { assetsApi } from '../../apis';
import { Lesson } from '../../apis/client-axios';
import { UploadDto } from '../../constants/dto';
import { helper } from '../../util/common';
import { videoRegex } from '../../validate/validator.validate';
import FormWrap from '../FormWrap';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import CustomInput from '../input/CustomInput';
import { v4 as uuidv4 } from 'uuid';
interface UploadLessonProps {
  items: Lesson[];
  setItems: (value: any) => void;
  isShowCreate: boolean;
  setIsShowCreate: (value: boolean) => void;
}

export const UploadLesson = (props: UploadLessonProps) => {
  const { items, setItems, isShowCreate, setIsShowCreate } = props;
  const intl = useIntl();
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState<number>(0);
  const [videoUpload, setVideUpload] = useState<any[] | []>([]);

  const { mutate: UploadFile, status: statusUploadFile } = useMutation(
    (dto: UploadDto) => assetsApi.assetControllerUploadFile(dto.file, undefined, dto.s3FilePath),
    {
      onSuccess: ({ data }) => {
        setVideUpload([...videoUpload, { ...data }]);
        setLoading((pre) => (pre - 1 > 0 ? pre - 1 : 0));
      },
      onError: (error: any) => {
        console.log('error: ', error);
      },
    }
  );

  const removeVideo = (value: string) => {
    setVideUpload(videoUpload.filter((item) => item.id !== value));
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !videoRegex.test(file.name)) {
      helper.showErroMessage('FILE_NOT_SUPPORT', intl);
      return;
    }
    setLoading(loading + 1);
    UploadFile({ file, assetFolderId: undefined, s3FilePath: 'lesson' });
  };
  const handleOnFinish = (value: any) => {
    const lesson = videoUpload?.map((video, index) => {
      const id = uuidv4();
      return {
        ...value,
        id: id,
        index: items.length + index,
        video: video,
      };
    });
    setItems([...items, ...lesson]);
    setIsShowCreate(false);
    setVideUpload([]);
  };

  return (
    <Modal
      title={<span className="color-1A1A1A font-weight-700 font-size-16 font-base">Upload ビデオ学習</span>}
      className="ant-modal-custom"
      centered
      open={!!isShowCreate}
      onCancel={() => setIsShowCreate(!isShowCreate)}
      footer={[
        <CustomButton
          key="1"
          onClick={form.submit}
          disabled={loading > 0 || videoUpload.length < 1}
          className="bg-D82C1C color-FFFFFF mt-48"
        >
          {loading > 0 ? <Spin></Spin> : '保存'}
        </CustomButton>,
        <CustomButton key="2" onClick={() => setIsShowCreate(!isShowCreate)} type="text">
          キャンセル
        </CustomButton>,
      ]}
    >
      <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
        <div>
          <div className="mt-18">
            <Form.Item
              label={<span className="color-8B8B8B font-weight-400 font-size-12 font-base">タイトル</span>}
              name={'title'}
            >
              <CustomInput placeholder="タイトル" />
            </Form.Item>
          </div>
          <div className="mt-24">
            <Form.Item
              label={<span className="color-8B8B8B font-weight-400 font-size-12 font-base">内容</span>}
              name={'introduce'}
            >
              <TextArea rows={4} placeholder="内容" className="color-8B8B8B font-weight-400 font-size-14 font-base" />
            </Form.Item>
          </div>
          <div className="mt-24 d-flex align-items-center justify-content-between font-base">
            <span className="color-8B8B8B font-weight-400 font-size-12">ビデオ</span>
            <Form.Item rules={[{ required: true }]} className="m-0">
              <Upload showUploadList={false} customRequest={customRequest}>
                <Button className="color-D82C1C d-flex align-items-center">
                  <span>追加</span>
                  <PlusOutlined />
                </Button>
              </Upload>
            </Form.Item>
          </div>
          <div className="mt-15">
            {videoUpload.map((value) => {
              return (
                <div className="mt-1 w-100 height-42 bg-FFFFFF d-flex align-items-center justify-content-between border-D9D9D9 px-3 py-1">
                  <div className="d-flex flex-column">
                    <span className="color-000000 font-weight-500 font-size-12">{value?.name}</span>
                    <span className="color-8B8B8B font-weight-500 font-size-10">
                      {helper.convertByteToMb(value?.fileSize)} Mb
                    </span>
                  </div>
                  <span className="pointer" onClick={() => removeVideo(value?.id)}>
                    {' '}
                    <IconSVG type="close"></IconSVG>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </FormWrap>
    </Modal>
  );
};
