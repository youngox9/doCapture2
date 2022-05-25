import React, { useState, useEffect } from "react";

import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Select from "@/components/Select";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";

function RoleEditModal(props) {
  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;
  const { isOpen = false, mode = "create", record = {} } = modalInfo;
  const [form, setForm] = useState({});
  const [typeOptions, setTypeOptions] = useState([]);
  const [methodOptions, setMethodOptions] = useState([]);

  const { t } = useTranslation();

  const rulesData = getRulesData(form);
  const rules = {
    type: rulesData.isRequire,
    name: rulesData.isRequire,
    path: rulesData.isRequire,
    method: rulesData.isRequire
  };

  const { touchedErrors, errors, isTouched, resetErrors, validation, handleChange } = useForm({ form, rules, setForm });


  const { type = '', name = '', path = '', method = '', remark = '' } = form;

  useEffect(() => {

  }, []);

  useEffect(() => {
    getMethodList();
    getTypeList();
    if (isOpen) {
      setForm({ ...record });
    } else {
      setForm({});
      resetErrors();
    }
  }, [isOpen, JSON.stringify(record)]);


  /**
   * 取得role type 下拉選單
   */
  async function getTypeList() {
    try {
      const { data } = await axios({
        url: `/dictionaries/featureType/values`,
        method: "GET"
      });
      const opts = [
        ...data.map(obj => ({ label: obj, value: obj }))
      ];
      setTypeOptions(opts);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
 * method list 下拉選單
 */
  async function getMethodList() {
    try {
      const { data } = await axios({
        url: `/dictionaries/featureMethod/values`,
        method: "GET"
      });
      const opts = [
        { label: '*', value: '*' },
        ...data.map(obj => ({ label: obj, value: obj }))
      ];
      setMethodOptions(opts);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }


  /**
   * create features
   */
  async function onCreate() {
    const isValid = await validation();
    if (isValid) {
      try {
        const res = await axios({
          url: `/back/features`,
          method: "POST",
          data: {
            type,
            name,
            path,
            method,
            remark
          }
        });
        toast(t('alert_create_success'), {
          type: "success"
        });
        onClose();
        onUpdate();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
  * update features
  */
  async function onEdit() {
    const isValid = await validation();
    const { id } = record;
    if (isValid) {
      try {
        const res = await axios({
          url: `/back/features/${id}`,
          method: "PUT",
          data: {
            type,
            name,
            path,
            method,
            remark
          }
        });
        toast(t('alert_update_success'), {
          type: "success"
        });
        onClose();
        onUpdate();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
  * close modal
  */

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
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t(mode)} {t('features')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <Form className="form">
            <FormItem label="Type" error={touchedErrors.type} isRequire>
              <Select
                options={typeOptions}
                value={typeOptions.find(o => o.value === form?.type)}
                onChange={opt => handleChange("type", opt.value)}
              />
            </FormItem>
            <FormItem label={t('features')} error={touchedErrors.name} isRequire>
              <Form.Control
                size="sm"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            </FormItem>
            <FormItem label="Path" error={touchedErrors.path} isRequire>
              <Form.Control
                size="sm"
                value={form.path}
                onChange={e => handleChange("path", e.target.value)}
              />
            </FormItem>
            <FormItem label="Method" error={touchedErrors.method} isRequire>
              <Select
                options={methodOptions}
                value={methodOptions.find(o => o.value === form?.method)}
                onChange={opt => handleChange("method", opt.value)}
              />
            </FormItem>
            <FormItem label={t('remark')}>
              <Form.Control
                size="sm"
                as="textarea"
                value={form.remark}
                onChange={e => handleChange("remark", e.target.value)}
              />
            </FormItem>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {mode === "create" && (
          <Button variant="primary" onClick={onCreate}>
            {t('create')}
          </Button>
        )}
        {mode === "edit" && (
          <Button variant="primary" onClick={onEdit}>
            {t('edit')}
          </Button>
        )}
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RoleEditModal;
