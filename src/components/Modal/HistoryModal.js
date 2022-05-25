import React, { useState, useEffect } from "react";
import { } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Modal, Button
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Empty from "@/components/Empty";
import axios from "@/utils/axios";

function RedoModal(props) {
  const { onChange = () => { }, onUpdate = () => { }, modalInfo } = props;
  const [list, setList] = useState([]);

  const { isOpen, record } = modalInfo;

  const { id: metaId } = record;

  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      getList();
    } else {
      setList([]);
    }

  }, [isOpen]);

  async function getList() {
    const {
      data,
    } = await axios({
      url: `/fore/metadata/${metaId}/history`,
      method: "GET",
    });
    setList(data);
  }
  //
  function onClose() {
    onChange({ ...modalInfo, isOpen: false, });
  }

  return (
    <Modal show={isOpen} onHide={onClose} scrollable centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('history')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-3">{t('history_des')}</h5>
        <>
          <div className="form-flex">
            <div className="row row-header">
              <div className="col-6">{t('extration_name')}</div>
              <div className="col-6">{t('date')}</div>
            </div>

            {
              list.map(obj => {
                const { extractionName = '', updateTime = '' } = obj;
                return (
                  <div className="row">
                    <div className="col-6">{extractionName}</div>
                    <div className="col-6">{updateTime}</div>
                  </div>
                );
              })
            }
            {list.length <= 0 && <Empty />}
          </div>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RedoModal;
