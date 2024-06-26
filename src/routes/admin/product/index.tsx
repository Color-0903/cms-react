import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Card, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../../apis';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmModel } from '../../../components/modals/ConfirmModel';
import CustomSwitch from '../../../components/switch/CustomSwitch';
import { ADMIN_ROUTE_PATH } from '../../../constants/route';
import { QUERY_LIST_PRODUCT } from '../../../util/contanst';
import { helper } from '../../../util/helper';

const ProductList = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<{ id: string; name: string | undefined }>();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_LIST_PRODUCT, { page, size, fullTextSearch }],
    queryFn: () => productApi.productControllerGetAll(page, size, undefined, fullTextSearch),
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
          <div className="font-weight-700 font-size-18 font-base"> {intl.formatMessage({ id: 'product.title' })}</div>
          <CustomButton icon={<PlusOutlined />} onClick={() => navigate(ADMIN_ROUTE_PATH.CREATE_PRODUCT)}>
            {intl.formatMessage({ id: 'common.create' })}
          </CustomButton>
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
              id: 'product.name',
            })}
            dataIndex="name"
            render={(_, record: any, index) => {
              return (
                <div className="d-flex align-items-center gap-2">
                  <Avatar
                    shape="square"
                    src={
                      !!record?.assets?.length
                        ? helper.getSourceFile(record?.assets[0]?.source)
                        : '/assets/images/default-product.jpg'
                    }
                  />
                  <span className="text-one-line" style={{ maxWidth: '120px' }}>
                    {_}
                  </span>
                </div>
              );
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'product.price_view',
            })}
            dataIndex="price_view"
            render={(_, record: any, index) => (
              <>
                {helper.showVnd(+_)}{' '}
                <span className="color-8B8B8B font-weight-400 font-base font-size-12">(-{record?.sale_off}%)</span>{' '}
              </>
            )}
          />
          <Column
            title={intl.formatMessage({
              id: 'product.status',
            })}
            dataIndex="status"
            render={(_, record, index) => <>{intl.formatMessage({ id: `product.status.${_}` })}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'product.sold',
            })}
            dataIndex="sold"
          />
          <Column
            title={intl.formatMessage({
              id: 'product.show',
            })}
            dataIndex="isHidden"
            render={(_, record, index) => <CustomSwitch checked={_} />}
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
        visible={!!isShowModal?.id}
        onSubmit={() => handleDelete}
        onClose={() => {
          setIsShowModal(undefined);
        }}
      />
    </Spin>
  );
};

export default ProductList;
