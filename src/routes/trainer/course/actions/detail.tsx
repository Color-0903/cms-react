import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Form, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { courseApi } from '../../../../apis';
import { Lesson, UpdateCourseDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomImage from '../../../../components/Image/CustomImage';
import CustomButton from '../../../../components/buttons/CustomButton';
import { UploadLesson } from '../../../../components/modals/UploadLesson';
import { ActionUser } from '../../../../constants/enum';
import { helper } from '../../../../util/common';
import ListItem from '../../lesson';
import LessonQuestion from '../../question';
import Lessonchedule from '../../schedule';

const tabs = {
  lesson: 'lesson',
  question: 'question',
  schedule: 'schedule',
};

const DetailCourse = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const [isShowCreate, setIsShowCreate] = useState(false);

  const [items, setItems] = useState<Lesson[]>([]);
  const [showTab, setShowTab] = useState<string>(tabs.lesson);

  const { data, isLoading } = useQuery({
    queryKey: ['getCourseById', id],
    queryFn: () => courseApi.courseControllerGetById(id as string),
    enabled: !!id,
  });

  const { mutate: UpdateCourse, isLoading: updateCourseLoading } = useMutation(
    (dto: UpdateCourseDto) => courseApi.courseControllerUpdate(id as string, dto),
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
    if (data?.data?.lesson) {
      setItems(data?.data?.lesson as Lesson[]);
    }
  }, [data]);

  const renderTab = (tab: string) => {
    if (tab === tabs.question) {
      return <LessonQuestion></LessonQuestion>;
    } else if (tab === tabs.schedule) {
      return <Lessonchedule></Lessonchedule>;
    } else {
      return (
        <div className="mt-48">
          <ListItem
            items={items}
            setItems={setItems}
            isShowCreate={isShowCreate}
            setIsShowCreate={setIsShowCreate}
          ></ListItem>
          <div className="text-right">
            <CustomButton onClick={form.submit} disabled={!!updateCourseLoading} className="bg-D82C1C color-FFFFFF">
              保存
            </CustomButton>
          </div>
        </div>
      );
    }
  };

  const handleOnFinish = (value: any) => {
    if (!!id) {
      UpdateCourse({
        ...data?.data,
        lesson: items,
      });
    }
  };

  return (
    <Card id="course-management">
      {!!isLoading ? (
        <Spin></Spin>
      ) : (
        <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
          <div className="d-flex flex-row gap-24">
            <div className="d-flex flex-column w-30">
              <div>
                <CustomImage src={helper.getSourceFile(data?.data?.background?.source)} alt="alt" />
              </div>
              <span className="color-8B8B8B font-weight-400 font-base font-size-12 mt-26">概要</span>
              <span className="color-000000 font-weight-400 font-base font-size-12 mt-10">{data?.data?.introduce}</span>
            </div>
            <div className="d-flex flex-column w-70">
              <span className="color-D82C1C font-weight-700 font-base font-size-32">{data?.data?.title}</span>
              <div className="d-flex flex-row gap-24 mt-42">
                <Button
                  type="text"
                  onClick={() => setShowTab(tabs.lesson)}
                  className={`${showTab === tabs.lesson && 'active'} min-width-121 height-57 bg-F1F1F1`}
                >
                  ビデオ学習
                </Button>
                <Button
                  type="text"
                  onClick={() => setShowTab(tabs.question)}
                  className={`${showTab === tabs.question && 'active'} min-width-121 height-57 bg-F1F1F1`}
                >
                  テスト
                </Button>
                <Button
                  type="text"
                  onClick={() => setShowTab(tabs.schedule)}
                  className={`${showTab === tabs.schedule && 'active'} min-width-121 height-57 bg-F1F1F1`}
                >
                  カレンダー
                </Button>
              </div>
              {renderTab(showTab)}
            </div>
          </div>
        </FormWrap>
      )}
      <UploadLesson
        items={items}
        setItems={setItems}
        isShowCreate={isShowCreate}
        setIsShowCreate={() => setIsShowCreate(!isShowCreate)}
      ></UploadLesson>
    </Card>
  );
};
export default DetailCourse;
