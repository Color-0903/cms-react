import { DndContext, DragOverlay, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { Checkbox, Row } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lesson } from '../../../apis/client-axios';
import CustomButton from '../../../components/buttons/CustomButton';
import Item from './components/Item';
import SortableItem from './components/SortableItem';
import { useMutation } from '@tanstack/react-query';
import { lessonApi } from '../../../apis';
import { helper } from '../../../util/common';
import { ActionUser } from '../../../constants/enum';
import { useIntl } from 'react-intl';
export interface listItemprops {
  items: Lesson[];
  setItems: (value: any) => void;
  isShowCreate?: boolean;
  setIsShowCreate?: (value: boolean) => void;
  col?: number;
}

const ListItem = (props: listItemprops) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { items, setItems, isShowCreate, setIsShowCreate, col } = props;
  const [active, setActive] = useState<Lesson | null>(null);
  const [sort, setSort] = useState<boolean>(false);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: any) => {
    const itemActive = items.find((item) => item?.id === event?.active?.id);
    setActive(itemActive as Lesson);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setItems((items: any) => {
        const oldIndex = items.findIndex((item: any) => item?.id === active?.id);
        const newIndex = items.findIndex((item: any) => item?.id === over!.id);
        return arrayMove(items, oldIndex, newIndex).map((item: any, index) => {
          return {
            ...item,
            index: index + 1,
          };
        });
      });
    }
    setActive(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <div className="">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <span className="color-000000 font-weight-500 font-base font-size-16">ビデオ</span>
        <div className="">
          <Checkbox onChange={() => setSort(!sort)}>Allow sort</Checkbox>
          <CustomButton
            onClick={() => !!setIsShowCreate && setIsShowCreate(!isShowCreate)}
            className="bg-D82C1C color-FFFFFF width-126 height-47"
          >
            アップロード
          </CustomButton>
        </div>
      </div>
      <Row gutter={16}>
        {sort ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((item, index) => (
                <SortableItem key={item.id} id={item.id} item={item} index={index} col={col} />
              ))}
            </SortableContext>
            <DragOverlay adjustScale style={{ transformOrigin: '0 0' }}>
              {' '}
            </DragOverlay>
          </DndContext>
        ) : (
          <>
            {items.map((item, index) => {
              return <Item id={item.id} item={item} index={index} controls={false} isShowClose={true} col={col} />;
            })}
          </>
        )}
      </Row>
    </div>
  );
};

export default ListItem;
