import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Divider, Form, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { lessonApi, lessonQuestionApi } from '../../../../apis';
import { LessonQuestion, QuestionDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomDateTimePicker from '../../../../components/dateTime/CustomDateTimePicker';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';
import CustomSwitch from '../../../../components/switch/CustomSwitch';
import CustomeVideo from '../../../../components/video/CustomVideo';
import { ANSWER_ORDER } from '../../../../constants/constant';
import { ActionUser } from '../../../../constants/enum';
import { helper } from '../../../../util/helper';

const LessonQuestionAction = () => {
  const { id } = useParams();
  const intl = useIntl();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [lessonId, setLessonId] = useState<String | undefined>(id);
  const [form] = Form.useForm<any>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number | undefined>(undefined);
  const [video, setVideo] = useState<string>();
  const [questions, setQuestions] = useState<LessonQuestion[] | []>([]);

  const { data: lessonList } = useQuery({
    queryKey: ['lessonList', { state, page, size }],
    queryFn: () => lessonApi.lessonControllerGet(page, state?.courseId as string, size),
    enabled: !!state?.courseId,
  });

  const { data: lessonById } = useQuery({
    queryKey: ['getLessonById', lessonId],
    queryFn: () => lessonApi.lessonControllerGetById(lessonId as string),
    enabled: !!lessonId,
    onSuccess: ({ data }) => {
      let time = data?.limitedTime?.split(':').map(Number);
      if (!time) time = [0, 0];
      const timeValue = moment().set({ hour: time[0], minute: time[1] });
      form.setFieldsValue({ ...data, limitedTime: timeValue });
      setVideo(data?.video?.source);
      setQuestions(data.lessonQuestion);
    },
  });

  const { mutate: createLessonQuestion, isLoading: isLoadingCreateLessonQuestion } = useMutation(
    (dto: QuestionDto) => lessonQuestionApi.lessonquestionControllerCreate(dto),
    {
      onSuccess: (data) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuid(),
        question: '',
        answer: '',
        lessonQuestionAnswer: [
          ANSWER_ORDER.map((item) => {
            return { answer: '' };
          }),
        ],
      } as any,
    ]);
  };

  const handeChangeAnswer = (questionId: string, answerIndex: string) => {
    const listAnswer = form.getFieldValue('lessonQuestionAnswer');
    const newAnswer = listAnswer[answerIndex].answer;
    const questionIndex = questions.findIndex((item: any) => item.id === questionId);
    const listKey = Object.keys(listAnswer).filter((key) => key.split('_')[0] == questionIndex.toString());
    const newListAnswer = listKey.map((item) => listAnswer[item]);
    const newQuestion = [...questions];
    newQuestion[questionIndex] = {
      ...newQuestion[questionIndex],
      answer: newAnswer,
      lessonQuestionAnswer: newListAnswer,
    };
    setQuestions(newQuestion);
  };

  const handleOnFinish = (value: any) => {
    const listQuestion = questions.map((item: any, index) => {
      return { ...item, lessonId: lessonId, question: value.question[index].question ?? item.question };
    });

    const findInValid = listQuestion.find((item) => item.question.trim() === '' || item.answer.trim() === '');
    if (findInValid) return helper.showErroMessage('DATA_NOT_ENGNOUGH', intl);

    const prams = {
      limitedTime: value.limitedTime.format('HH:mm'),
      lessonId: lessonId,
      lessonQuestion: listQuestion,
    };
    createLessonQuestion(prams as any);
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '732px' }}>
      <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
        <div className="d-flex align-items-center">
          <span className="pointer width-24" onClick={() => navigate(-1)}>
            <IconSVG type="left-arrow" />
          </span>
          <span className="color-000000 font-weight-400 font-base font-size-18" style={{ marginLeft: '7px' }}>
            学習ビデオ詳細
          </span>
        </div>
        <div className="mt-42 border-D9D9D9 rounded" style={{ padding: '0 32px 82px' }}>
          <span className="d-block color-000000 font-weight-700 font-base font-size-16 mt-20">テスト</span>
          <div className="d-flex flex-row justify-content-between align-items-center gap-3 mt-32">
            <div className="w-40">{video ? <CustomeVideo src={helper.getSourceFile(video)} /> : <Spin></Spin>}</div>
            <Form.Item
              label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">ビデオ学習</span>}
              className="w-60"
              rules={[{ required: true }]}
              style={{ marginLeft: '32px' }}
            >
              <CustomSelect
                defaultValue={lessonId}
                onChange={(value: any) => setLessonId(value)}
                options={lessonList?.data?.content?.map((item) => {
                  return {
                    value: item.id,
                    label: item.title,
                  };
                })}
              />
            </Form.Item>
          </div>
          <div className="mt-32 d-flex align-items-center justify-content-between gap-4">
            <Form.Item
              className="flex-grow-1"
              label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">タイトル</span>}
              name={'title'}
            >
              <CustomInput disabled />
            </Form.Item>
            <Form.Item
              label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">時間</span>}
              name={'limitedTime'}
              rules={[{ required: true, message: '期間限定を選択してください' }]}
            >
              <CustomDateTimePicker
                dateFormat={'hh:mm'}
                placeHolder="00:00"
                suffixIcon={<IconSVG type="date-picker" />}
              />
            </Form.Item>
          </div>
          <div className="mt-24">
            <Divider type="horizontal" />
          </div>
          <div className="d-flex justify-content-end mt-48">
            <Button
              className="width-86 height-32 bg-FFFFFF color-D82C1C border-D82C1C px-1 d-flex justify-content-between"
              onClick={handleAddQuestion}
            >
              <span className="color-D82C1C font-weight-500 font-base font-size-16">追加</span>
              <IconSVG type="create" />
            </Button>
          </div>
          <div className="mt-24" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            {questions.map((question: any, questionIndex) => {
              const qs = question?.question ? question?.question : null;
              return (
                <div className="mt-1">
                  <Form.Item
                    label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">質問</span>}
                    name={['question', questionIndex, 'question']}
                    rules={[{ required: true, message: '質問を入力してください' }]}
                    initialValue={qs ?? ''}
                  >
                    <TextArea rows={3} placeholder="質問" defaultValue={question.question} />
                  </Form.Item>
                  {ANSWER_ORDER.map((item: any, answerIndex) => {
                    const value =
                      question?.lessonQuestionAnswer && question?.lessonQuestionAnswer?.length > 0
                        ? question?.lessonQuestionAnswer[answerIndex]?.answer
                        : null;
                    const index = questionIndex + '_' + answerIndex;
                    return (
                      <div className="d-flex justify-content-between align-items-center">
                        <Form.Item
                          label={<span className="color-8B8B8B font-weight-400 font-base font-size-12">{item}</span>}
                          name={['lessonQuestionAnswer', index, 'answer']}
                          className="flex-grow-1"
                          rules={[{ required: true, message: '答えを入力してください' }]}
                          initialValue={value ? value : ''}
                        >
                          <CustomInput />
                        </Form.Item>
                        {
                          <CustomSwitch
                            style={{ marginLeft: '8px' }}
                            checkedChildren="正解"
                            unCheckedChildren="不正解"
                            onChange={() => handeChangeAnswer(question.id, index)}
                            checked={value?.trim() === question.answer?.trim()}
                          />
                        }
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="text-right  mt-40">
            <CustomButton
              onClick={form.submit}
              className="bg-D82C1C color-FFFFFF"
              disabled={isLoadingCreateLessonQuestion}
            >
              保存
            </CustomButton>
            <CustomButton type="text" className="color-585858" onClick={() => navigate(-1)}>
              キャンセル
            </CustomButton>
          </div>
        </div>
      </FormWrap>
    </div>
  );
};

export default LessonQuestionAction;
