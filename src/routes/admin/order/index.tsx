import { ArrowRightOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Card, Popover, Select, SelectProps, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import moment from 'moment';
import { ReactNode, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../../apis';
import { UpdateOrderDto, UpdateOrderDtoStatusEnum } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import CustomSelect from '../../../components/select/CustomSelect';
import { FORMAT_DATE } from '../../../constants/common';
import { orderStatus } from '../../../constants/constant';
import { ActionUser } from '../../../constants/enum';
import { QUERY_LIST_ORDER } from '../../../util/contanst';
import { helper } from '../../../util/helper';

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
        type: 'update' | 'delete';
        lastStatus?: UpdateOrderDtoStatusEnum;
        newStatus?: UpdateOrderDtoStatusEnum;
        name?: string;
        isShow?: boolean;
        subContent?: ReactNode;
      }
    | undefined
  >(undefined);
  const [status, setStatus] = useState<UpdateOrderDtoStatusEnum | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<UpdateOrderDtoStatusEnum[] | []>([UpdateOrderDtoStatusEnum.Pending]);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_ORDER, { page, size, fullTextSearch, filterStatus }],
    queryFn: () => orderApi.orderControllerGetAll(page, size, undefined, fullTextSearch, filterStatus),
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

  const { mutate: Delete, isLoading: isDelete } = useMutation((id: string) => orderApi.orderControllerDelete(id), {
    onSuccess: (data: any) => {
      helper.showSuccessMessage(ActionUser.DELETE, intl);
      queryClient.invalidateQueries([QUERY_LIST_ORDER]);
    },
    onError: (error: any) => {
      helper.showErroMessage(error?.response?.data, intl);
    },
  });

  const handleConfirm = () => {
    if (!isShowModal?.id) return;
    if (isShowModal?.type === 'update') {
      Update({
        id: isShowModal?.id as string,
        dto: {
          status: isShowModal?.newStatus,
        },
      });
    } else {
      Delete(isShowModal?.id as string);
    }
    setIsShowModal(undefined);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const selectOption = Object.keys(orderStatus).map((item: any) => {
    return {
      value: item,
      label: intl.formatMessage({ id: `order.${item}` }),
    };
  }) as SelectProps['options'];

  return (
    <Spin spinning={isLoading}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'order.title' })}</div>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-32">
          <CustomInput
            placeholder={intl.formatMessage({ id: 'common.search' })}
            prefix={<IconSVG type="search" />}
            className="w-44"
            onChange={(e) => debouncedUpdateInputValue(e?.target?.value?.trim())}
            allowClear
          />
          <CustomSelect
            mode="multiple"
            placeholder={intl.formatMessage({ id: 'order.status' })}
            defaultValue={[UpdateOrderDtoStatusEnum.Pending]}
            allowClear
            maxTagCount={2}
            onChange={(e) => setFilterStatus(e)}
            options={selectOption}
            style={{ minWidth: '312px' }}
          />
        </div>

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
                    src={!!record?.asset ? helper.getSourceFile(record?.asset) : '/assets/images/default-product.jpg'}
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
                <Popover placement="topLeft" title={record?.user?.identifier} content={contents}>
                  <Button className="d-flex align-items-center">
                    <EyeInvisibleOutlined className="font-size-18" />
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
                    if (e != status)
                      setIsShowModal({
                        type: 'update',
                        lastStatus: _,
                        newStatus: e,
                        isShow: true,
                        id: record.id,
                        subContent: (
                          <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
                            <span className="color-ff1919 font-weight-400 font-base font-size-13">
                              {intl.formatMessage({ id: `order.${_}` })}
                            </span>
                            <ArrowRightOutlined />
                            <span className="color-0d6efd font-weight-400 font-base font-size-13">
                              {intl.formatMessage({ id: `order.${e}` })}
                            </span>
                          </div>
                        ),
                      });
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
                <div
                  onClick={() => setIsShowModal({ id: record.id, type: 'delete', isShow: true })}
                  className="pointer"
                >
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
        subContent={isShowModal?.subContent}
      />
    </Spin>
  );
};

export default OrderList;
