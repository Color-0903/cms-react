import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../../apis';
import { UpdateCustomerDto, UpdateCustomerDtoStatusEnum } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import CustomInput from '../../../components/input/CustomInput';
import { ActionUser } from '../../../constants/enum';
import { helper } from '../../../util/common';
export interface UpdateCustomerInterface {
  userId: string;
  dto: UpdateCustomerDto;
}

const ListCustomer = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingFetch } = useQuery({
    queryKey: ['getCustomers', { page, size, fullTextSearch }],
    queryFn: () =>
      customerApi.customerControllerGet(page, UpdateCustomerDtoStatusEnum.Pending, size, undefined, fullTextSearch),
  });

  const { mutate: UpdateCustomer, isLoading: isLoadingUpdateCustomer } = useMutation(
    (params: UpdateCustomerInterface) => customerApi.customerControllerUpdate(params.userId, params.dto),
    {
      onSuccess: (data) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
        queryClient.invalidateQueries(['getCustomers']);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const handleUpdateCustomer = (value: UpdateCustomerDtoStatusEnum, userId: string) => {
    UpdateCustomer({
      userId: userId,
      dto: {
        status: value,
      },
    });
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
    <Card>
      <div>
        <span className="color-D82C1C font-weight-700 font-base font-size-32">生徒一覧</span>
      </div>
      <CustomInput
        placeholder="検索"
        className="input-search width-420 height-48 mt-32"
        onChange={(e) => debouncedUpdateInputValue(e.target?.value.trim())}
      />
      {isLoadingUpdateCustomer || isLoadingFetch ? (
        <Spin></Spin>
      ) : (
        <TableWrap
          className="custom-table mt-32"
          data={data?.data.content}
          isLoading={isLoadingFetch}
          page={page}
          size={size}
          total={data?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column title="No." dataIndex="id" render={(_, record, index) => <>{index + 1}</>} />
          <Column
            title="メール"
            dataIndex="emailAddress"
            render={(_, record: any) => {
              return <span className="pointer">{record?.emailAddress}</span>;
            }}
          />
          <Column
            title="メール"
            dataIndex="emailAddress"
            render={(_, record: any) => {
              return <span onClick={() => navigate(helper.showDetail(record.userId))}>{record?.emailAddress}</span>;
            }}
          />
          <Column
            title="電話番号"
            dataIndex="phoneNumber"
            render={(_, record: any) => {
              return <span onClick={() => navigate(helper.showDetail(record.userId))}>{record?.phoneNumber}</span>;
            }}
          />
          <Column title="完了日" render={(_) => <>{_.dob}</>} />
          <Column
            title="アクション"
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center">
                <div
                  onClick={() => handleUpdateCustomer(UpdateCustomerDtoStatusEnum.Cancel, record.userId)}
                  style={{ marginRight: '16px' }}
                >
                  <Button type="text" className="bg-D9D9D9 color-1A1A1A">
                    不合格
                  </Button>
                </div>
                <div onClick={() => handleUpdateCustomer(UpdateCustomerDtoStatusEnum.Accept, record.userId)}>
                  <Button type="text" className="bg-D82C1C color-FFFFFF">
                    合格
                  </Button>
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
export default ListCustomer;
