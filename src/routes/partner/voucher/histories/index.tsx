import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, DatePicker, Spin } from 'antd';
import Column from 'antd/es/table/Column';
import moment, { Moment } from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { debounce } from 'lodash';
import { voucherApi } from '../../../../apis';
import TableWrap from '../../../../components/TableWrap';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';
import { UseStore } from '../../../../hooks/useStore';
import { RootState } from '../../../../store';
import { QUERY_LIST_VOUCHER_HISTORIES } from '../../../../util/contanst';
import CustomDatePicker from '../../../../components/date/DatePickerCustome';
import CustomRangePicker from '../../../../components/range/CustomRangePicker';
import { FORMAT_DATE, FORMAT_TIME } from '../../../../constants/common';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const ListVoucher = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState<{
    fullTextSearch: string;
    storeId: string | undefined;
    from: string | undefined;
    to: string | undefined;
  }>({
    fullTextSearch: '',
    storeId: undefined,
    from: undefined,
    to: undefined,
  });
  const useStore = UseStore(authUser?.id);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_LIST_VOUCHER_HISTORIES, { page, size, filter }],
    queryFn: () =>
      voucherApi.voucherControllerHistories(
        page,
        size,
        filter?.fullTextSearch,
        filter?.storeId,
        filter?.from,
        filter?.to
      ),
    enabled: !!authUser?.id,
    staleTime: 1000,
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

  const viewDiffTime = (startTime: Moment, endTime: Moment) => {
    const duration = moment.duration(endTime.diff(startTime));

    let result;
    if (duration.asMinutes() < 60) {
      result = `${Math.round(duration.asMinutes())} phút trước`;
    } else if (duration.asHours() < 24) {
      result = `${Math.round(duration.asHours())} giờ trước`;
    } else {
      result = `${Math.round(duration.asDays())} ngày trước`;
    }

    return result;
  };

  return (
    <Spin spinning={isLoading}>
      <Card>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-weight-700 font-size-18 font-base">
            {' '}
            {intl.formatMessage({ id: 'voucher.activated' })}
          </div>
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
            <RangePicker
              className="custom-range-picker"
              format={FORMAT_DATE}
              allowClear
              onChange={(_, date) => {
                console.log('change ', date);
                setFilter({
                  ...filter,
                  from: !!date?.[0]?.length ? date?.[0] : undefined,
                  to: !!date?.[1]?.length ? date?.[1] : undefined,
                });
              }}
            />
          </div>
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
            render={(_, record, index) => <>{(record as any)?.voucher?.code}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.name',
            })}
            render={(_, record) => <>{(record as any)?.voucher?.name}</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.discount',
            })}
            render={(_, record) => <>{(record as any)?.voucher?.discount} %</>}
          />
          <Column
            title={intl.formatMessage({
              id: 'voucher.activateAt',
            })}
            dataIndex="releaseAt"
            render={(_, record) => <>{moment((record as any)?.createdOnDate).format('YYYY-MM-DD HH:mm')}</>}
          />
          <Column
            align="center"
            title={intl.formatMessage({
              id: 'table.time',
            })}
            render={(_, record) => <>{viewDiffTime(moment((record as any)?.createdOnDate), moment())}</>}
          />
        </TableWrap>
      </Card>
    </Spin>
  );
};

export default ListVoucher;
