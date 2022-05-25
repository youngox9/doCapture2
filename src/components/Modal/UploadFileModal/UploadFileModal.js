import React, { useState, useEffect } from "react";
import { } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import Step2 from "./Step2";


function UploadFileModal(props) {
  const { id: workspaceId } = useParams();
  const { isOpen, onClose = () => { } } = props;
  const [list, setList] = useState([]);
  const [step, setStep] = useState(0);
  const [extractionName, setExtractionName] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      getList();
    } else {
      setStep(0);
      setExtractionName('');
    }
    return () => { };
  }, [isOpen]);


  async function getList() {
    const {
      data,
    } = await axios({
      url: `/fore/classifiers/upload`,
      method: "GET",
      params: {
        // condition: 'upload',
        workspaceId
      }
    });
    setList(data);
  }

  function onSelectExtraction(val) {
    setExtractionName(val);
    setStep(1);
  }
  return (
    <Modal show={isOpen} onHide={onClose} scrollable centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('upload_title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          step === 0
          && (
            <>
              <div className="spacer mb-3" justify="space-between">
                <h5 className="text-center">{t('upload_des')}</h5>
              </div>
              <div className="upload-container">
                <Row className="row justify-content-center" justify-content="center">
                  {
                    list.map((obj) => {
                      const { auto, classifierDpName, extractions = [], } = obj;
                      const extName = extractions?.[0]?.extractionName || '';
                      const val = auto ? 'auto' : extName;
                      return (
                        <Col xs="6" md={3} className="mb-3">
                          <Button variant="outline-dark" className="btn-upload" onClick={() => onSelectExtraction(val)}>
                            <div className="inner">
                              <div className="text">
                                <i className="fas fa-file-alt" />
                                <p>{classifierDpName}{auto && <><br /><span>{t('auto_classify')}</span></>}</p>
                              </div>
                            </div>
                          </Button>
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            </>
          )
        }
        {
          step === 1 &&
          <Step2 setStep={setStep} extractionName={extractionName} />
        }
      </Modal.Body>
      <Modal.Footer>
        {step === 1 && (
          <Button variant="primary" onClick={() => { setStep(0); setExtractionName('') }}>
            <i className="fas fa-angle-left" />
            {t('back')}
          </Button>
        )}
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal >
  );
}

export default UploadFileModal;
