import React, { useState, useEffect, useRef } from "react";
import {
  Modal, Form, Button, Row, Col
} from "react-bootstrap";
import _ from "lodash";

import { useLocation } from "react-router-dom";
import { ResizableBox } from 'react-resizable';
import { toast } from "react-toastify";
import clsx from 'clsx';
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";
import ValidationPreview from './ValidationPreview';
import ConnectLine from './ConnectLine';

function ValidationModal(props) {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('');
  const [form, setForm] = useState({});
  const [index, setIndex] = useState(0);
  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;
  const { record = {}, isOpen } = modalInfo;
  const { validationList = [] } = record;
  const [metadata, setMetadata] = useState({});
  // const [validationData, setValidationData] = useState({});
  const [locations, setLocations] = useState({});
  const [dpSetting, setDpSetting] = useState({});

  const { data = {}, metaFilename = '', classifierName = '' } = metadata || {};

  const rulesData = getRulesData(form);
  const rules = Object.keys(data).reduce((prev, k) => ({
    ...prev,
    [k]: rulesData.isRequire,
  }), {});

  const { errors, resetErrors, handleChange } = useForm({ form, rules, setForm });

  const panEl = useRef(null);

  const { t } = useTranslation();

  const id = validationList?.[index]?.id;


  useEffect(() => {
    if (isOpen) {
      setIndex(0);
    } else {
      setIndex(-1);
      resetErrors(false);
    }
  }, [isOpen, JSON.stringify(validationList)]);

  useEffect(() => {
    if (id) {
      getMetaData();
    }
  }, [id]);

  useEffect(() => {
    if (classifierName) {
      getclassifierDpSetting();
    }
  }, [classifierName]);

  useEffect(() => {
    if (activeKey) {
      const el = document.querySelector(`#${activeKey}-field`);
      if (el) {
        el.scrollIntoView();
      }
    }
  }, [activeKey]);

  /**
   * [GET] get classifier display setting
   */
  async function getclassifierDpSetting() {
    try {
      const { data } = await axios({
        url: `/fore/classifiers/dpSetting`,
        method: "GET",
        params: {
          classifierName
        }
      });
      const temp = data
        .reduce((p, curr) => ({
          ...p,
          [curr.fieldName]: curr.fieldDpName
        }), {});
      setDpSetting(temp);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [GET] get meta form data and box position
   */
  async function getMetaData() {
    try {
      const { data } = await axios({
        url: `/fore/metadata/${id}`,
        method: "GET"
      });

      setMetadata(data);
      setForm(data.data || {});
      setLocations(data.location);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [POST] submit validation 
   */
  async function onSubmit() {
    try {
      const { data } = await axios({
        url: `/fore/metadata/${id}/validate`,
        method: "PUT",
        data: {
          validateData: form,
          validateLocation: locations
        }
      });
      toast(t('alert_update_success'), {
        type: "success"
      });
    } catch (e) {
      console.log(">>>>>", e);
    }
  }


  /**
   * close validation modal
   */
  function onClose() {
    onUpdate();
    onChange({ ...modalInfo, isOpen: false });
  }

  /**
   * next validation item
   */
  function next() {
    const idx = index === validationList.length - 1 ? -1 : index + 1;
    if (idx >= 0) {
      setIndex(idx);
    } else {
      setIndex(0);
    }
  }

  /**
  * prev validation item
  */
  function prev() {
    const idx = index > 0 ? index - 1 : -1;
    if (idx >= 0) {
      setIndex(idx);
    } else {
      setIndex(validationList.length - 1);
    }
  }


  /**
   * panInstance pan to element
   * @param {*} name element name
   */
  function panToElement(name) {
    const pan = panEl?.current?.pan;
    if (pan) {
      pan.zoomToElement(document.querySelector(`#${name}-box`));
    }
  }


  //  validation data form row
  const rows = Object.keys(form).filter(k => dpSetting?.[k]);

  return (
    <Modal
      autoFocus={false}
      enforceFocus={false}
      show={modalInfo.isOpen}
      onHide={onClose}
      scrollable
      centered
      size="full"
    >
      <Modal.Header closeButton>
        <div className="spacer spacer-full" justify="center">
          <Button
            variant="icon white"
            onClick={prev}
          >
            <i className="fas fa-chevron-left" />
          </Button>
          <p>
            {metaFilename} ({index + 1} / {validationList.length})
          </p>
          <Button
            variant="icon white"
            onClick={next}
          >
            <i className="fas fa-chevron-right" />
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="validation-container">
          <ConnectLine
            nodeA={document.querySelector(`#${activeKey}-field`)}
            nodeB={document.querySelector(`#${activeKey}-box`)}
          />
          <ResizableBox
            className="validation-menu"
            width={600}
            axis="x">
            <div className="form-flex form-flex-dark">
              <Row className="row-header">
                <Col sm="3">{t('field')}</Col>
                <Col sm="9">{t('value')}</Col>
              </Row>
              {
                rows.map((key) => (
                  <Row
                    id={`${key}-field`}
                    className={clsx({ active: activeKey === key })}
                    onMouseOver={() => setActiveKey(key)}
                    onMouseLeave={() => setActiveKey('')}
                    onClick={() => panToElement(key)}
                  >
                    <Col sm="3">{dpSetting?.[key] || key}</Col>
                    <Col
                      sm="8"
                      className={key}

                    >
                      <FormItem error={errors?.[key]} hideError>
                        <Form.Control
                          hideError
                          size="sm"
                          value={form?.[key]}
                          onChange={e => handleChange(key, e.target.value)}
                        />
                      </FormItem>
                    </Col>
                    {/* <Col sm="1">
                      <Button variant="icon white">
                        <i className="fas fa-arrow-circle-right" />
                      </Button>
                    </Col> */}
                  </Row>
                ))
              }
            </div>
            <div className="validation-menu-bottom">
              <Button
                variant="outline-primary"
                className="btn-full"
                onClick={onSubmit}
              >
                {t('comfirm')}
              </Button>
            </div>
          </ResizableBox>
          {isOpen && (
            <ValidationPreview
              ref={panEl}
              index={index}
              setActiveKey={setActiveKey}
              activeKey={activeKey}
              form={form}
              onChange={handleChange}
              locations={locations}
              id={id}
              dpSetting={dpSetting}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ValidationModal;
