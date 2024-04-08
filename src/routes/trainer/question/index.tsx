import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lessonApi } from '../../../apis';
import { Lesson } from '../../../apis/client-axios';
import IconSVG from '../../../components/icons/icons';
import { ANSWER_ORDER } from '../../../constants/constant';
import { TRAINER_ROUTE_PATH } from '../../../constants/route';

const LessonQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [lessonQuestionSelected, setLessonQuestionSelected] = useState<Lesson | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['getQestionByCourseId', { id, page, size, sort, fullTextSearch }],
    queryFn: () => lessonApi.lessonControllerGet(page, id as string, size, sort, fullTextSearch),
    enabled: !!id,
  });
  const renderRowQuestion = (value: Lesson[]) => {
    return (
      <>
        <div className="d-flex flex-row justify-content-between align-items-center mb-2 mt-48">
          <span className="color-000000 font-weight-500 font-base font-size-16">テスト</span>
          <Button
            type="text"
            className="width-70 height-47 bg-D82C1C color-FFFFFF"
            onClick={() => navigate(TRAINER_ROUTE_PATH.LESSON(value[0].id), { state: { courseId: value[0].courseId } })}
          >
            追加
          </Button>
        </div>
        <div className="overflow-auto mt-32" style={{ maxHeight: '70vh' }}>
          {value.map((item) => (
            <div
              className="d-flex flex-column justify-content-around bg-F3F3F3 rounded mb-2"
              style={{ padding: '16px 24px' }}
            >
              <div>
                <Button type="text" className="min-width-113 height-34 bg-D82C1C3D color-D82C1C rounded">
                  ビデオ学習: {item.index}
                </Button>
              </div>
              <div className="d-flex justify-content-between">
                <span className="color-121212 font-weight-700 font-base font-size-18">{item?.title}</span>
                <Button type="text" onClick={() => setLessonQuestionSelected(item)}>
                  <IconSVG type="right-arrow" />
                </Button>
              </div>
              <span className="color-121212 font-weight-400 font-base font-size-14">
                {item?.lessonQuestion?.length}問
              </span>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderRowQuestionAnswer = (value: Lesson) => {
    return (
      <div className="mt-48">
        <span className="color-1A1A1A font-weight-700 font-base font-size-20">ビデオ学習: {value.index}</span>
        <div className="d-flex flex-row justify-content-between align-items-center mb-2 mt-24">
          <div>テスト </div>
          <Button
            type="text"
            className="min-width-70 height-47 bg-D82C1C color-FFFFFF"
            onClick={() => navigate(TRAINER_ROUTE_PATH.LESSON(value?.id), { state: { courseId: value.courseId } })}
          >
            変更
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center text-center mt-12 bg-F1F1F1 height-49 rounded">
          <span className="color-1A1A1A font-weight-700 font-base font-size-18">
            テスト {value.index} ( {value?.lessonQuestion?.length || 0} )
          </span>
        </div>
        {value.lessonQuestion.map((question, index) => {
          return (
            <div>
              <div
                className="d-flex flex-column justify-content-around rounded p-3 pointer gap-3 border border-F1F1F1"
                style={{ marginBottom: '12px' }}
              >
                <span className="color-1A1A1A font-weight-500 font-base font-size-16">
                  {index + 1}. {question.question}
                </span>
                <div className="gap-5 d-flex">
                  {question?.lessonQuestionAnswer?.map((answer, index) => (
                    <span className="color-1A1A1A font-weight-400 font-base font-size-14">
                      {ANSWER_ORDER[index]}. {answer.answer}
                    </span>
                  ))}
                </div>
                <span className="color-D82C1C font-weight-600 font-base font-size-16">回答: {question?.answer}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {!!lessonQuestionSelected
        ? renderRowQuestionAnswer(lessonQuestionSelected)
        : renderRowQuestion(data?.data?.content || [])}
    </>
  );
};

export default LessonQuestion;
