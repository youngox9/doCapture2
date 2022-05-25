import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import {
  Modal, Form, Button, Row, Col
} from "react-bootstrap";
import { toast } from "react-toastify";
import _ from 'lodash';
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { FormItem, getRulesData } from "@/hooks/useForm";

/**
 * 邀請成員加入workspace modal
 */
function InviteUserModal(props) {
  const { t } = useTranslation();
  const [form, setForm] = useState([{ key: uuidv4(), value: '' }]);

  const rulesData = getRulesData(form);

  const rules = form.reduce((prev, curr, index) => ({
    ...prev,
    [`${index}.value`]: rulesData.checkEmail
  }), {});

  const {
    errors, touchedErrors, isTouched, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const { modalInfo, modalInfo: { isOpen = false, record = {} }, onChange = () => { } } = props;
  const location = useLocation();
  const authType = location.pathname.includes('/admin') ? 'back' : 'fore';

  useEffect(() => {
    if (!isOpen) {
      setForm([{ key: uuidv4(), value: '' }]);
      resetErrors(false);
    }
  }, [isOpen]);

  /**
   * PSOT members email ids
   */
  async function onSubmit() {
    const isValid = await validation();
    if (isValid) {
      const { id } = record;
      const emails = form.map(obj => obj.value);
      try {
        const res = await axios({
          url: `/${authType}/workspaces/${id}/members/invite`,
          method: "POST",
          data: [...emails]
        });
        toast(t('check_mailbox'), {
          type: "success"
        });
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
   * remove email in list
   * @param {*} key item key uuid
   */
  function removeEmail(key) {
    const temp = form.filter(obj => obj.key !== key);
    setForm(temp);
  }

  /**
   * add email in list
   */
  function addEmail() {
    const temp = [...form, { key: uuidv4(), value: '' }];
    setForm(temp);
  }

  /**
   * close modal
   */
  function onClose() {
    onChange({ ...modalInfo, isOpen: false });
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
        <Modal.Title>{t('invite_users')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">{t('invite_users_des')}</p>
        <div className="row">
          <div className="col col-12">
            {
              form.map((obj, index) => {
                const { key, value } = obj;
                const errorMsg = _.get(touchedErrors, `${index}.value`);
                return (
                  <FormItem
                    key={key}
                    type="vertical"
                    label=""
                    error={errorMsg}>
                    <Row no-gutter>
                      <Col>
                        <Form.Control
                          size="sm"
                          type="text"
                          value={value}
                          placeholder={t('email_placeholder')}
                          onChange={e => handleChange(`${index}.value`, e.target.value)}
                        />
                      </Col>
                      {/* 至少留一個Email input */}
                      {form.length > 1
                        && (
                          <Col sm="auto">
                            <Button variant="icon" onClick={() => removeEmail(key)}>
                              <i className="fas fa-minus-circle" />
                            </Button>
                          </Col>
                        )}
                    </Row>
                  </FormItem>
                );
              })
            }
          </div>
        </div>
        <Button variant="dark btn-full" size="sm" onClick={addEmail}>
          {t('add_new_email')}
          <i className="fas fa-plus" />
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <div className="spacer" justify="end">
          <Button variant="primary" onClick={onSubmit}>
            {t('send')}
          </Button>
          <Button variant="outline-dark" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default InviteUserModal;
