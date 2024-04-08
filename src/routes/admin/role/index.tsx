import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import Column from 'antd/es/table/Column';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { roleApi } from '../../../apis';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import { helper } from '../../../util/common';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { QUERY_LIST_ROLE } from '../../../util/contanst';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });
  const queryClient = useQueryClient();

  const { authUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadRole, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateRole, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteRole, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.DeleteRole, authUser)),
      });
    }
  }, [authUser]);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_ROLE, { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
  });

  const { mutate: DeleteRole, status: statusDeleteRole } = useMutation(
    (id: string) => roleApi.roleControllerDelete(id),
    {
      onSuccess: (data) => {
        helper.showSuccessMessage(ActionUser.DELETE, intl);
        queryClient.invalidateQueries([QUERY_LIST_ROLE]);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const handleRoleEdit = (id: string) => {
    navigate(helper.showDetail(id));
  };

  const handleRoleDelete = (id: string) => {
    DeleteRole(id);
  };

  return (
    <Card id="role-management">
      <div className="role-management__header">
        <div className="role-management__header__title">
          {intl.formatMessage({
            id: 'role.list.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          disabled={!permission.create}
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_ROLE);
          }}
        >
          {intl.formatMessage({
            id: 'role.list.button.add',
          })}
        </CustomButton>
      </div>
      <CustomInput
        placeholder={intl.formatMessage({
          id: 'role.list.search',
        })}
        prefix={<IconSVG type="search" />}
        className="input-search"
      />
      {permission.read && (
        <TableWrap
          className="custom-table"
          data={data?.data.content}
          isLoading={isLoading}
          page={page}
          size={size}
          total={data?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'role.list.table.code',
            })}
            dataIndex="code"
            width={'15%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'role.list.table.role',
            })}
            dataIndex="name"
          />
          <Column
            title={intl.formatMessage({
              id: 'role.list.table.action',
            })}
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="action-role">
                <div onClick={() => handleRoleEdit(record.id)} className={permission.update ? '' : 'disable'}>
                  <IconSVG type="edit" />
                </div>
                <span className="divider"></span>
                <div onClick={() => () => handleRoleDelete(record.id)} className={permission.delete ? '' : 'disable'}>
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      )}
    </Card>
  );
};

export default ListRole;
