import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";

/**
 * loading 遮罩
 * @param {} props
 * @returns 
 */
function LoadingMask(props) {
  // const isLoading = useSelector(state => state?.global?.isLoading || false);

  const loadingQueue = useSelector(state => state?.global?.loadingQueue || []);

  return ReactDOM.createPortal(
    <div className={clsx("loading", { active: loadingQueue.length })} />,
    document.body
  );
}

export default LoadingMask;
