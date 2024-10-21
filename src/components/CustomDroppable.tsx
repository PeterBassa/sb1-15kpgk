import React from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

const CustomDroppable: React.FC<DroppableProps> = ({ children, ...props }) => {
  return <Droppable {...props}>{children}</Droppable>;
};

export default CustomDroppable;