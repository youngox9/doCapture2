import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import {
  useHistory, useParams, NavLink, useLocation
} from "react-router-dom";
import Cookies from "js-cookie";

import axios from "@/utils/axios";

import useForm, { FormItem, getRulesData } from "@/hooks/useForm";
import { setAuth } from "@/reducers/global";
import { comfirm } from "@/utils";
import Logo from '@/static/logo.png';
import { useTranslation } from "react-i18next";

function parseQuery(s) {
  const str = s.substring(1);
  return str.split('&').reduce((prev, curr) => {
    const key = curr.slice(0, curr.indexOf('='));
    const value = curr.slice(curr.indexOf('=') + 1);
    return {
      ...prev,
      [key]: value
    };
  }, {});
}

function InvitedSignUp() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const { email = '', code } = parseQuery(location.search || '') || {};

  console.log(email, code);

  const [form, setForm] = useState({
    email,
    sex: 0,
    password: "",
    password2: ""
  });
  const history = useHistory();

  const rulesData = getRulesData(form);
  const rules = {
    firstName: rulesData.isRequire,
    lastName: rulesData.isRequire,
    // phone: rulesData.isRequire,
    password: rulesData.password,
    password2: rulesData.password2
  };

  const {
    touchedErrors, errors, isTouched, resetErrors, validation, handleChange
  } = useForm({ form, rules, setForm });

  async function onSubmit() {
    const isValid = await validation();
    if (isValid) {
      console.log(form);
      try {
        const { data } = await axios({
          url: `/auth/signUpInvitation`,
          method: "POST",
          data: {
            ...form,
            code
          },
          withToken: false
        });

        comfirm({
          type: 'success',
          title: t('success'),
          des: t('signup_success_des'),
          callback: () => {
            history.push('/login');
          }
        });
      } catch (e) {
        const msg = e?.response?.data?.message || "Network Error";
        console.log(msg);
        // comfirm({
        //   type: 'error',
        //   title: 'Ne Error',
        //   des: msg,
        //   callback: () => { }
        // });
      }
    }
  }

  return (
    <>
      <div className="full-page-container">
        <div className="full-page-inner" type="sm">
          <img className="logo" src={Logo} />
          <div className="full-page-box" type="sm">
            <div className="form">
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
                    <p>{form.email}</p>
                  </FormItem>
                </div>
                {/* <div className="col col-6 ">
                  <FormItem type="vertical" label={t('phone')} error={touchedErrors.phone} isRequire>
                    <Form.Control
                      size="sm"
                      type="phone"
                      value={form.phone}
                      placeholder=" "
                      onChange={e => handleChange("phone", e.target.value)}

                    />
                  </FormItem>
                </div>
                <div className="col col-6 ">
                  <FormItem type="vertical" label={t('sex')}>
                    <div className="spacer">
                      <Form.Check
                        inline
                        label={t('male')}
                        name="sex"
                        id="male"
                        type="radio"
                        checked={form.sex === 0}
                        onChange={e => handleChange("sex", 0)}
                      />
                      <Form.Check
                        inline
                        label={t('female')}
                        name="sex"
                        id="female"
                        type="radio"
                        checked={form.sex === 1}
                        onChange={e => handleChange("sex", 1)}
                      />
                    </div>
                  </FormItem>
                </div> */}
                <div className="col col-12 ">
                  <FormItem type="vertical" label={t('password')} error={touchedErrors.password} isRequire>
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
                  <FormItem type="vertical" label={t('comfirm_password')} error={touchedErrors.password2} isRequire>
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
            </div>
            <div className="spacer mt-3" justify="center">
              <Button variant="primary" className="btn-full" onClick={onSubmit}>
                {t('signup')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvitedSignUp;
