import React, { useEffect, useState } from "react";

import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";
import { comfirm } from "@/utils";

/**
 * Sign up modal
 * @param {*} props
 * @returns
 */
function SignupModal(props) {
  const { t } = useTranslation();
  const { isOpen, onClose = () => { } } = props;
  const [form, setForm] = useState({});
  const rulesData = getRulesData(form);

  const rules = {
    firstName: rulesData.isRequire,
    lastName: rulesData.isRequire,
    email: rulesData.checkEmail,
    // phone: rulesData.isRequire,
    password: rulesData.password,
    password2: rulesData.password2
  };

  const {
    handleChange,
    touchedErrors,
    resetErrors,
    validation
  } = useForm({ form, rules, setForm });

  const {
    firstName = '', lastName = '', email = '', password = '', password2
  } = form;

  useEffect(() => {
    resetErrors();
    setForm({ sex: 0 });
  }, [isOpen]);

  /**
   * [POST] sign up account
   */
  async function onSignUp() {
    const isValid = await validation();

    if (isValid) {
      try {
        const res = await axios({
          url: "/auth/signUp",
          method: "POST",
          data: {
            firstName,
            lastName,
            email,
            password
          },
          withToken: false
        });
        // toast(t('check_mailbox'), {
        //   type: "success"
        // });
        comfirm({
          type: "warning",
          buttons: ['OK'],
          title: `${t('check_mailbox')}`,
          showClose: false,
          callback: async () => {
            onClose();
          }
        });
      }
      catch (e) {
        console.log(">>>>>", e);
      }

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
        <Modal.Title>{t('signup')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="form">
          <div className="row">
            <div className="col">
              <FormItem type="vertical" label={t('firstName')} error={touchedErrors.firstName} isRequire>
                <Form.Control
                  size="sm"
                  type="text"
                  value={form.firstName}
                  placeholder=" "
                  onChange={e => handleChange("firstName", e.target.value)}
                />
              </FormItem>
            </div>
            <div className="col">
              <FormItem type="vertical" label={t('lastName')} error={touchedErrors.lastName} isRequire>
                <Form.Control
                  size="sm"
                  type="text"
                  value={form.lastName}
                  placeholder=" "
                  onChange={e => handleChange("lastName", e.target.value)}

                />
              </FormItem>
            </div>
            <div className="col col-12 ">
              <FormItem type="vertical" label={t('email')} error={touchedErrors.email} isRequire>
                <Form.Control
                  size="sm"
                  type="text"
                  value={form.email}
                  placeholder=" "
                  onChange={e => handleChange("email", e.target.value)}
                />
              </FormItem>
            </div>
            <div className="col col-12 ">
              <FormItem type="vertical" label={t('password')} error={touchedErrors.password}>
                <Form.Control
                  size="sm"
                  type="password"
                  value={form.password}
                  placeholder=" "
                  onChange={e => handleChange("password", e.target.value)}
                />
              </FormItem>
            </div>
            <div className="col col-12">
              <FormItem type="vertical" label={t('comfirm_password')} error={touchedErrors.password2}>
                <Form.Control
                  size="sm"
                  type="password"
                  value={form.password2}
                  placeholder=" "
                  onChange={e => handleChange("password2", e.target.value)}

                />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSignUp}>
          {t('signup')}
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignupModal;
