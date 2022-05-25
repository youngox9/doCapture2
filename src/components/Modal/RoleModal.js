import React, { useState, useEffect } from "react";

import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";

/**
 * admin/role create/edit modal
 * @param {*} props 
 * @returns 
 */
function RoleModal(props) {
  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;
  const { isOpen = false, mode = "create", record = {} } = modalInfo;
  const [form, setForm] = useState({});
  const rulesData = getRulesData(form);
  const rules = {
    name: rulesData.isRequire
  };
  const { touchedErrors, resetErrors, validation, handleChange } = useForm({ form, rules, setForm });

  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      const { name, remark } = record;
      setForm({ name, remark });
    } else {
      setForm({});
      resetErrors();
    }
  }, [isOpen, JSON.stringify(record)]);


  /**
   * [POST] create role
   */
  async function onCreate() {
    const isValid = await validation();
    if (isValid) {
      try {
        const res = await axios({
          url: `/back/roles`,
          method: "POST",
          data: {
            name: form.name || '',
            remark: form.remark || ''
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
   * [PUT] update role
   */
  async function onEdit() {
    const isValid = await validation();
    const { id } = record;
    if (isValid) {
      try {
        const res = await axios({
          url: `/back/roles/${id}`,
          method: "PUT",
          data: {
            name, remark
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
        <Modal.Title>{t(mode)} {t('role')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="container">
          <Form className="form">
            <FormItem label={t('name')} error={touchedErrors.name} isRequire>
              <Form.Control
                size="sm"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            </FormItem>
            <FormItem label={t('remark')} error={touchedErrors.remark}>
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

export default RoleModal;
