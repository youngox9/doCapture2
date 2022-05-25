import React from "react";
import { Modal, Button } from "react-bootstrap";
import _ from "lodash";
import { useTranslation } from "react-i18next";

function ExtractionsModal(props) {
  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;

  const { record = {}, isOpen } = modalInfo;

  const { extractions = [] } = record;

  const { t } = useTranslation();

  function onClose() {
    onChange({ ...modalInfo, isOpen: false });
    onUpdate();
  }

  return (
    <Modal
      show={modalInfo.isOpen}
      onHide={onClose}
      scrollable
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('extractions')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="form-flex">
          <div className="row row-header">
            <div className="col">{t('name')}</div>
            <div className="col">{t('display_name')}</div>
          </div>
          {extractions.map((field, idx) => {
            const { extractionDpName = "", extractionName = "" } = field;
            return (
              <div className="row">
                <div className="col">{extractionName}</div>
                <div className="col">{extractionDpName}</div>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          onClick={onClose}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExtractionsModal;
