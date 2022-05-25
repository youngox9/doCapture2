import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { Popover } from 'antd';
import { useParams } from "react-router-dom";
import FileSaver from "file-saver";
import _ from "lodash";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";
import UploadFileModal from "@/components/Modal/UploadFileModal";
import FileTabs from "@/components/FileTabs";

import PageHeader from "@/components/PageHeader";
import StatusBar from "@/components/StatusBar";
import WorkspaceSelect from "@/components/WorkspaceSelect";

import useTableParams from "@/hooks/useTableParams";
import useSocket from "@/hooks/useSocket";
import { comfirm } from "@/utils";

function Files() {
  const { t } = useTranslation();
  const { id: workspaceId = '' } = useParams();
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [params, setParams] = useTableParams({ workspaceId });

  const sharedWorkspaces = useSelector(state => state?.global?.sharedWorkspaces || []);
  const isShared = !!sharedWorkspaces.find(obj => obj.id === workspaceId);

  const columns = [
    {
      key: "filename",
      name: 'File Name',
      sortable: true,
      width: 250

    },
    {
      key: "state",
      name: 'State',
      width: 120,
      sortable: true,
      stateArray: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'verifying', value: 'verifying' },
        { label: 'Unclassified', value: 'unclassified' },
        { label: 'Done', value: 'done' }
      ]
    },
    // {
    //   key: "owner",
    //   name: 'Owner',
    //   sortable: true,
    //   width: 150

    // },
    {
      key: "uploader",
      name: 'Uploader',
      sortable: true,
      width: 150
    },
    {
      key: "pages",
      name: 'Pages',
      width: 40,
      sortable: true,
      align: 'center'

    },
    {
      key: "updateTime",
      name: 'Update Time',
      width: 150,
      sortable: true
    }
  ];

  const {
    send,
    lastJsonMessage,
  } = useSocket();


  useEffect(() => {
    getList();
  }, [workspaceId]);

  useEffect(() => {
    silentUpdateList();
  }, [JSON.stringify(lastJsonMessage)]);

  /**
   * [GET] quiet get file list from websocket
   */
  async function silentUpdateList() {
    try {
      const { data, ...rest } = await axios({
        url: `/fore/files`,
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
    setSelected([]);
    try {
      const { data, ...rest } = await axios({
        url: `/fore/files`,
        method: "GET",
        params: {
          ...p,
          workspaceId
        }
      });
      setParams({ ...p, ...rest });
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [DELETE] delete files
   */
  function onDeleteFiles() {
    comfirm({
      type: "warning",
      title: `${t('alert_delete_des', { value: selected.length })}`,
      callback: async () => {
        try {
          const { data } = await axios({
            url: `/fore/files`,
            method: "DELETE",
            data: {
              fsIds: selected
            }
          });
          send(['DF001', 'Delete file']);
          getList();
        } catch (e) {
          console.log(">>>>>", e);
          send(['DF002', 'Failed to delete file']);
        }
      }
    });
  }

  async function onDownload(record) {
    const { id: fsId } = record;
    try {
      const { data, headers } = await axios({
        url: `/fore/files/${fsId}/download`,
        method: "GET",
        responseType: "blob",
        params: {}
      });
      const disposition = headers["content-disposition"];
      const fileName = disposition.match(/filename="(.+)"/)[1];
      FileSaver.saveAs(data, fileName);
      // this.$awn.success("下載成功", { });
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * copy files to another
   * @param {} id
   */
  async function onCopyFiles(id) {
    try {
      const res = await axios({
        url: `/fore/files/copy`,
        method: "POST",
        data: {
          ids: selected,
          srcWorkspaceId: workspaceId,
          dstWorkspaceId: id
        }
      });
      toast("copy success", {
        type: "success"
      });
      getList();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * move files to another workspace
   * @param {*} id workspace id
   */
  async function onMoveFiles(id) {
    try {
      const res = await axios({
        url: `/fore/files/move`,
        method: "POST",
        data: {
          ids: selected,
          srcWorkspaceId: workspaceId,
          dstWorkspaceId: id
        }
      });
      toast("copy success", {
        type: "success"
      });
      getList();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  function actionFormatter(p) {
    const { row } = p;
    return (
      <Button variant="icon" onClick={() => onDownload(row)}>
        <i className="fas fa-download" />
      </Button>
    );
  }

  return (
    <>
      <div className="main">
        <PageHeader onClick={getList} showWorkspace />
        <StatusBar type="files" />
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
            <div className="spacer" justify="center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsUploadOpen(true)}
              >
                <i className="fas fa-upload" />
                {t('upload_file')}
              </Button>
              {selected.length > 0 && (
                <>
                  <>
                    <hr vertical="true" />
                    <Button variant="danger" size="sm" onClick={onDeleteFiles}>
                      <i className="fas fa-trash-alt" />
                      {t('remove')} ({selected.length})
                    </Button>
                    {/* 只有非shared的files才可以被copy/move */}
                    <WorkspaceSelect onChange={onCopyFiles}>
                      <Button variant="dark" size="sm">
                        <i className="fas fa-copy" />
                        {t('copy')} ({selected.length})
                      </Button>
                    </WorkspaceSelect>
                    <WorkspaceSelect onChange={onMoveFiles}>
                      <Button variant="dark" size="sm">
                        <i className="fas fa-file-export" />
                        {t('move')} ({selected.length})
                      </Button>
                    </WorkspaceSelect>
                  </>
                </>
              )}
            </div>
          </Table>
        </div>
      </div>
      <UploadFileModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          getList();
        }}
      />
    </>
  );
}

export default Files;
