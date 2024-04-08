import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import CustomInput from '../../../components/input/CustomInput';
import { surveyApi } from '../../../apis';
import { debounce } from 'lodash';
import CustomSelect from '../../../components/select/CustomSelect';
import TableWrap from '../../../components/TableWrap';
import Column from 'antd/es/table/Column';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import moment from 'moment';
import { FORMAT_DATE_VN } from '../../../constants/common';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CustomHandleSuccess } from '../../../components/response/success';
import { CustomHandleError } from '../../../components/response/error';
import { QUERY_LIST_NEWS, QUERY_LIST_SURVEY } from '../../../util/contanst';

const ListSurvey = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [status, setStatus] = useState<boolean>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadSurvey, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateSurvey, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteSurvey, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateSurvey, authUser)),
      });
    }
  }, [authUser]);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_SURVEY, { page, size, sort, fullTextSearch, status }],
    queryFn: () => surveyApi.surveyQuestionControllerGet(page, size, sort, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: DeleteSurvey, status: statusDeleteNew } = useMutation(
    (id: string) => surveyApi.surveyQuestionControllerDelete(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_LIST_SURVEY]);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteSurvey(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
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
    <Card id="survey-management">
      <div className="survey-management__header">
        <div className="survey-management__header__title">
          {intl.formatMessage({
            id: 'survey.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permission.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_SURVEY);
          }}
        >
          {intl.formatMessage({
            id: 'survey.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="survey-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'survey.list.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
          onChange={(e) => {
            if (debouncedUpdateInputValue.cancel) {
              debouncedUpdateInputValue.cancel();
            }
            debouncedUpdateInputValue(e.target.value);
          }}
          allowClear
        />
        <CustomSelect
          className="select-status"
          placeholder={intl.formatMessage({
            id: 'survey.list.select.status.place-holder',
          })}
          onChange={(e) => {
            if (e === '') {
              setStatus(undefined);
            } else {
              setStatus(Boolean(Number(e)));
            }
            setPage(1);
          }}
          options={[
            {
              value: '',
              label: intl.formatMessage({
                id: 'common.option.all',
              }),
            },
            {
              value: 1,
              label: intl.formatMessage({
                id: 'survey.list.filter.status.yes',
              }),
            },
            {
              value: 0,
              label: intl.formatMessage({
                id: 'survey.list.filter.status.no',
              }),
            },
          ]}
        />
      </div>
      {permission.read && (
        <TableWrap
          className={`custom-table ${data?.data.content && data?.data.content?.length > 0 && 'table-survey'}`}
          data={data?.data.content}
          // isLoading={isLoading}
          page={page}
          size={size}
          total={data?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'survey.list.table.title',
            })}
            dataIndex="question"
            width={'30%'}
            render={(_, record: any) => {
              return <div className="title-survey">{record.question}</div>;
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'survey.list.table.createDate',
            })}
            dataIndex="createDate"
            width={'15%'}
            render={(_, record: any) => {
              return <div>{moment(record.createdOnDate).format(FORMAT_DATE_VN)}</div>;
            }}
          />
          {/* <Column
          title={intl.formatMessage({
            id: 'survey.list.table.content',
          })}
          dataIndex="content"
          width={'25%'}
          render={(_, record: any) => {
            return <div className="content-survey" dangerouslySetInnerHTML={{ __html: record.content }}></div>;
          }}
        /> */}
          <Column
            title={intl.formatMessage({
              id: 'survey.list.table.action',
            })}
            dataIndex="action"
            width={'20%'}
            render={(_, record: any) => (
              <div className="action-survey">
                <div
                  className={permission.read ? '' : 'disable'}
                  onClick={() => permission.read && navigate(`detail/${record.id}`)}
                >
                  <IconSVG type="edit" />
                </div>
                <span className="divider"></span>
                <div
                  className={permission.delete ? '' : 'disable'}
                  onClick={() => permission.delete && setIsShowModalDelete({ id: record.id, name: record.title })}
                >
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      )}
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        visible={!!isShowModalDelete}
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};
export default ListSurvey;
