import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, message, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { voucherApi } from '../../../apis';
import CustomImage from '../../../components/Image/CustomImage';
import TableWrap from '../../../components/TableWrap';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { QUERY_LIST_USER_VOUCHER } from '../../../util/contanst';
import { helper } from '../../../util/helper';
import { RecallVoucherDto } from '../../../apis/client-axios';

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
    queryKey: [QUERY_LIST_USER_VOUCHER, { page, size, fullTextSearch }],
    queryFn: () => voucherApi.voucherControllerUserVoucher(page, size, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const RecallVoucher = useMutation((dto: RecallVoucherDto) => voucherApi.voucherControllerRecall(dto), {
    onSuccess: (data: any) => {
      message.success(intl.formatMessage({ id: `common.recall` }));
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

  const onSubmit = () => {
    setIsShowModal(undefined);
    if (isShowModal?.id) {
      RecallVoucher.mutate({ userId: isShowModal?.id });
    }
  };

  return (
    <Spin spinning={isLoading || RecallVoucher.isLoading}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'user.title' })}</div>
        </div>
        <CustomInput
          allowClear
          onChange={(e) => debouncedUpdateInputValue(e?.target?.value)}
          placeholder={intl.formatMessage({ id: 'common.search' })}
          prefix={<IconSVG type="search" />}
          className="w-44 mt-32"
        />
        <TableWrap
          className="custom-table mt-32"
          data={data?.data?.content}
          isLoading={false}
          page={page}
          size={size}
          total={1}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'table.image',
            })}
            width={'15%'}
            render={(_, record, index) => {
              return (
                <div style={{ width: '80px' }}>
                  <CustomImage src={helper.getSourceFile((record as any)?.asset?.source)} alt=".." />
                </div>
              );
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.name',
            })}
            render={(_, record) => <>{_.displayName}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.email',
            })}
            render={(_, record) => <>{_.identifier}</>}
          />
          <Column
            align="center"
            title={intl.formatMessage({
              id: 'voucher.quantity',
            })}
            render={(_, record) => <>{_?.vouchers?.length}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <Button onClick={() => setIsShowModal({ id: _?.id, name: _?.identifier })}>Thu hồi</Button>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      </Card>
      <ConfirmModel
        visible={!!isShowModal?.id}
        onSubmit={onSubmit}
        onClose={() => {
          setIsShowModal(undefined);
        }}
      />
    </Spin>
  );
};

export default ListUser;
