import React, {
  useEffect,
  useState,
} from "react";
import { Button, Form } from "react-bootstrap";
import _ from 'lodash';
import clsx from 'clsx';
import { useTranslation } from "react-i18next";
import Popper from '@/components/Popper';

/**
 * state 下拉選單
 * @param {} props
 * @returns
 */
function StateFilter(props) {
  const {
    column = {}, value = "", onChange = () => { }
  } = props;

  const valueArray = value.split(',').filter(v => v);

  const { key, stateArray = [] } = column;

  const { t } = useTranslation();
  const [temp, setTemp] = useState(value);

  useEffect(() => {
    setTemp(valueArray);
  }, [
    JSON.stringify(valueArray)
  ]);

  function onCheckboxChange(val) {
    let t = [];
    if (temp.includes(val)) {
      t = temp.filter(v => v !== val);
    } else {
      t = [...temp, val];
    }
    setTemp(t);
  }

  function onSubmit(e) {
    const newVal = temp.join(',');
    onChange(newVal);
  }

  return (
    <Popper
      width={150}
      height={250}
      component={() => (
        <div className="spacer" vertical="true" align="start">
          {
            stateArray.map(obj => {
              const { label, value: stateValue } = obj;
              const isChecked = temp.includes(stateValue);
              return (
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    key={stateValue}
                    name={stateValue}
                    id={stateValue}
                    label={t(stateValue)}
                    checked={isChecked}
                    onChange={() => onCheckboxChange(stateValue)}
                  />
                </Form.Group>
              );
            })
          }
          <hr />
          <div className="spacer" full="true" vertical="true" align="end">
            <Button
              className="btn-full"
              size="sm"
              onClick={onSubmit}>
              {t('apply')}
            </Button>
          </div>
        </div>
      )}
    >
      <Button
        full="true"
        className={clsx({ active: valueArray.length })}
        variant="icon"
        size="sm"
      >
        <i className="fas fa-filter" />
      </Button>
    </Popper>
  );
};

export default StateFilter;
