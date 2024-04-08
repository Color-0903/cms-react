import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CalendarProps } from 'antd';
import { Badge, Button, Calendar, Divider, Form, Modal, Select, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import dayLocaleData from 'dayjs/plugin/localeData';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { trainerApi } from '../../../../apis';
import { UpdateTrainerDto, WorkoutSchedule } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import IconSVG from '../../../../components/icons/icons';
import { ActionUser } from '../../../../constants/enum';
import { helper } from '../../../../util/helper';
import CustomDateTimePicker from '../../../../components/dateTime/CustomDateTimePicker';
import CustomButton from '../../../../components/buttons/CustomButton';

dayjs.extend(dayLocaleData);

interface PopupcheduleInterface {
  showPopupShedule: boolean;
  setShowPopupSchedule: (value: boolean) => void;
  dataWorkoutSchedule: WorkoutSchedule[];
}

const Popupchedule = (props: PopupcheduleInterface) => {
  const intl = useIntl();
  const { showPopupShedule, setShowPopupSchedule, dataWorkoutSchedule } = props;
  const queryClient = useQueryClient();
  const [form] = Form.useForm<any>();
  const day = Form.useWatch('day', form);
  const [listDaySelect, setListDaySelect] = useState<any[]>([]);
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const { mutate: UpdateWorkoutSchedule, status: statusUpdateWorkoutSchedule } = useMutation(
    (dto: UpdateTrainerDto) => trainerApi.trainerControllerUpdateMe(dto),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['dataWorkoutSchedule']);
        setShowPopupSchedule(!showPopupShedule);
        helper.showSuccessMessage(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    }
  );

  useEffect(() => {
    if (!!dataWorkoutSchedule) {
      setListDaySelect(
        dataWorkoutSchedule.map((item) => {
          return item?.day;
        })
      );
    }
  }, [dataWorkoutSchedule]);

  useEffect(() => {
    if (!!day) {
      const timeFormat = moment(day.toDate()).format('YYYY-MM-DD');
      const find = listDaySelect.find((day) => day === timeFormat);
      if (!!find) {
        setListDaySelect(listDaySelect.filter((day) => day !== find));
      } else {
        setListDaySelect([...listDaySelect, timeFormat]);
      }
    }
  }, [day]);

  const handleOnFinish = (value: any) => {
    const params = listDaySelect.map((day) => {
      return {
        amFrom: moment(value?.from?.toDate()).format('hh:mm') || undefined,
        amTo: moment(value?.to?.toDate()).format('hh:mm') || undefined,
        day: day,
      };
    });
    UpdateWorkoutSchedule({ workoutSchedule: params });
  };

  const getListData = (value: Dayjs) => {
    const timeFormat = moment(value.toDate()).format('YYYY-MM-DD');
    const findIndex = listDaySelect.findIndex((item) => item === timeFormat);
    let listData;
    if (findIndex !== -1) {
      listData = [{ type: '', content: '' }];
    }
    return listData || [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <>
        {listData.map((item) => {
          return <Badge dot={true} size="default" className="position-absolute top-0 start-100" color="blue"></Badge>;
        })}
      </>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <Modal
      className="ant-modal-custom height-564 width-468"
      title={<span className="color-000000 font-weight-700 font-base font-size-16">実習時間</span>}
      centered
      open={!!showPopupShedule}
      onCancel={() => setShowPopupSchedule(!showPopupShedule)}
      footer={[
        <CustomButton key="1" onClick={form.submit} className="bg-D82C1C color-FFFFFF mt-36">
          保存
        </CustomButton>,
        <CustomButton
          type="text"
          key="2"
          onClick={() => setShowPopupSchedule(!showPopupShedule)}
          className="color-1A1A1A mt-36"
        >
          キャンセル
        </CustomButton>,
      ]}
    >
      <FormWrap form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item name="day" rules={[{ required: !(listDaySelect.length > 0) }]}>
          <Calendar
            className="border overflow-hidden"
            cellRender={cellRender}
            fullscreen={false}
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
              return (
                <div className="height-50 d-flex align-items-center justify-content-between bg-F4F8FB">
                  <Button
                    type="text"
                    onClick={() => {
                      let prev = value.month() - 1;
                      const now = value.clone().month(prev);
                      onChange(now);
                    }}
                  >
                    <IconSVG type="left-arrow" />
                  </Button>
                  <div>{moment(value.toDate()).format('MM/YYYY')}</div>
                  <Button
                    type="text"
                    onClick={() => {
                      let next = value.month() + 1;
                      const now = value.clone().month(next);
                      onChange(now);
                    }}
                  >
                    <IconSVG type="right-arrow" />
                  </Button>
                </div>
              );
            }}
            onPanelChange={onPanelChange}
          />
        </Form.Item>
        <div>
          <span className="color-1A1A1A font-weight-400 font-base font-size-12">予想時間</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-8">
          <Form.Item name="from" className="mb-0">
            <CustomDateTimePicker
              dateFormat={'hh:mm'}
              className="width-190 height-48"
              placeHolder="00:00"
              suffixIcon={false}
            ></CustomDateTimePicker>
          </Form.Item>
          <span className="height-1 width-8 bg-D9D9D9"></span>
          <Form.Item name="to" className="mb-0">
            <CustomDateTimePicker
              dateFormat={'hh:mm'}
              className="width-190 height-48"
              placeHolder="00:00"
              suffixIcon={false}
            ></CustomDateTimePicker>
          </Form.Item>
        </div>
      </FormWrap>
    </Modal>
  );
};

export default Popupchedule;
