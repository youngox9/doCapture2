import React, { useEffect, useState, useRef } from "react";
import FileSaver from "file-saver";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";
import FileTabs from "@/components/FileTabs";
import ClassifierSelect from "@/components/ClassifierSelect";
import useTableParams from "@/hooks/useTableParams";
import PageHeader from "@/components/PageHeader";
import RedoModal from "@/components/Modal/RedoModal";
import HistoryModal from "@/components/Modal/HistoryModal";
import StatusBar from "@/components/StatusBar";
import useSocket from "@/hooks/useSocket";
import ValidationModal from "@/components/Modal/ValidationModal";

import { STATE_ARRAY } from "@/utils";

/**
 * page: meta
 * @returns ReactDom
 */
function Meta() {
  const { t } = useTranslation();
  const { id: workspaceId = '' } = useParams();
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [validationModalInfo, setValidationModal] = useState({ isOpen: false });
  const [historyModalInfo, setHistoryModalInfo] = useState({ isOpen: false, record: {} });
  const [params, setParams] = useTableParams({ workspaceId });
  const [redoModalInfo, setRedoModalInfo] = useState({ isOpen: false, record: {} });
  const sharedWorkspaces = useSelector(state => state?.global?.sharedWorkspaces || []);

  // 檢查是否是被分享的workspace
  const isShared = !!sharedWorkspaces.find(obj => obj.id === workspaceId);

  const {
    lastJsonMessage,
  } = useSocket();

  useEffect(() => {
    silentUpdateList();
  }, [JSON.stringify(lastJsonMessage)]);

  useEffect(() => {
    getList();
  }, [workspaceId]);


  /**
 * [GET] quiet get file list from websocket
 */
  async function silentUpdateList() {
    try {
      const {
        data, ...rest
      } = await axios({
        url: `/fore/metadata`,
        method: "GET",
        params: {
          ...params,
          workspaceId
        },
        withError: false,
        withLoading: false,
      });
      setParams({ ...params, ...rest });
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [GET] get file list
   * @param {*} p api params
   */
  async function getList(p = params) {
    try {
      const {
        data,
        ...rest
      } = await axios({
        url: `/fore/metadata`,
        method: "GET",
        params: {
          ...p,
          workspaceId
        }
      });
      setParams({
        ...p,
        ...rest
      });
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
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
          // classifierName: ''
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
          // classifierName: '',
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
   * open validation modal
   */
  function openValidationModal() {
    const validationList = data.filter(obj => selected.includes(obj.id));
    setValidationModal({ isOpen: true, record: { validationList } });
  }

  const columns = [
    {
      key: "history",
      name: "",
      width: 60,
      align: 'center',
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
      width: 250
    },
    {
      key: "state",
      name: t('state'),
      width: 150,
      sortable: true,
      stateArray: STATE_ARRAY
    },
    // {
    //   key: "owner",
    //   name: t('owner'),
    //   sortable: true,
    //   width: 150
    // },
    {
      key: "uploader",
      name: t('uploader'),
      sortable: true,
      width: 150
    },
    {
      key: "page",
      name: t('page'),
      width: 100,
      sortable: true,
      align: 'center'
    },

    {
      key: "classifierDpName",
      name: t('classifier'),
      sortable: true,
      width: 200
    },

    {
      key: "updateTime",
      name: t('updateTime'),
      width: 150,
      sortable: true

    },
  ];

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

  function openRedoModal(val) {
    setRedoModalInfo({
      isOpen: true,
      record: { metaIds: [...val] }
    });
  }

  return (
    <>
      <div className="main">
        <PageHeader title={[t('meta')]} onClick={getList} showWorkspace />
        <StatusBar type="metadata" />
        <FileTabs />

        <div className="table-tabs-content">
          <Table
            actionFormatter={actionFormatter}
            selectable={!isShared}
            selected={selected}
            selectChange={setSelected}
            columns={columns}
            rows={data}
            params={params}
            onChange={p => {
              setParams(p);
              getList(p);
            }}
          >
            <div className="spacer" full="true" justify="start">
              <span>{t('classifier')}</span>
              {/* classifier dropdown */}
              <ClassifierSelect />
              <hr vertical="true" />
              {
                selected.length > 0
                && (
                  <>
                    {/* validation modal */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={openValidationModal}
                    >
                      <i className="fas fa-tasks" />
                      {t('validation')}
                    </Button>
                    {/* redo按鈕 */}
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={openRedoModal}>
                      <i className="fas fa-redo-alt" />
                      <span>{t('redo')}</span>
                    </Button>
                    <hr vertical="true" />
                    {/* 匯出已選檔案 */}
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={exportFiles}
                    >
                      <i className="fas fa-file-export" />
                      <span>{t('export')}</span>
                    </Button>
                  </>
                )
              }
              {/* 匯出全部檔案 */}
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
      <ValidationModal modalInfo={validationModalInfo} onChange={setValidationModal} onUpdate={getList} />
      {/* redo modal */}
      <RedoModal modalInfo={redoModalInfo} onChange={setRedoModalInfo} onUpdate={getList} />
      {/* history modal */}
      <HistoryModal modalInfo={historyModalInfo} onChange={setHistoryModalInfo} />
    </>
  );
}

export default Meta;
