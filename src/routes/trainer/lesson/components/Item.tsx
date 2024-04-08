import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Col } from 'antd';
import { HTMLAttributes, forwardRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { lessonApi } from '../../../../apis';
import { Lesson } from '../../../../apis/client-axios';
import IconSVG from '../../../../components/icons/icons';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import CustomeVideo from '../../../../components/video/CustomVideo';
import { ActionUser } from '../../../../constants/enum';
import { helper } from '../../../../util/common';
import { useNavigate } from 'react-router-dom';
import { TRAINER_ROUTE_PATH } from '../../../../constants/route';

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  item?: Lesson;
  showClose?: boolean;
  withOpacity?: boolean;
  isDragging?: boolean;
  index?: number;
  controls?: boolean;
  isShowClose?: boolean;
  col?: number;
};

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ item, showClose, withOpacity, isDragging, style, index, controls, isShowClose, col, ...props }, ref) => {
    const intl = useIntl();
    const [lessonDelete, setLessonDelete] = useState<{ id: string } | null>(null);
    const navigate = useNavigate();

    const deleteLesson = useMutation((id: string) => lessonApi.lessonControllerDelete(id), {
      onSuccess: ({ data }) => {
        helper.showSuccessMessage(ActionUser.DELETE, intl);
        navigate(TRAINER_ROUTE_PATH.COURSE_MANAGEMENT);
      },
      onError: (error: any) => {
        helper.showErroMessage(error.response.data, intl);
      },
    });

    const handleDeleteLesson = () => {
      if (lessonDelete?.id) {
        deleteLesson.mutate(lessonDelete?.id as string);
        setLessonDelete(null);
      }
    };

    return (
      <Col ref={ref} span={col ?? 6} className={`gutter-row mt-16`} style={style} {...props}>
        <div className="position-relative rounded">
          {
            <CustomeVideo
              controls={controls ?? false}
              src={helper.getSourceFile(item?.video?.source)}
              className="z-1"
            ></CustomeVideo>
          }
          <div className="w-100 d-flex justify-content-between align-items-end position-absolute bottom-6 px-3">
            <div className="d-flex flex-column">
              <span className="color-FFFFFF">{item?.title}</span>
              <span className="color-FFFFFF">{item?.introduce}</span>
            </div>
            <span className="px-2 rounded-circle bg-white ">{Number(index) + 1}</span>
          </div>
          {!!isShowClose && (
            <span
              className="position-absolute translate-middle rounded-circle p-1 pointer z-999 bg-FFFFFF top-0"
              style={{ left: '96%' }}
              onClick={() => setLessonDelete({ id: item?.id as string })}
            >
              <IconSVG type="lesson-close"></IconSVG>
            </span>
          )}
        </div>

        <ConfirmDeleteModal
          visible={!!lessonDelete}
          name="レッスンの削除"
          confirmBtnText="確認する"
          content="レッスンを削除してもよろしいですか?"
          onSubmit={handleDeleteLesson}
          onClose={() => setLessonDelete(null)}
        />
      </Col>
    );
  }
);

export default Item;
