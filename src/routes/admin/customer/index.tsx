import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../../apis';
import { UpdateCustomerDtoStatusEnum } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { AccountInterface, ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import CustomSelect from '../../../components/select/CustomSelect';
import { ActionUser } from '../../../constants/enum';
import { helper } from '../../../util/common';
import { UpdateCustomerInterface } from '../../trainer/customer';

const ListUser = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isActive, setIsActive] = useState<number>(1);
  const [accountBlock, setAccoutBlock] = useState<AccountInterface | null>(null);

  const { data, isLoading: isLoadingFetch } = useQuery({
    queryKey: ['getCustomers', { page, size, fullTextSearch, isActive }],
    queryFn: () =>
      customerApi.customerControllerGet(
        page,
        UpdateCustomerDtoStatusEnum.Accept,
        isActive,
        size,
        undefined,
        fullTextSearch
      ),
  });

  const { mutate: updateCustomer, isLoading: isLoadingUpdateCustomer } = useMutation(
    (dto: UpdateCustomerInterface) => customerApi.customerControllerUpdate(dto.userId, dto.dto),
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries(['getCustomers']);
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  const handleBlockUser = (userId: string) => {
    const params = {
      userId: userId,
      dto: {
        isActive: false,
      },
    };
    setAccoutBlock(null);
    updateCustomer(params as UpdateCustomerInterface);
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
        <span className="color-D82C1C font-weight-700 font-size-32 font-base">生徒</span>
      </div>
      <div>
        <CustomInput
          placeholder="検索"
          className="input-search width-420 height-48 mt-32"
          onChange={(e) => debouncedUpdateInputValue(e.target?.value.trim())}
        />
        <CustomSelect
          className="width-160"
          style={{ marginLeft: '12px' }}
          placeholder="状態"
          maxTagCount={1}
          defaultValue={1}
          onChange={(value) => setIsActive(value)}
          options={[
            {
              value: 1,
              label: '活動',
            },
            {
              value: 0,
              label: 'ブロック',
            },
          ]}
        />
      </div>
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
            render={(_, record: any) => {
              const firstName = record?.firstName ?? '';
              const lastName = record?.lastName ?? '';
              return <span className="pointer">{firstName + ' ' + lastName}</span>;
            }}
          />
          <Column
            title="メール"
            dataIndex="emailAddress"
            render={(_, record: any) => {
              return <span className="pointer">{record?.emailAddress}</span>;
            }}
          />
          <Column
            title="電話番号"
            dataIndex="phoneNumber"
            render={(_, record: any) => {
              return <span className="pointer">{record?.phoneNumber}</span>;
            }}
          />
          <Column title="完了日" render={(_) => <>{_.dob}</>} />
          <Column
            title="アクション"
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center">
                <div onClick={() => navigate(helper.showDetail(record?.userId))} style={{ marginRight: '4px' }}>
                  <Button type="text" className="bg-D9D9D9 color-1A1A1A width-32 p-0">
                    <IconSVG type="edit-user" />
                  </Button>
                </div>
                <div
                  onClick={() => {
                    const firstName = record?.firstName ?? '';
                    const lastName = record?.lastName ?? '';
                    return setAccoutBlock({
                      userId: record.userId,
                      src: record?.avatar?.source,
                      name: firstName + ' ' + lastName,
                      email: record?.emailAddress,
                    });
                  }}
                >
                  <Button type="text" className="bg-D9D9D9 color-1A1A1A width-32 p-0" disabled={isActive === 0}>
                    <IconSVG type="block-user" />
                  </Button>
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      )}
      <ConfirmDeleteModal
        visible={!!accountBlock}
        name="アカウントブロック"
        confirmBtnText="ブロック"
        content="ユーザーをブロックしてもよろしいですか?"
        account={accountBlock}
        onSubmit={() => handleBlockUser(accountBlock?.userId as string)}
        onClose={() => setAccoutBlock(null)}
      />
    </Card>
  );
};

export default ListUser;
