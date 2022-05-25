import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import clsx from "clsx";
import reduce from 'await-reduce/dist';
import axios from "@/utils/axios";
import { getI18n } from "react-i18next";


const getRulesData = (form = {}) => {
  const { t } = getI18n();
  return {
    isRequire: [
      value => {
        if (Array.isArray(value)) {
          if (value.length <= 0) return t('form_is_require');
        } else if (!value) return t('form_is_require');
      }
    ],

    email: [
      value => {
        if (!value) return t('form_is_require');
      },
      value => {
        const regex = new RegExp(
          /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        );
        const res = regex.test(value);
        if (!res) return t('form_format_error');
      }
    ],
    checkEmail: [
      value => {
        if (!value) return t('form_is_require');
      },
      value => {
        const regex = new RegExp(
          /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        );
        const res = regex.test(value);
        if (!res) return t('form_format_error');
      },
      async (value) => {
        if (form.defaultEmail && value === form.defaultEmail) {
          return '';
        }
        try {
          const { data } = await axios({
            url: `/auth/exists`,
            method: "GET",
            withLoading: false,
            withError: false,
            params: {
              email: value
            }
          });
          return t('form_email_existed');
        } catch (e) {
          // setErrors({ ...errors, email: '' });
          return "";
        }
      }
    ],
    password: [
      value => {
        if (!value) return t('form_is_require');
        if (value?.length < 6) {
          return t('form_length_error', { value: 6 });
        }
      }
    ],
    password2: [
      value => {
        if (form.password !== value) return t('form_password_not_match');
      }
    ],
    oldPassword: [
      value => {
        if (!value) return t('form_is_require');
        if (value?.length < 6) {
          return t('form_length_error', { value: 6 });
        }
      }
    ],
    newPassword: [
      value => {
        if (!value) return t('form_is_require');
        if (value?.length < 6) {
          return t('form_length_error', { value: 6 });
        }
      }
    ],
    newPassword2: [
      value => {
        if (form.newPassword !== value) return t('form_password_not_match');
      }
    ]
  }
};

const FormItem = props => {
  const {
    error,
    children,
    label = "",
    isRequire = false,
    hideError = false,
    type = '',
    labelClass = '',

  } = props;
  return (
    <div
      className={clsx(
        "form-item",
        `form-item-${type}`,
        { "is-invalid": !!error },
        { "hide-error": hideError }
      )}
    >
      {label && (
        <div className={clsx("form-item-label", { "is-requried": isRequire }, labelClass)}>
          {label}
        </div>
      )}

      <div className="form-item-input">
        {children}
        {!hideError && <div className="form-item-error">{error}</div>}
      </div>
    </div>
  );
};

const useForm = props => {
  const { form = {}, rules = {}, setForm = () => { } } = props;
  const [errors, setErrors] = useState({});
  const [isTouched, setTouched] = useState(false);
  const [touchedErrors, setTouchedErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);


  useEffect(() => {
    if (isTouched) {
      validation();
    } else {
      setTouchedErrors({});
    }
  }, [isTouched, JSON.stringify(form)]);

  const isValid = Object.keys(errors).length <= 0;
  // const canSubmit = isValid && isTouched;

  async function getErrors() {
    const rulesArr = Object.keys(rules);
    const temp = reduce(rulesArr, async (prev, key) => {
      const value = _.get(form, key);
      const errorMsg = await getFieldError(key, value);
      if (errorMsg) {
        return {
          ...prev,
          [key]: errorMsg
        };
      }
      return prev;
    }, {});
    return temp;
  }

  async function getFieldError(key, value) {
    const validations = _.get(rules, key) || [];
    // const value = val || _.get(form, key);
    const errorMsg = reduce(validations, async (p, validationFunc) => {
      if (!p) {
        const text = await validationFunc(value);
        return text;
      }
      return p;
    }, "");
    return errorMsg;
  }

  function handleChange(key, value) {
    const temp = _.clone(form);
    _.set(temp, key, value);
    setForm(temp);
    setTouched(true);
    // touchedField(key, value);
  }

  async function touchedField(key, value) {
    const temp = _.clone(touchedErrors);
    const errorMsg = await getFieldError(key, value);

    _.set(temp, key, errorMsg);
    // console.log(key, value, temp);
    setTouchedErrors(temp);
  }

  async function validation() {
    const temp = await getErrors();
    const isOk = Object.keys(temp).length <= 0;
    setErrors(temp);
    setTouchedErrors(temp);
    setCanSubmit(isOk);
    return isOk;
  }

  function resetErrors() {
    setErrors({});
    setTouchedErrors({});
    setTouched(false);
    setCanSubmit(false);
  }


  return {
    resetErrors,
    validation,
    handleChange,
    setErrors,
    touchedErrors,
    errors,
    isValid,
    isTouched,
    setTouched,
    canSubmit,
    getFieldError
  };

};

export { FormItem, getRulesData };

export default useForm;
