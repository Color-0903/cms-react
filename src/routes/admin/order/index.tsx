import { EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Card, Popover, Select, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../../apis';
import { UpdateOrderDto, UpdateOrderDtoStatusEnum } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import { FORMAT_DATE } from '../../../constants/common';
import { orderStatus } from '../../../constants/constant';
import { QUERY_LIST_ORDER } from '../../../util/contanst';
import { helper } from '../../../util/helper';
import { ActionUser } from '../../../constants/enum';

const OrderList = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<
    | {
        id?: String;
        lastStatus?: UpdateOrderDtoStatusEnum;
        newStatus?: UpdateOrderDtoStatusEnum;
        name?: string;
        isShow?: boolean;
      }
    | undefined
  >(undefined);
  const [status, setStatus] = useState<UpdateOrderDtoStatusEnum | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_ORDER, { page, size, fullTextSearch }],
    queryFn: () => orderApi.orderControllerGetAll(page, size, undefined, fullTextSearch),
    enabled: true,
    staleTime: 1000,
  });

  const { mutate: Update, isLoading: isUpdate } = useMutation(
    (dto: { id: string; dto: UpdateOrderDto }) => orderApi.orderControllerUpdate(dto.id as string, dto.dto),
    {
      onSuccess: (data: any) => {
        helper.showSuccessMessage(ActionUser.EDIT, intl);
        queryClient.invalidateQueries([QUERY_LIST_ORDER]);
      },
      onError: (error: any) => {
        helper.showErroMessage(error?.response?.data, intl);
      },
    }
  );

  const handleConfirm = () => {
    if (!!isShowModal?.lastStatus) {
      Update({
        id: isShowModal?.id as string,
        dto: {
          status: isShowModal?.newStatus,
        },
      });
      console.log({
        id: isShowModal?.id as string,
        dto: {
          status: isShowModal?.newStatus,
        },
      });
      setIsShowModal(undefined);
    }
  };

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
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'order.title' })}</div>
          {/* <CustomButton icon={<PlusOutlined />} onClick={() => navigate(ADMIN_ROUTE_PATH.CREATE_PRODUCT)}>
                        {intl.formatMessage({ id: 'common.create' })}
                    </CustomButton> */}
        </div>
        <CustomInput
          placeholder={intl.formatMessage({ id: 'common.search' })}
          prefix={<IconSVG type="search" />}
          className="w-44 mt-32"
          onChange={(e) => debouncedUpdateInputValue(e?.target?.value?.trim())}
          allowClear
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
              id: 'table.index',
            })}
            render={(_, record, index) => <>{helper.renderIndex(page, index + 1)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'order.name',
            })}
            dataIndex="name"
            render={(_, record: any, index) => {
              return (
                <div className="d-flex align-items-center gap-2">
                  <Avatar
                    shape="square"
                    src={!!record?.assets ? helper.getSourceFile(record?.assets) : '/assets/images/default-order.jpg'}
                  />
                  <span className="text-one-line" style={{ maxWidth: '120px' }}>
                    {_}
                  </span>
                </div>
              );
            }}
          />
          <Column
            title={intl.formatMessage({ id: 'order.product' })}
            render={(_, record: any, index) => {
              const contents = record?.order_detail?.map((item: any) => (
                <div className="color-8B8B8B font-weight-400 font-base font-size-12">
                  {item?.size} x {item?.color} x {item?.quantity} ({helper.showVnd(item?.quantity)})
                </div>
              ));
              return (
                <Popover placement="topLeft" title={intl.formatMessage({ id: 'order.product' })} content={contents}>
                  <Button className="d-flex align-items-center">
                    <EyeOutlined className="font-size-18" />
                  </Button>
                </Popover>
              );
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'order.created',
            })}
            dataIndex="createdOnDate"
            render={(_, record, index) => <>{moment(_).format(FORMAT_DATE)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'order.status',
            })}
            dataIndex="status"
            render={(_: UpdateOrderDtoStatusEnum, record: any, index) => {
              setStatus(_);
              const options = Object.keys(orderStatus).map((item: any) => {
                return {
                  value: item,
                  label: intl.formatMessage({ id: `order.${item}` }),
                  disabled: orderStatus[`${_}`].includes(item),
                };
              });
              return (
                <Select
                  value={status}
                  onSelect={(e) => {
                    if (e != status) setIsShowModal({ lastStatus: _, newStatus: e, isShow: true, id: record.id });
                  }}
                  style={{ width: 130 }}
                  options={options}
                />
              );
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'order.total',
            })}
            dataIndex="total"
            render={(_, record, index) => <>{helper.showVnd(_)}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'table.action',
            })}
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div onClick={() => navigate(helper.showDetail(record.id))} className="pointer">
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
        visible={!!isShowModal?.isShow}
        onSubmit={handleConfirm}
        onClose={() => {
          setStatus(isShowModal?.lastStatus);
          setIsShowModal(undefined);
        }}
      />
    </Spin>
  );
};

export default OrderList;
