import React, { useEffect, useState } from "react";


import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import useForm, { FormItem, getRulesData } from "@/hooks/useForm";



/**
 * navbar/change password modal
 * @param {} props 
 * @returns 
 */
function PasswordModal(props) {
  const [form, setForm] = useState({
  });

  const rulesData = getRulesData(form);

  const rules = {
    oldPassword: rulesData.oldPassword,
    newPassword: rulesData.newPassword,
    newPassword2: rulesData.newPassword2,
  };

  const {
    touchedErrors, errors, isTouched, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const {
    modalInfo: { isOpen = false }, onChange = () => { }
  } = props;

  const { t } = useTranslation();

  const { oldPassword, newPassword } = form;
  useEffect(() => {
    setForm({});
    resetErrors(false);
  }, [isOpen]);

  /**
   * PUT change password
   */
  async function onSubmit() {
    const isValid = await validation();
    if (isValid) {
      const data = {
        oldPassword,
        newPassword
      };
      try {
        const res = await axios({
          url: "/fore/users/password",
          method: "PUT",
          data
          // withToken: false
        });
        toast(t('alert_update_success'), {
          type: "success"
        });
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
   * close modal
   */
  function onClose() {
    onChange({ isOpen: false });
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      scrollable
      centered
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('change_password')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="form">
          <FormItem label={t('current_password')} error={touchedErrors.oldPassword} type="vertical" isRequire>
            <Form.Control
              size="sm"
              type="password"
              value={form.oldPassword}
              onChange={e => handleChange("oldPassword", e.target.value)}
            />
          </FormItem>
          <FormItem label={t('new_password')} error={touchedErrors.newPassword} type="vertical" isRequire>
            <Form.Control
              size="sm"
              type="password"
              value={form.newPassword}
              onChange={e => handleChange("newPassword", e.target.value)}
            />
          </FormItem>
          <FormItem label={t('comfirm_password')} error={touchedErrors.newPassword2} type="vertical" isRequire>
            <Form.Control
              size="sm"
              type="password"
              value={form.newPassword2}
              onChange={e => handleChange("newPassword2", e.target.value)}
            />
          </FormItem>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSubmit}>
          {t('comfirm')}
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PasswordModal;
