import React from "react";
import { useDrag } from "react-dnd";
import { styled } from "@mui/material/styles";

export default (props: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { noteType: "sticknote", type: "widget" },
    end: () => {
      props.onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    //@ts-ignore
    <MenuDragWrap draggable ref={drag} role="widget">
      {props.children}
    </MenuDragWrap>
  );
};

const MenuDragWrap = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;
