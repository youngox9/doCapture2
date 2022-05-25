import React, { useState, useEffect } from "react";
import {
  Modal, Form, Button, Col, Row
} from "react-bootstrap";
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";
import Select from "@/components/Select";

/**
 * admin/account edit/create modal
 * @param {*} props 
 * @returns 
 */
function AccountModal(props) {
  const [roleTypeOptions, setRoleTypeOptions] = useState([]);
  const [defaultEmail, setDefaultEmail] = useState('');
  const [form, setForm] = useState({});

  const rulesData = getRulesData({ ...form, defaultEmail });

  const rules = {
    firstName: rulesData.isRequire,
    lastName: rulesData.isRequire,
    roleId: rulesData.isRequire,
    // 如果是編輯模式，就不能編輯email
    ...(mode === 'create' ? {
      email: rulesData.checkEmail
    } : {}),
    password: rulesData.password,
  };

  const {
    touchedErrors, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  const { t } = useTranslation();

  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { } } = props;

  const { isOpen = false, mode = "create", record = {} } = modalInfo;

  useEffect(() => {
    getRoleList();
  }, []);

  useEffect(() => {
    if (isOpen) {
      getUserInfo();
    } else {
      setForm({});
      resetErrors();
      setDefaultEmail('');
    }
  }, [isOpen]);

  /**
   * [GET] get user info
   */
  async function getUserInfo() {
    const { id } = record;
    if (id) {
      try {
        const { data } = await axios({
          url: `/back/users/${record.id}`,
          method: "GET",
        });
        setForm(data);
        setDefaultEmail(data.email);
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
   * [GET] get role type list dropdown
   */
  async function getRoleList() {
    try {
      const { data } = await axios({
        url: `/back/roles`,
        method: "GET",
        params: {},
        withError: false
      });
      const options = data.map(obj => ({
        label: obj.name,
        value: obj.id
      }));
      setRoleTypeOptions(options);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [POST] create user
   */
  async function onCreate() {
    const isValid = await validation();

    if (isValid) {
      try {
        const data = {
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          roleId: form.roleId || '',
          email: form.email || '',
          password: form.password || '',
          birthday: form.birthday || '',
          country: form.country || '',
          city: form.city || '',
          phone: form.phone || '',
          company: form.company || '',
          department: form.department || '',
          jobTitle: form.jobTitle || ''
        };
        const res = await axios({
          url: `/back/users`,
          method: "POST",
          data
        });
        toast(t('alert_create_success'), {
          type: "success"
        });
        onClose();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  /**
   * [PUT] update user
   */
  async function onEdit() {
    const isValid = await validation();
    const { id } = record;

    if (isValid) {
      try {
        const data = {
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          roleId: form.roleId || '',
          email: form.email || '',
          password: form.password || '',
          birthday: form.birthday || '',
          country: form.country || '',
          city: form.city || '',
          phone: form.phone || '',
          company: form.company || '',
          department: form.department || '',
          jobTitle: form.jobTitle || ''
        };

        const res = await axios({
          url: `/back/users/${id}`,
          method: "PUT",
          data
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
    onUpdate();
    onChange({ ...modalInfo, isOpen: false });
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      scrollable
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t(mode)} {t('user')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form className="form">
          <div className="container">
            <Row className="row">
              <Col sm="12" md="8">
                <FormItem
                  label={t('role_type')}
                  error={touchedErrors.roleId}
                  isRequire
                >
                  {
                    mode === "create"
                      ? (
                        <Select
                          options={roleTypeOptions}
                          value={roleTypeOptions.find(
                            o => o.value === form?.roleId
                          )}
                          onChange={opt => handleChange("roleId", opt.value)}
                        />
                      )
                      : <p>{form.roleName}</p>
                  }
                </FormItem>
                <FormItem label={t('firstName')} error={touchedErrors.firstName} isRequire>
                  <Form.Control
                    size="sm"
                    value={form.firstName}
                    onChange={e => handleChange("firstName", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('lastName')} error={touchedErrors.lastName} isRequire>
                  <Form.Control
                    size="sm"
                    value={form.lastName}
                    onChange={e => handleChange("lastName", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('email')} error={touchedErrors.email} isRequire>
                  {
                    mode === "create"
                      ? (
                        <Form.Control
                          size="sm"
                          value={form.email}
                          onChange={e => handleChange("email", e.target.value)}
                        />
                      )
                      : <p>{form.email}</p>
                  }
                </FormItem>
                <FormItem label={t('password')} error={touchedErrors.password} isRequire>
                  <Form.Control
                    size="sm"
                    type="password"
                    value={form.password}
                    onChange={e => handleChange("password", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('birthday')} error={touchedErrors.birthday}>
                  <DatePicker
                    format="YYYY/MM/DD"
                    onChange={(m, value) => handleChange("birthday", value)}
                    value={form.birthday ? moment(form.birthday) : undefined}
                  />
                </FormItem>
                <FormItem label={t('phone')} error={touchedErrors.phone}>
                  <Form.Control
                    size="sm"
                    value={form.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                  />
                </FormItem>
              </Col>
              <Col sm="12">
                <Row>
                  <Col sm="12" md="6">
                    <FormItem label={t('country')}>
                      <Form.Control
                        size="sm"
                        value={form.country}
                        onChange={e => handleChange("country", e.target.value)}
                      />
                    </FormItem>
                  </Col>
                  <Col sm="12" md="6">
                    <FormItem label={t('city')} labelClass="text-sm-right">
                      <Form.Control
                        size="sm"
                        value={form.city}
                        onChange={e => handleChange("city", e.target.value)}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <FormItem label={t('company')}>
                  <Form.Control
                    size="sm"
                    value={form.company}
                    onChange={e => handleChange("company", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('department')}>
                  <Form.Control
                    size="sm"
                    value={form.department}
                    onChange={e => handleChange("department", e.target.value)}
                  />
                </FormItem>
                <FormItem label={t('job')}>
                  <Form.Control
                    size="sm"
                    value={form.jobTitle}
                    onChange={e => handleChange("jobTitle", e.target.value)}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
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

export default AccountModal;
