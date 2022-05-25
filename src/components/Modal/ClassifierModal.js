import React, { useState, useEffect, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import { Modal, Form, Button } from "react-bootstrap";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { Switch } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import useForm, { getRulesData, FormItem } from "@/hooks/useForm";
import Empty from "@/components/Empty";

function ClassifierModal(props) {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const { modalInfo = {}, onChange = () => { }, onUpdate = () => { }, type = "back" } = props;

  const { record = {}, isOpen } = modalInfo;

  const {
    id, classifierName, classifierDpName, folder
  } = record;

  const email = useSelector(state => state?.global?.userInfo?.email);

  const form = list.reduce((prev, curr = {}) => {
    const { fieldDpName, fieldName } = curr;
    return {
      ...prev,
      [fieldName]: fieldDpName
    };
  }, {});

  const rulesData = getRulesData(form);

  const rules = list.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.fieldName]: rulesData.isRequire
    }),
    {}
  );

  const {
    errors, isTouched, resetErrors, validation
  } = useForm({ form, rules });

  const isDefault = folder === "default";

  useEffect(() => {
    if (isOpen) {
      setDisplayName(classifierDpName);
      getList();
    }
    return () => {
      setDisplayName('');
      setList([]);
    };
  }, [isOpen, email, record?.classifierName]);

  async function updateList() {
    const isValid = await validation();
    if (isValid) {
      try {
        const res = await axios({
          url: `fore/classifiers/${id}`,
          method: "PUT",
          data: {
            classifierDpName: displayName,
            classifierDpSetting: list
          }
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

  async function getList() {
    try {
      const { data = [] } = await axios({
        url: `fore/classifiers/dpSetting`,
        method: "GET",
        params: {
          classifierName,
        }
      });
      const sortedData = _.sortBy(data, o => o.dpOrder);
      setList(sortedData);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  // console.log(list);
  function onChangeData(key, value, keyName = 'fieldDpName') {
    const newData = list.map(obj => {
      if (obj.fieldName === key) {
        return { ...obj, [keyName]: value };
      }
      return obj;
    });
    setList(newData);
  }

  function onClose() {
    onUpdate();
    onChange({ ...modalInfo, isOpen: false });
  }

  return (
    <Modal
      show={modalInfo.isOpen}
      onHide={onClose}
      scrollable
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('classifier')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormItem label={t('classifierName')} type="vertical">
          <Form.Control
            size="sm"
            type="text"
            value={displayName}
            placeholder=" "
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </FormItem>
        <div className="form-flex">
          <div className="row row-header">
            <div className="col-1" />
            <div className="col-1">{t('order')}</div>
            <div className="col">{t('name')}</div>
            <div className="col">{t('display_name')}</div>
            <div className="col-2 text-center">{t('searchable')}</div>
            <div className="col-2 text-center">{t('display')}</div>
          </div>
          {isDefault
            && (
              <>
                {list.map((field, idx) => {
                  const {
                    dpOrder, fieldName, fieldDpName, dpFlag
                  } = field;
                  return (
                    <div className="row">

                      <div className="col-1">{idx + 1}</div>
                      <div className="col">{fieldName}</div>
                      <div className="col">
                        {fieldDpName}
                      </div>
                      <div className="col-2 text-center">
                        <Switch checked={dpFlag} onChange={e => onChangeData(fieldName, !dpFlag, 'dpFlag')} disabled />
                      </div>
                    </div>
                  );
                })}
              </>
            )}

          {!isDefault
            && (
              <>
                <DragDropContext
                  onDragEnd={e => {
                    const { source, destination, draggableId } = e;
                    if (!destination) {
                      return;
                    }
                    const arr = [...list];
                    const [remove] = arr.splice(source.index, 1);
                    arr.splice(destination.index, 0, remove);
                    setList(arr);
                  }}
                >

                  <Droppable droppableId="id">
                    {provided => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {list.map((field, idx) => {
                          const {
                            dpOrder, fieldName, fieldDpName, dpFlag, searchable
                          } = field;
                          return (
                            <Draggable
                              draggableId={fieldName}
                              index={idx}
                              key={fieldName}
                            >
                              {p => (
                                <>
                                  <div
                                    ref={p.innerRef}
                                    {...p.draggableProps}
                                    className="row"
                                  >
                                    <div className="col-1" {...p.dragHandleProps}>
                                      <i className="fas fa-grip-horizontal" />
                                    </div>
                                    <div className="col-1">{idx + 1}</div>
                                    <div className="col">{fieldName}</div>
                                    <div className="col">
                                      <FormItem error={errors?.[fieldName]} hideError>
                                        <Form.Control
                                          size="sm"
                                          type="text"
                                          value={fieldDpName}
                                          placeholder=" "
                                          onChange={e => onChangeData(fieldName, e.target.value)}
                                          isInvalid={isTouched && errors?.[fieldName]}
                                        />
                                      </FormItem>
                                    </div>
                                    <div className="col-2 text-center">
                                      <Switch checked={searchable} onChange={e => onChangeData(fieldName, !searchable, 'searchable')} />
                                    </div>
                                    <div className="col-2 text-center">
                                      <Switch checked={dpFlag} onChange={e => onChangeData(fieldName, !dpFlag, 'dpFlag')} />
                                    </div>
                                  </div>
                                </>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
          {list.length <= 0 && <Empty />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {!isDefault && (
          <Button variant="primary" onClick={updateList}>
            {t('save')}
          </Button>
        )}
        <Button
          variant="outline-dark"
          onClick={() => onChange({ ...modalInfo, isOpen: false })}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClassifierModal;
