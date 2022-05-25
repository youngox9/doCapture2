import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Modal, Button } from "react-bootstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from "react-i18next";
import { setComfirm } from "@/reducers/global";

function ComfirmModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const comfirmModal = useSelector(state => state?.global?.comfirmModal || {});

  const {
    isOpen, title = "", des = "", type = "success", callback, showClose = true, showComfirm = true
  } = comfirmModal;

  function onClose() {
    dispatch(setComfirm({ ...comfirmModal, isOpen: false }));
  }
  return (
    <SweetAlert
      btnSize="xs"
      closeOnClickOutside
      showCancel={false}
      showConfirm={false}
      show={isOpen}
      // success
      {...{ [type]: true }}
      title={title}
      onConfirm={() => {
        // callback();
        // onClose();
      }}
      onCancel={onClose}
    >
      {des}
      <div className="spacer mt-3" justify="center">
        {showComfirm
          && (
            <Button
              variant="primary"
              onClick={() => {
                callback();
                onClose();
              }}
            >
              {t('comfirm')}
            </Button>
          )}
        {showClose
          && (
            <Button variant="outline-dark" onClick={onClose}>
              {t('close')}
            </Button>
          )}
      </div>
    </SweetAlert>

  );
}

export default ComfirmModal;
