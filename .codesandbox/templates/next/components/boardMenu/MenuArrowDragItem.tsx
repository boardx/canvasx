import React, { ReactNode } from "react";
import { FC } from "react";
import { useDrag } from "react-dnd";
interface MenuArrowDragItemProps {
  onSelected: Function;
  type: string;
  children: ReactNode;
}

const MenuArrowDragItem: FC<MenuArrowDragItemProps> = ({
  onSelected,
  type,
  children,
}) => {
  const dragOption = {
    type: type,
    item: { type },
    end: () => onSelected(type),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  };

  const [{ isDragging }, drag] = useDrag(dragOption);

  return (
    <div
      style={{
        height: "48px",
        width: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      ref={(instance) => {
        drag(instance);
        // TODO: Add your ref logic here
      }}
    >
      {children}
    </div>
  );
};

export default MenuArrowDragItem;
