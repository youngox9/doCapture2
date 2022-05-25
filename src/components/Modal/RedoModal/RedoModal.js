import React, { useState, useEffect, useContext } from "react";
import { } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Modal, Button, Row, Col, Form, ListGroup, Accordion
} from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "@/utils/axios";
import { useTranslation } from "react-i18next";

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, (...rest) => { });

  return (
    <Button variant="icon white" className="chevron" onClick={decoratedOnClick}>
      <FontAwesomeIcon icon={["fa", "chevron-right"]} />
      {children}
    </Button>
  );
}

function RedoModal(props) {
  const { t } = useTranslation();
  const { id: workspaceId } = useParams();
  const { onChange = () => { }, onUpdate = () => { }, modalInfo } = props;
  const [step, setStep] = useState(0);
  const [extractionName, setExtractionName] = useState('');
  const [list, setList] = useState([]);

  const { isOpen, record: { metaIds = [] } } = modalInfo;

  useEffect(() => {
    if (isOpen) {
      getList();
    } else {
      setExtractionName('');
    }
    return () => { };
  }, [isOpen]);

  async function getList() {
    const {
      data,
    } = await axios({
      url: `/fore/classifiers/redo`,
      method: "GET",
      params: {
        // condition: 'redo',
        workspaceId
      }
    });
    setList(data);
  }

  async function onRedo() {
    const {
      data,
    } = await axios({
      url: `/fore/metadata/redo`,
      method: "PUT",
      data: {
        metaIds,
        extraction: extractionName,
      }
    });
    onClose();
    onUpdate();
  }

  //
  function onClose() {
    onChange({ ...modalInfo, isOpen: false, });
  }

  return (
    <Modal show={isOpen} onHide={onClose} scrollable centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {t('redo_title')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <div className="spacer mb-2" justify="space-between">
            <h5 className="text-center">{t('redo_des')}</h5>
          </div>
          <div className="upload-container">
            <Accordion>
              {
                list.map((obj, index) => {
                  const { classifierDpName, classifierName, extractions = [] } = obj;
                  const classifierActive = !!extractions.find(o => o.extractionName === extractionName);
                  return (
                    <>
                      <ListGroup className="mb-3">
                        <ListGroup.Item variant="dark" action onClick={() => setExtractionName(extractions?.[0]?.extractionName)}>
                          <Form.Check
                            type="checkbox"
                            id={classifierName}
                            name={classifierName}
                            label={classifierDpName}
                            checked={classifierActive}

                          />
                          <CustomToggle eventKey={index} />
                        </ListGroup.Item>
                        <Accordion.Collapse eventKey={index} >
                          <ListGroup variant="flush">
                            {
                              extractions.map((o) => {
                                const { extractionDpName, extractionName: extName } = o;

                                const isActive = extractionName === extName;
                                return (
                                  <>
                                    <ListGroup.Item action onClick={() => setExtractionName(extName)} >
                                      <Form.Check
                                        type="checkbox"
                                        id={extName}
                                        name="test"
                                        label={extractionDpName}
                                        checked={isActive}

                                      />
                                    </ListGroup.Item>
                                  </>
                                );
                              })
                            }
                          </ListGroup>
                        </Accordion.Collapse>
                      </ListGroup>

                    </>
                  );
                })
              }
            </Accordion>
          </div>
        </>
      </Modal.Body>
      <Modal.Footer>
        {extractionName && (
          <Button variant="primary" onClick={onRedo}>
            {t('comfirm')}
          </Button>
        )}
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RedoModal;
