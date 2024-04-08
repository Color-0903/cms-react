import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Row } from 'antd';
import { debounce } from 'lodash';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../../../apis';
import { Course } from '../../../apis/client-axios';
import CustomImage from '../../../components/Image/CustomImage';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { LessonElement } from '../../../components/video/LessonElement';
import { ActionUser } from '../../../constants/enum';
import { TRAINER_ROUTE_NAME } from '../../../constants/route';
import { helper } from '../../../util/helper';

const ListCourse: FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [courseDelete, setCourseDelete] = useState<{ id: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['getCourseById', { page, size, sort, fullTextSearch }],
    queryFn: () => courseApi.courseControllerGet(page, undefined, size, sort, fullTextSearch),
  });

  const deleteCourse = useMutation((id: string) => courseApi.courseControllerDelete(id), {
    onSuccess: ({ data }) => {
      helper.showSuccessMessage(ActionUser.DELETE, intl);
      queryClient.invalidateQueries(['getCourseById']);
    },
    onError: (error: any) => {
      helper.showErroMessage(error.response.data, intl);
    },
  });

  const CourseContent = (values: Course) => {
    return (
      <div className="h-100 bg-D9D9D9 rounded">
        {!!values.background?.source && (
          <CustomImage preview={false} src={helper.getSourceFile(values.background?.source)}></CustomImage>
        )}
        <div className="w-100 d-flex justify-content-between align-items-center position-absolute bottom-5 px-3">
          <div className="d-flex flex-column">
            <span className="color-FFFFFF text-one-line">{values.title}</span>
            <span className="color-FFFFFF text-one-line">{values.introduce}</span>
          </div>
          <Button type="text" onClick={() => navigate(helper.showDetail(values?.id))}>
            <IconSVG type="course-right-arrow" />
          </Button>
        </div>
      </div>
    );
  };

  const handleDeleteCourse = () => {
    if (courseDelete?.id) {
      deleteCourse.mutate(courseDelete?.id as string);
      setCourseDelete(null);
    }
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  return (
    <div>
      <header className="color-D82C1C font-weight-700 font-base font-size-32">科目</header>
      <div className="width-420 mt-25">
        <CustomInput placeholder="検索" onChange={(e) => debouncedUpdateInputValue(e.target.value)} />
      </div>
      <Row gutter={16} className="mt-9">
        <Col span={6} className="gutter-row height-250 mt-16 ">
          <div className="top-50 h-100 text-center bg-D9D9D9 rounded">
            <CustomButton
              type="text"
              onClick={() => navigate(TRAINER_ROUTE_NAME.CREATE)}
              className="width-113 position-relative top-50"
            >
              <div className="d-flex align-items-center justify-content-between">
                <IconSVG type="create" />
                <span className="font-weight-700 font-base">科目追加</span>
              </div>
            </CustomButton>
          </div>
        </Col>
        {data?.data?.content && data?.data?.content?.length > 0 && (
          <>
            {data?.data?.content?.map((item) => {
              return (
                <LessonElement
                  onDelete={() => setCourseDelete({ id: item.id })}
                  children={CourseContent(item)}
                  isShowClose={true}
                  className="height-250"
                />
              );
            })}
          </>
        )}
      </Row>
      <ConfirmModel
        visible={!!courseDelete}
        onSubmit={handleDeleteCourse}
        onClose={() => setCourseDelete(null)}
      />
    </div>
  );
};

export default ListCourse;
