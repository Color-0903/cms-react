import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import CustomInput from '../../../components/input/CustomInput';
import { faqApi } from '../../../apis';
import { debounce } from 'lodash';
import TableWrap from '../../../components/TableWrap';
import Column from 'antd/es/table/Column';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import moment from 'moment';
import { FORMAT_DATE_VN } from '../../../constants/common';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CustomHandleSuccess } from '../../../components/response/success';
import { CustomHandleError } from '../../../components/response/error';
import { QUERY_LIST_FAQ } from '../../../util/contanst';

const FaqTab = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadHelp, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateHelp, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteHelp, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateHelp, authUser)),
      });
    }
  }, [authUser]);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_FAQ, { page, size, fullTextSearch }],
    queryFn: () => faqApi.faqControllerGet(page, size, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: DeleteFaq, status: statusDeleteFaq } = useMutation(
    (id: string) => faqApi.faqControllerDeleteFaq(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_LIST_FAQ]);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteFaq(isShowModalDelete.id);
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
    <Card id="faq-management">
      <div className="faq-management__header">
        <div className="faq-management__header__title">
          {intl.formatMessage({
            id: 'faq.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permission.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_FAQ_MANAGEMENT);
          }}
        >
          {intl.formatMessage({
            id: 'faq.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="faq-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'faq.list.search',
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
      </div>
      {permission.read && (
        <TableWrap
          className={`custom-table ${data?.data.content && data?.data.content?.length > 0 && 'table-faq'}`}
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
              id: 'faq.list.table.title',
            })}
            dataIndex="title"
            width={'30%'}
            render={(_, record: any) => {
              return <div className="title-faq">{record.title}</div>;
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'faq.list.table.createDate',
            })}
            dataIndex="createDate"
            width={'15%'}
            render={(_, record: any) => {
              return <div>{moment(record.createdOnDate).format(FORMAT_DATE_VN)}</div>;
            }}
          />
          {/* <Column
          title={intl.formatMessage({
            id: 'faq.list.table.content',
          })}
          dataIndex="content"
          width={'25%'}
          render={(_, record: any) => {
            return <div className="content-faq" dangerouslySetInnerHTML={{ __html: record.content }}></div>;
          }}
        /> */}
          <Column
            title={intl.formatMessage({
              id: 'faq.list.table.action',
            })}
            dataIndex="action"
            width={'20%'}
            render={(_, record: any) => (
              <div className="action-faq">
                <div
                  className={permission.read ? '' : 'disable'}
                  onClick={() => permission.read && navigate(`detail-faq/${record.id}`)}
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
      <ConfirmModel
        visible={!!isShowModalDelete}
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};
export default FaqTab;
