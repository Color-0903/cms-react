import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { roleApi } from '../../../apis';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { ActionUser } from '../../../constants/enum';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import { RootState } from '../../../store';
import { helper } from '../../../util/helper';
import { QUERY_LIST_ROLE } from '../../../util/contanst';

const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const { authUser } = useSelector((state: RootState) => state.auth);

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

  const handleDeleteRole = (id: string) => {
    if (isShowModal?.id) {
      DeleteRole(isShowModal?.id);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Card>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='font-weight-700 font-size-18 font-base'> {intl.formatMessage({ id: 'role.list.title' })}</div>
          <CustomButton icon={<IconSVG type="create" />} onClick={() => { navigate(ADMIN_ROUTE_PATH.CREATE_ROLE) }}>
            {intl.formatMessage({ id: 'common.create' })}
          </CustomButton>
        </div>
        <CustomInput
          placeholder={intl.formatMessage({ id: 'common.search' })}
          prefix={<IconSVG type="search" />}
          className="w-44 mt-32"
        />
        <TableWrap
          className="custom-table mt-32"
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
              id: 'table.code',
            })}
            dataIndex="code"
            width={'15%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.role',
            })}
            dataIndex="name"
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div onClick={() => handleRoleEdit(record.id)} className='pointer'>
                  <IconSVG type="edit" />
                </div>
                <div onClick={() => setIsShowModal({ id: record.id, name: record.name })} className='pointer'>
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      </Card>
      <ConfirmModel
        visible={!!isShowModal?.id}
        onSubmit={() => handleDeleteRole}
        onClose={() => {
          setIsShowModal(undefined);
        }}
      />
    </Spin>
  );
};

export default ListRole;
