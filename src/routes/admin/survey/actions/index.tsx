import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { surveyApi } from '../../../../apis';
import {
  CreateSurveyQuestionDto,
  CreateSurveyQuestionDtoTypeEnum,
  UpdateSurveyQuestionDto,
} from '../../../../apis/client-axios';
import CustomButton from '../../../../components/buttons/CustomButton';
import CustomInput from '../../../../components/input/CustomInput';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { ActionUser, PERMISSIONS } from '../../../../constants/enum';
import { CustomHandleError } from '../../../../components/response/error';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { ConfirmModel } from '../../../../components/modals/ConfirmModel';
import { QUERY_LIST_SURVEY, QUERY_SURVEY_DETAIL } from '../../../../util/contanst';

interface ListAnswer {
  id: number;
  answers: string;
}

const ActionSurvey = () => {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteSurvey, setIsDeleteSurvey] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [listAnswer, setListAnswer] = useState<ListAnswer[]>([
    { id: 1, answers: '' },
    { id: 2, answers: '' },
  ]);
  const [status, setStatus] = useState<CreateSurveyQuestionDtoTypeEnum>(CreateSurveyQuestionDtoTypeEnum.Option);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      console.log();
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadSurvey, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateSurvey, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteSurvey, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateSurvey, authUser)),
      });
    }
  }, [authUser]);
  const { data: dataSurvey, isFetching: loadingData } = useQuery(
    [QUERY_SURVEY_DETAIL, id],
    () => surveyApi.surveyQuestionControllerGetDetail(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        setTitle(response.data.question || '');
        const type = response.data.type;
        if (type === CreateSurveyQuestionDtoTypeEnum.Option) {
          const tempListAnswer = listAnswer;
          response.data.answers.forEach((item: any, index: number) => {
            tempListAnswer[index].answers = item.answer;
          });
          setListAnswer([...tempListAnswer]);
        }
        setStatus(type);
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: DeleteSurvey, isLoading: deleteLoading } = useMutation(
    (id: string) => surveyApi.surveyQuestionControllerDelete(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_LIST_SURVEY]);
        navigate(`/admin/${ADMIN_ROUTE_NAME.SURVEY_MANAGEMENT}`);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: surveyCreate, isLoading: createLoading } = useMutation(
    (createSurvey: CreateSurveyQuestionDto) => surveyApi.surveyQuestionControllerCreate(createSurvey),
    {
      onSuccess: ({ data }) => {
        navigate(`/admin/${ADMIN_ROUTE_NAME.SURVEY_MANAGEMENT}`);
        CustomHandleSuccess(ActionUser.CREATE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: surveyUpdate, isLoading: updateLoading } = useMutation(
    (updateSurvey: UpdateSurveyQuestionDto) => surveyApi.surveyQuestionControllerUpdate(id as string, updateSurvey),
    {
      onSuccess: ({ data }) => {
        navigate(`/admin/${ADMIN_ROUTE_NAME.SURVEY_MANAGEMENT}`);
        CustomHandleSuccess(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const onFinish = () => {
    setIsSubmit(true);
    if (status === CreateSurveyQuestionDtoTypeEnum.Option) {
      if (title.trim() === '' || listAnswer.some((item) => item.answers.trim() === '')) {
        return;
      }

      if (id) {
        surveyUpdate({
          type: status,
          question: title,
          answers: listAnswer.map((item) => {
            return {
              answer: item.answers,
            };
          }),
        });
      } else {
        surveyCreate({
          type: status,
          question: title,
          answers: listAnswer.map((item) => {
            return {
              answer: item.answers,
            };
          }),
        });
      }
    }
    if (status === CreateSurveyQuestionDtoTypeEnum.Text) {
      if (title.trim() === '') {
        return;
      }

      if (id) {
        surveyUpdate({
          type: status,
          question: title,
          answers: [],
        });
      } else {
        surveyCreate({
          type: status,
          question: title,
          answers: [],
        });
      }
    }
  };

  const handleDelete = () => {
    if (isDeleteSurvey && id) {
      DeleteSurvey(id);
    }
    setIsDeleteSurvey(false);
  };

  return (
    <Card id="create-survey-management">
      <Spin
        className="custom-spin"
        size="large"
        spinning={loadingData || createLoading || updateLoading || deleteLoading}
      >
        <div className="container-survey">
          <div className="right-container">
            <div className="right-container__content">
              {isSubmit && (
                <span className="text-error custom-label">
                  {intl.formatMessage({
                    id: 'survey.create.error.image',
                  })}
                </span>
              )}
              <div className="right-container__content__title">
                <div className="right-container__content__title__label">
                  {intl.formatMessage({
                    id: 'survey.create.title',
                  })}
                </div>
                <CustomInput
                  value={title}
                  className={`${isSubmit && title === '' && 'title-error'}`}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={255}
                />
                {isSubmit && title.trim() === '' && (
                  <span className="text-error">
                    {intl.formatMessage({
                      id: 'survey.create.error.title',
                    })}
                  </span>
                )}
              </div>
              <div className="right-container__content__status custom-switch">
                <div className="right-container__content__status__label">
                  {intl.formatMessage({
                    id: 'survey.create.status',
                  })}
                </div>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  value={status}
                  onChange={() => {
                    setStatus(
                      status === CreateSurveyQuestionDtoTypeEnum.Option
                        ? CreateSurveyQuestionDtoTypeEnum.Text
                        : CreateSurveyQuestionDtoTypeEnum.Option
                    );
                  }}
                  options={[
                    {
                      label: CreateSurveyQuestionDtoTypeEnum.Option,
                      value: CreateSurveyQuestionDtoTypeEnum.Option,
                    },
                    {
                      label: CreateSurveyQuestionDtoTypeEnum.Text,
                      value: CreateSurveyQuestionDtoTypeEnum.Text,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className={`left-container ${isSubmit && 'content-error'}`}>
            {status === CreateSurveyQuestionDtoTypeEnum.Option && (
              <>
                {listAnswer.map((item, index) => {
                  return (
                    <div key={item.id}>
                      <span>
                        {intl.formatMessage({
                          id: 'survey.answer.title',
                        })}
                        {index + 1}
                      </span>
                      <div className="left-container-option">
                        <CustomInput
                          value={item.answers}
                          className={`${isSubmit && title === '' && 'title-error'}`}
                          onChange={(e) => {
                            const value = e.target.value;
                            const temp = listAnswer;

                            for (let i = 0; i < temp.length; i++) {
                              if (temp[i].id === item.id) {
                                temp[i].answers = value;
                                break;
                              }
                            }
                            setListAnswer([...temp]);
                          }}
                          maxLength={255}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {isSubmit && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'survey.create.error.content',
                })}
              </span>
            )}
          </div>
          <div className="right-container__action">
            {id ? (
              <div className="more-action">
                <CustomButton
                  className="button-save"
                  onClick={() => {
                    permission.update && onFinish();
                  }}
                  disabled={!permission.update}
                >
                  {intl.formatMessage({
                    id: 'survey.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-delete"
                  onClick={() => {
                    permission.delete && setIsDeleteSurvey(true);
                  }}
                  disabled={!permission.delete}
                >
                  {intl.formatMessage({
                    id: 'survey.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={onFinish} disabled={!permission.create}>
                  {intl.formatMessage({
                    id: 'survey.create.button.create',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'survey.create.button.cancel',
                  })}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
        <ConfirmModel
          visible={isDeleteSurvey}
          onSubmit={handleDelete}
          onClose={() => setIsDeleteSurvey(false)}
        />
      </Spin>
    </Card>
  );
};

export default ActionSurvey;
