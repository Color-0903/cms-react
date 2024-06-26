import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../apis';
import TableWrap from '../../../components/TableWrap';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { QUERY_LIST_USER } from '../../../util/contanst';
import { helper } from '../../../util/helper';

const ListUser = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_USER, { page, size, fullTextSearch }],
    queryFn: () => userApi.userControllerGetAllDoctor(page, size, undefined, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
    }
    setIsShowModalDelete(undefined);
  };

  return (
    <Spin spinning={isLoading}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'user.title' })}</div>
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
            width={'15%'}
            render={(_, record, index) => <>{helper.renderIndex(page, index)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.fullName',
            })}
            render={(_, record) => <>{_.firstName + ' ' + _.lastName}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.email',
            })}
            dataIndex="emailAddress"
          />
          <Column
            title={intl.formatMessage({
              id: 'table.phone',
            })}
            dataIndex="phoneNumber"
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div onClick={() => navigate(helper.showDetail(record.userId))} className="pointer">
                  <IconSVG type="edit" />
                </div>
                <div onClick={() => setIsShowModal({ id: record.id, name: record.name })} className="pointer">
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
        onSubmit={() => handleDelete}
        onClose={() => {
          setIsShowModal(undefined);
        }}
      />
    </Spin>
  );
};

export default ListUser;
