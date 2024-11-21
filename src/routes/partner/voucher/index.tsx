import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, message, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { voucherApi } from '../../../apis';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import CustomSelect from '../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../constants/common';
import { PARTNER_ROUTE_PATH } from '../../../constants/route';
import { UseStore } from '../../../hooks/useStore';
import { RootState } from '../../../store';
import { QUERY_LIST_VOUCHER } from '../../../util/contanst';
import { debounce } from 'lodash';

const ListVoucher = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();
  const [filter, setFilter] = useState<{ fullTextSearch: string; storeId: string | undefined }>({
    fullTextSearch: '',
    storeId: undefined,
  });
  const useStore = UseStore(authUser?.id);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_LIST_VOUCHER, { page, size, filter }],
    queryFn: () =>
      voucherApi.voucherControllerGetAll(page, size, filter?.fullTextSearch, authUser?.id, filter?.storeId),
    enabled: !!authUser?.id,
    staleTime: 1000,
  });

  const DeleteVoucher = useMutation((id: string) => voucherApi.voucherControllerDelete(id as string), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
      refetch();
    },
  });

  const debouncedFilter = debounce((value) => {
    const filter = value?.target?.value;
    if (!filter.trim()) {
      setFilter((prev) => {
        return {
          ...prev,
          fullTextSearch: '',
        };
      });
    } else {
      setFilter((prev) => {
        return {
          ...prev,
          fullTextSearch: filter,
        };
      });
    }
    setPage(1);
  }, 500);

  const handleDelete = () => {
    if (isShowModal && isShowModal.id) {
      DeleteVoucher.mutate(isShowModal.id);
    }
    setIsShowModal(undefined);
  };

  return (
    <Spin spinning={isLoading}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'voucher.title' })}</div>
        </div>
        <div className="d-flex justify-content-between align-items-end">
          <div className="d-flex align-items-end gap-3">
            <CustomInput
              allowClear
              placeholder={intl.formatMessage({ id: 'common.search' })}
              prefix={<IconSVG type="search" />}
              className="mt-32"
              onChange={debouncedFilter}
            />
            <CustomSelect
              options={useStore?.data?.content?.map((item) => {
                return {
                  label: item?.name,
                  value: item?.id,
                };
              })}
              placeholder={intl.formatMessage({ id: 'voucher.store' })}
              allowClear
              onChange={(value) => {
                setFilter((prev) => {
                  return {
                    ...prev,
                    storeId: value as string,
                  };
                });
              }}
              style={{ minWidth: '180px' }}
            />
          </div>
          <CustomButton icon={<PlusOutlined />} onClick={() => navigate(PARTNER_ROUTE_PATH.VOUCHER_MANAGEMENT_CREATE)}>
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
              id: 'table.code',
            })}
            width={'15%'}
            render={(_, record, index) => <>{(record as any)?.code}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.name',
            })}
            render={(_, record) => <>{(record as any)?.name}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.quantity',
            })}
            dataIndex="quantity"
            render={(_, record) => <>{_}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.discount',
            })}
            dataIndex="discount"
            render={(_, record) => <>{_} %</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.createdAt',
            })}
            dataIndex="releaseAt"
            render={(_, record) => <>{moment((record as any)?.releaseAt).format(FORMAT_DATE)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.status',
            })}
            dataIndex="isEnable"
            render={(_, record) => <>{(record as any)?.isEnable ? 'Có thể sử dụng' : 'Ngưng sử dụng'}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div
                  onClick={() => navigate(`${PARTNER_ROUTE_PATH.VOUCER_MANAGEMENT}/${record?.id}`)}
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

export default ListVoucher;
