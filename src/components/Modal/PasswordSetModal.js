import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import useForm, { FormItem, getRulesData } from "@/hooks/useForm";
import { setUserInfo } from "@/reducers/global";

/**
 * navbar/change set password modal
 * @param {} props 
 * @returns 
 */
function SetPasswordModal(props) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
  });

  const rulesData = getRulesData(form);

  const rules = {
    password: rulesData.password,
    password2: rulesData.password2,
  };

  const {
    touchedErrors, errors, isTouched, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const {
    modalInfo: { isOpen = false }, onChange = () => { }
  } = props;

  const { t } = useTranslation();

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
        newPassword: form.password,
      };
      try {
        const res = await axios({
          url: "/fore/users/password/set",
          method: "PUT",
          data
        });
        toast(t('alert_update_success'), {
          type: "success"
        });
        getUserInfo();
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


  async function getUserInfo() {
    try {
      const { data } = await axios({
        url: `/fore/users/profile`,
        method: "GET",
        withError: false,
        withLoading: false,
      });
      dispatch(setUserInfo(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
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
          <FormItem label={t('password')} error={touchedErrors.password} type="vertical" isRequire>
            <Form.Control
              size="sm"
              type="password"
              value={form.password}
              onChange={e => handleChange("password", e.target.value)}
            />
          </FormItem>
          <FormItem label={t('comfirm_password')} error={touchedErrors.password2} type="vertical" isRequire>
            <Form.Control
              size="sm"
              type="password"
              value={form.password2}
              onChange={e => handleChange("password2", e.target.value)}
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

export default SetPasswordModal;
