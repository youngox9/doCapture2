import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import FileSaver from "file-saver";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";

import FileTabs from "@/components/FileTabs";
import ClassifierSelect from "@/components/ClassifierSelect";
import PageHeader from "@/components/PageHeader";
import useTableParams from "@/hooks/useTableParams";
import RedoModal from "@/components/Modal/RedoModal";
import ValidationModal from "@/components/Modal/ValidationModal";
import HistoryModal from "@/components/Modal/HistoryModal";
import StatusBar from "@/components/StatusBar";


import { STATE_ARRAY } from "@/utils";

/**
 * page: meta_classifier?classifierName=???
 * @returns ReactDom
 */
function MetaClassifier() {
  const { t } = useTranslation();
  const { id: workspaceId = '' } = useParams();
  const [selected, setSelected] = useState([]);
  const [metaColumns, setMetaColumns] = useState([]);
  const [data, setData] = useState([]);
  const [validationModalInfo, setValidationModal] = useState({ isOpen: false });
  const [historyModalInfo, setHistoryModalInfo] = useState({ isOpen: false, record: {} });
  const [redoModalInfo, setRedoModalInfo] = useState({ isOpen: false, record: {} });
  const [params, setParams] = useTableParams({ workspaceId });
  const location = useLocation();

  const { classifierName } = Object.fromEntries(
    new URLSearchParams(location.search)
  );

  useEffect(() => {
    onRefresh();
  }, [workspaceId, classifierName]);

  function onRefresh() {
    getclassifierDpSetting();
    getList();
    setSelected([]);
  }

  /**
   * [GET] get classifier display name setting list
   */
  async function getclassifierDpSetting() {
    try {
      const { data } = await axios({
        url: `/fore/classifiers/dpSetting`,
        method: "GET",
        params: {
          classifierName
        }
      });

      const newColumns = data
        .filter(obj => obj.dpFlag)
        .map(obj => ({
          key: `data.${obj.fieldName}`,
          name: obj.fieldDpName,
          minWidth: 200,
          sortable: true
        }));
      setMetaColumns(newColumns);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [GET] get classifier list
   * @param {} p params
   */
  async function getList(p = params) {
    try {
      const { data, ...rest } = await axios({
        url: `/fore/metadata/classifier`,
        method: "GET",
        params: {
          ...p,
          workspaceId,
          classifierName
        }
      });
      setParams({
        ...p, ...rest
      });
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }


  /**
   * open validation modal
   */
  function openValidationModal() {
    const validationList = data.filter(obj => selected.includes(obj.id));
    setValidationModal({ isOpen: true, record: { validationList } });
  }

  /**
   * [GET] export all list data in this page
   */
  async function exportAll() {
    try {
      const { data, headers } = await axios({
        url: `/fore/metadata/classifier/export`,
        method: "GET",
        responseType: "blob",
        params: {
          ...params,
          workspaceId,
          classifierName
        }
      });
      const disposition = headers["content-disposition"];
      const fileName = disposition.match(/filename="(.+)"/)[1];
      FileSaver.saveAs(data, fileName);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [GET] export selected list data
   */
  async function exportFiles() {
    try {
      const { data, headers } = await axios({
        url: `/fore/metadata/classifier/export`,
        method: "PUT",
        responseType: "blob",
        params: {
          classifierName,
          workspaceId,
        },
        data: selected
      });
      const disposition = headers["content-disposition"];
      const fileName = disposition.match(/filename="(.+)"/)[1];
      FileSaver.saveAs(data, fileName);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * render action column
   * @param {} p row data
   * @returns 
   */
  function actionFormatter(p) {
    const { row, column } = p;
    const canRedo = row.state !== 'processing';
    return canRedo && (
      <Button
        variant="outline-dark"
        size="sm"
        onClick={() => setRedoModalInfo({
          isOpen: true,
          record: {
            ...row,
            metaIds: [row.id]
          }
        })}>
        <i className="fas fa-redo-alt" />
        <span>{t('redo')}</span>
      </Button>
    );
  }


  const columns = [
    {
      key: "history",
      name: "",
      width: 60,
      align: 'center',
      frozen: true,
      formatter(p) {
        const { row, column } = p;
        const { historyFlag = false } = row;

        return historyFlag && (
          <Button
            variant="icon"
            onClick={() => setHistoryModalInfo({
              isOpen: true, record: { ...row, metaIds: [row.id] }
            })}>
            <i className="fas fa-history" />
          </Button>
        );
      }
    },
    {
      key: "filename",
      name: t('file_name'),
      sortable: true,
      frozen: true,
      width: 250,
    },
    {
      key: "state",
      name: t('state'),
      width: 150,
      sortable: true,
      frozen: true,
      stateArray: STATE_ARRAY
    },
    {
      key: "page",
      name: t('page'),
      width: 100,
      sortable: true,
      frozen: true,
      align: 'center'
    },
    ...metaColumns
  ];

  return (
    <>
      <div className="main">
        <PageHeader
          title={[classifierName]}
          onClick={onRefresh}
          showWorkspace
        />
        <StatusBar type="classifier" />
        <FileTabs />
        <div className="table-tabs-content">
          <Table
            selectable
            selected={selected}
            selectChange={setSelected}
            columns={columns}
            rows={data}
            params={params}
            onChange={p => {
              setParams(p);
              getList(p);
            }}
            actionFormatter={actionFormatter}
          >
            <div
              className="spacer"
              // justify="space-between"
              style={{ width: "100%" }}
            >
              <span>{t('classifier')}</span>
              <ClassifierSelect />
              {selected.length > 0 && (
                <>
                  <hr vertical="true" />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={openValidationModal}
                  >
                    <i className="fas fa-tasks" />
                    {t('validation')}
                  </Button>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => setRedoModalInfo({
                      isOpen: true,
                      record: { metaIds: [...selected] }
                    })}>
                    <i className="fas fa-redo-alt" />
                    <span>{t('redo')}</span>
                  </Button>
                  <hr vertical="true" />
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={exportFiles}
                  >
                    <i className="fas fa-file-export" />
                    <span>{t('export')}</span>
                  </Button>
                </>
              )}
              <Button
                variant="dark"
                size="sm"
                onClick={exportAll}
              >
                <i className="fas fa-file-export" />
                <span>{t('export_all')}</span>
              </Button>
            </div>
          </Table>
        </div>
      </div>
      {/* validation modal */}
      <ValidationModal modalInfo={validationModalInfo} onChange={setValidationModal} onUpdate={onRefresh} />
      {/* redo modal */}
      <RedoModal modalInfo={redoModalInfo} onChange={setRedoModalInfo} onUpdate={onRefresh} />
      {/* history modal */}
      <HistoryModal modalInfo={historyModalInfo} onChange={setHistoryModalInfo} />
    </>
  );
}

export default MetaClassifier;
