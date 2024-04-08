import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import Column from 'antd/es/table/Column';
import React, { useEffect, useState } from 'react';
import { customerApi, recruitApi, trainerApi } from '../../../apis';
import { Customer } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import CustomInput from '../../../components/input/CustomInput';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { useNavigate } from 'react-router-dom';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { QUERY_LIST_RECRUITMENT, QUERY_LIST_TRAINER, QUERY_LIST_USER } from '../../../util/contanst';
import { CustomHandleSuccess } from '../../../components/response/success';
import { CustomHandleError } from '../../../components/response/error';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';

const ListTrainer = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();

  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_TRAINER, { page, size, fullTextSearch }],
    queryFn: () => trainerApi.trainerControllerGet(page, size, undefined, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });
  const { authUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadTrainer, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateTrainer, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteTrainer, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.DeleteTrainer, authUser)),
      });
    }
  }, [authUser]);

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const { mutate: DeleteUser, status: statusDeleteUser } = useMutation(
    (id: string) => trainerApi.trainerControllerDelete(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_LIST_TRAINER]);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteUser(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
  };
  return (
    <Card>
      <div className="new-management__header">
        <div className="new-management__header__title">
          {intl.formatMessage({
            id: 'trainer.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permission.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_TRAINER);
          }}
        >
          {intl.formatMessage({
            id: 'trainer.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="new-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'trainer.list.search',
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
      <TableWrap
        data={data?.data.content}
        isLoading={isLoading}
        page={page}
        size={size}
        total={data?.data.total}
        setSize={setSize}
        setPage={setPage}
        showPagination={true}
      >
        <Column title="ID" dataIndex="userId" />
        {/*<Column<Customer>*/}
        {/*  title={intl.formatMessage({*/}
        {/*    id: 'trainer.list.table.name',*/}
        {/*  })}*/}
        {/*  dataIndex="firstName"*/}
        {/*  render={(value, record) => {*/}
        {/*    return record?.fullName;*/}
        {/*  }}*/}
        {/*/>*/}
        <Column title="Email" dataIndex="emailAddress" />
        <Column
          title={intl.formatMessage({
            id: 'trainer.list.table.action',
          })}
          dataIndex="action"
          width={'20%'}
          render={(_, record: any) => (
            <div className="action-recruit">
              <div
                className={permission.read ? '' : 'disable'}
                onClick={() => permission.read && navigate(`detail/${record.userId}`)}
              >
                <IconSVG type="edit" />
              </div>
              <span className="divider"></span>
              <div
                className={permission.delete ? '' : 'disable'}
                onClick={() => permission.delete && setIsShowModalDelete({ id: record.userId, name: record.title })}
              >
                <IconSVG type="delete" />
              </div>
            </div>
          )}
          align="center"
        />
      </TableWrap>
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

export default ListTrainer;
