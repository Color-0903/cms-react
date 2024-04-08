import { useQuery } from '@tanstack/react-query';
import type { CalendarProps } from 'antd';
import { Button, Calendar, Col, Row, Select, Spin, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { workoutScheduleApi } from '../../../apis';
import IconSVG from '../../../components/icons/icons';
import { RootState } from '../../../store';
import Popupchedule from './popup/schedule';

const Lessonchedule = () => {
  const [showPopupShedule, setShowPopupSchedule] = useState(false);
  const [loading, setLoading] = useState(true);
  const authUser = useSelector((state: RootState) => state.auth)?.authUser;

  const { data: dataWorkoutSchedule } = useQuery({
    queryKey: ['dataWorkoutSchedule', authUser],
    queryFn: () => workoutScheduleApi.workoutScheduleControllerGetByTrainerId(authUser?.id as string),
    enabled: !!authUser?.id,
    onSuccess(data) {
      setLoading(false);
    },
  });

  const getListData = (value: Dayjs) => {
    const timeFormat = moment(value.toDate()).format('YYYY-MM-DD');
    const findIndex = dataWorkoutSchedule?.data.findIndex((item) => item?.day === timeFormat);
    let listData;
    if (findIndex !== -1) {
      listData = [
        {
          type: 'success',
          content: (
            <div className="w-100">
              <span className="px-1 rounded bg-FCEEED color-000000 font-weight-400 font-size-10">
                {dataWorkoutSchedule?.data[0]?.amFrom} - {dataWorkoutSchedule?.data[0]?.amTo}
              </span>
            </div>
          ),
        },
      ];
    }
    return listData || [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <>
        {listData.map((item, index) => (
          <> {item.content} </>
        ))}
      </>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <>
      {!!loading ? (
        <Spin></Spin>
      ) : (
        <>
          <Calendar
            className="calendar-ant-custom-1 mt-48"
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const start = 0;
              const end = 12;
              const monthOptions = [];

              let current = value.clone();
              const localeData = value.localeData();
              const months = [];
              for (let i = 0; i < 12; i++) {
                current = current.month(i);
                months.push(localeData.monthsShort(current));
              }

              for (let i = start; i < end; i++) {
                monthOptions.push(
                  <Select.Option key={i} value={i} className="month-item">
                    Tháng: {i + 1}
                  </Select.Option>
                );
              }
              const month = value.month();
              return (
                <div>
                  <div className="d-flex justify-content-between">
                    <Typography.Title level={4}>カレンダー</Typography.Title>
                    <Button
                      onClick={() => setShowPopupSchedule(!showPopupShedule)}
                      className="width-70 height-47 bg-D82C1C color-FFFFFF"
                    >
                      作成
                    </Button>
                  </div>
                  <Row gutter={8}>
                    <Col>
                      <div className="d-flex align-items-center mt-28">
                        <Button
                          className="height-49"
                          onClick={() => {
                            let prev = value.month() - 1;
                            const now = value.clone().month(prev);
                            onChange(now);
                          }}
                        >
                          <IconSVG type="left-arrow" />
                        </Button>

                        <Button type="text" className="border mx-1  width-96 height-49" disabled>
                          {month}月
                        </Button>
                        <Button
                          className="height-49"
                          onClick={() => {
                            let next = value.month() + 1;
                            const now = value.clone().month(next);
                            onChange(now);
                          }}
                        >
                          <IconSVG type="right-arrow" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            }}
            cellRender={cellRender}
          />
          <Popupchedule
            showPopupShedule={showPopupShedule}
            setShowPopupSchedule={setShowPopupSchedule}
            dataWorkoutSchedule={dataWorkoutSchedule?.data || []}
          ></Popupchedule>
        </>
      )}
    </>
  );
};

export default Lessonchedule;
