import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, message, Spin, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { storeApi, userApi } from '../../../apis';
import TableWrap from '../../../components/TableWrap';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { QUERY_LIST_STORE, QUERY_LIST_USER } from '../../../util/contanst';
import { helper } from '../../../util/helper';
import CustomButton from '../../../components/buttons/CustomButton';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PARTNER_ROUTE_NAME, PARTNER_ROUTE_PATH } from '../../../constants/route';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import CustomImage from '../../../components/Image/CustomImage';

const STORE_STATUS: any = {
  PENDING: 'Chờ xác nhận',
  ACCEPT: 'Đã xác nhận',
  BLOCK: 'Bị khóa',
  CLOSE: 'Đóng cửa',
};

const STORE_STATUS_TOOLTIP: any = {
  PENDING: 'Cửa hàng của bạn đang chờ xác minh bởi quản trị viên',
  ACCEPT: 'Cửa hàng của bạn đã được xác minh bởi quản trị viên',
  BLOCK: 'Cửa hàng của bạn đã bị khóa',
  CLOSE: 'Cửa hàng của bạn đã đóng cửa',
};

const ListStore = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_LIST_STORE, { page, size, fullTextSearch }],
    queryFn: () => storeApi.storeControllerGetAll(page, size, fullTextSearch, authUser?.id),
    enabled: !!authUser?.id,
    staleTime: 1000,
  });

  const DeleteStore = useMutation((id: string) => storeApi.storeControllerDelete(id as string), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
      refetch();
    },
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
    if (isShowModal?.id) {
      setIsShowModal(undefined);
      DeleteStore.mutate(isShowModal?.id);
    }
  };

  return (
    <Spin spinning={isLoading || DeleteStore.isLoading}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'store.title' })}</div>
        </div>
        <div className="d-flex justify-content-between align-items-end">
          <CustomInput
            placeholder={intl.formatMessage({ id: 'common.search' })}
            prefix={<IconSVG type="search" />}
            className="w-44 mt-32"
          />
          <CustomButton icon={<PlusOutlined />} onClick={() => navigate(PARTNER_ROUTE_PATH.STORE_MANAGEMENT_CREATE)}>
            <span className="font-weight-600">{intl.formatMessage({ id: 'common.create' })}</span>
          </CustomButton>
        </div>
        <TableWrap
          className="custom-table mt-32"
          data={data?.data?.content}
          isLoading={false}
          page={page}
          size={size}
          total={data?.data?.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'table.index',
            })}
            width={'5%'}
            render={(_, record, index) => <>{helper.renderIndex(page, index + 1)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.image',
            })}
            width={'10%'}
            render={(_, record, index) => (
              <div style={{ width: '80px' }}>
                <CustomImage src={helper.getSourceFile((record as any)?.asset?.source)} alt=".." />
              </div>
            )}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.name',
            })}
            render={(_, record) => <div className="text-two-line">{(record as any)?.name}</div>}
          />
          <Column
            width={'20%'}
            title={intl.formatMessage({
              id: 'table.des',
            })}
            dataIndex="description"
            render={(_, record) => <div className="text-two-line">{(record as any)?.description}</div>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.phone',
            })}
            dataIndex="phone"
            render={(_, record) => <>{(record as any)?.phone}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.time',
            })}
            dataIndex="time"
            render={(_, record) => (
              <div>
                <div>{(record as any)?.openTime?.am}</div>
                <div>{(record as any)?.openTime?.pm}</div>
              </div>
            )}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.type',
            })}
            dataIndex="type"
            render={(_, record) => <>{(record as any)?.type}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.time',
            })}
            dataIndex="time"
            render={(_, record) => <>{(record as any)?.phone}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.status',
            })}
            dataIndex="status"
            render={(_, record) => (
              <Tooltip placement="top" title={STORE_STATUS_TOOLTIP[(record as any)?.status]} arrow={true}>
                <span className={(record as any)?.status}>{STORE_STATUS[(record as any)?.status]}</span>
              </Tooltip>
            )}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            dataIndex="action"
            width={'10%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div
                  onClick={() => navigate(`${PARTNER_ROUTE_PATH.STORE_MANAGEMENT}/${record?.id}`)}
                  className="pointer"
                >
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
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModal(undefined);
        }}
      />
    </Spin>
  );
};

export default ListStore;
