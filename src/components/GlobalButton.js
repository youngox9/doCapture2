import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroup,
  Button
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Popper from '@/components/Popper';
import i18next from "@/i18n";
import { setLang } from '@/reducers/global';


/**
 * 多國語系按鈕
 * @param {*} props 
 * @returns 
 */
const GlobalButton = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const languages = useSelector(state => state?.global?.languages || []);
  const lang = useSelector(state => state?.global?.lang || '');


  /**
   * 切換不同語系
   * @param {*} val language key name
   */
  function changeLanguage(val) {
    i18next.changeLanguage(val, (err, t) => {
      // if (err) return console.log('something went wrong loading', err);
      i18next.reloadResources();
      dispatch(setLang(val));
    });
  }

  return (
    <Popper
      width={150}
      placement="bottom"
      trigger="click"
      component={({ setOpen }) => (
        <ListGroup variant="flush">
          {
            languages.map(val => (
              <ListGroup.Item
                className="text-center"
                action
                active={val === lang}
                onClick={() => {
                  setOpen(false);
                  changeLanguage(val);
                }}>
                {t(val)}
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      )}
    >
      <Button variant="icon white" {...props}>
        <i className="fas fa-globe-americas" />
      </Button>
    </Popper>
  );
};

export default GlobalButton;
