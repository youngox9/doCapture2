import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ResizableBox } from 'react-resizable';
import { setSidebarWidth } from '@/reducers/global';
import clsx from 'clsx';

const SidebarBox = (props) => {
  const [isResize, setIsResize] = useState(false)
  const sidebarWidth = useSelector(state => state?.global?.sidebarWidth || 0);

  const dispatch = useDispatch();

  function onResize(event, { element, size, handle }) {
    dispatch(setSidebarWidth(size.width));
  }

  return (
    <ResizableBox
      className={clsx('sider', { 'is-resize': isResize }, props.className)}
      width={sidebarWidth}
      // height={null}
      axis="x"
      onResize={onResize}
      onResizeStart={() => setIsResize(true)}
      onResizeStop={() => setIsResize(false)}
    >
      {props.children}
    </ResizableBox>
  );
};

export default SidebarBox;
