import React, {
  useEffect,
  useState,
} from "react";
import {
  Button, Form,
} from "react-bootstrap";
import _ from 'lodash';
import clsx from 'clsx';
import { useTranslation } from "react-i18next";

import Popper from '@/components/Popper';

/**
 * columns filter 表格欄位前端過濾popper
 */
export default (props) => {
  const {
    value = [], columns = [], onChange = () => { }
  } = props;
  const [temp, setTemp] = useState(value);

  const { t } = useTranslation();

  useEffect(() => {
    setTemp(value.filter(obj => obj.key && obj.key !== 'action'));
  }, [JSON.stringify(value)]);

  const columnsArr = columns.filter(obj => obj.key && obj.key !== 'action');
  const isSelectedAll = columnsArr.length === temp.length && temp.length > 0;

  return (
    <Popper
      width={200}
      height={300}
      component={() => (
        <>
          <div className="spacer" vertical="true" align="start">
            <Form.Check
              type="checkbox"
              name="group"
              label={t('select_all')}
              checked={isSelectedAll}
              onChange={() => {
                if (isSelectedAll) {
                  setTemp([]);
                } else {
                  setTemp(columnsArr);
                }
              }}
            />
            <hr />
            {
              columnsArr.map(obj => {
                const isChecked = !!temp.find(o => o.key === obj.key);
                const isTrans = !(t(obj.key) === obj.key);
                return (
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      key={obj.key}
                      id={obj.key}
                      // name={obj.key}
                      label={isTrans ? t(obj.key) : obj.name}
                      checked={isChecked}
                      onChange={() => {
                        let newTemp = [];
                        if (isChecked) {
                          newTemp = temp.reduce((prev, curr) => {
                            if (curr.key === obj.key) {
                              return prev;
                            }
                            return [...prev, curr];
                          }, []);
                        } else {
                          newTemp = [...temp, obj];
                        }
                        setTemp(newTemp);
                      }}
                    />
                  </Form.Group>

                );
              })
            }
          </div>
          <hr />
          <div className="spacer spacer-full mt-2" justify="end">
            <Button
              className="btn-full"
              size="sm"
              onClick={() => onChange(temp)}
            >{t('apply')}
            </Button>
          </div>
        </>
      )}
    >
      <Button
        className={clsx({ active: (temp.length !== columnsArr.length) && temp.length > 0 })}
        variant="icon"
      >
        <i className="fas fa-columns" />
      </Button>
    </Popper>
  );
};
