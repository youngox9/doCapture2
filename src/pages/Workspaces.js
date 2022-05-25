import React, { useEffect, useState, useRef } from "react";
import { Button, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import WorkspaceModal from "@/components/Modal/WorkspaceModal";
import useTableParams from "@/hooks/useTableParams";
import { comfirm } from "@/utils";
import { setSharedWorkspaces, setOwnedWorkspaces } from "@/reducers/global";
import useSocket from "@/hooks/useSocket";

function WorkspacesManage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const [modalInfo, setModalInfo] = useState({ isOpen: false });

  const {
    send,
  } = useSocket();


  useEffect(() => {
    onRefresh();
  }, [workspaceId]);

  /**
   * update total page
   */
  function onRefresh() {
    getList();
    getSharedWorkspaces();
    getOwnedWorkspaces();
  }

  /**
   * [GET] get workspace list
   * @param {} p api params
   */
  async function getList(p = params) {
    try {
      const { data, ...rest } = await axios({
        url: `/fore/workspaces`,
        method: "GET",
        params: {
          ...p
        }
      });
      setParams({
        ...p,
        ...rest
      });
      setList(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * [DETETE] delete workspace
   * @param {*} record workspace row data
   */
  function onDelete(record) {
    const { id, name } = record;
    comfirm({
      type: "warning",
      title: `${t('alert_delete_des', { value: name })} ?`,
      callback: async () => {
        try {
          const { data } = await axios({
            url: `/fore/workspaces/${id}`,
            method: "DELETE"
          });
          send('DW001', `Delete workspaces ${name}`);
          onRefresh();
        } catch (e) {
          console.log(">>>>>", e);
          send('DW002', `Failed to delete workspaces ${name}`);
        }
      }
    });
  }

  /**
   * get shared workspaces
   */
  async function getSharedWorkspaces() {
    try {
      const { data } = await axios({
        url: `/fore/workspaces/shared`,
        method: "GET"
      });
      dispatch(setSharedWorkspaces(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * get owned workspaces
   */
  async function getOwnedWorkspaces() {
    try {
      const { data } = await axios({
        url: `/fore/workspaces/owned`,
        method: "GET"
      });
      dispatch(setOwnedWorkspaces(data));
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  const columns = [
    {
      key: "name",
      name: "Workspace Name",
      sortable: true
    },
    {
      key: "owner",
      name: "Owner",
      sortable: true
    },
    {
      key: "members",
      name: "Members",
      formatter(props) {
        const { column, row } = props;
        const value = row?.[column.key];
        const text = Array.isArray(value) ? value.map(o => o.name).join(', ') : '';
        return text;
      }
    },
    {
      key: "remark",
      name: "Remark",
      sortable: true
    },
  ];

  function actionFormatter(p) {
    const { column, row } = p;
    return (
      <div className="spacer spacer-full" justify="center">
        <Button
          variant="icon"
          onClick={() => setModalInfo({
            ...modalInfo,
            mode: 'edit',
            record: row,
            isOpen: true
          })}
        >
          <i className="fas fa-edit" />
        </Button>
        <Button variant="icon" onClick={() => onDelete(row)}>
          <i className="fas fa-trash-alt" />
        </Button>
      </div>
    );
  }


  return (
    <>
      <div className="main">
        <PageHeader title={[t('workspaces')]} onClick={onRefresh} />
        <Table
          actionFormatter={actionFormatter}
          selected={selected}
          selectChange={setSelected}
          columns={columns}
          rows={list}
          params={params}
          selectable={false}
          onChange={p => {
            setParams(p);
            getList(p);
          }}
        >
          <div className="spacer">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalInfo({ mode: "create", isOpen: true })}
            >
              <i className="fas fa-plus-circle" />
              <span>{t('create')}</span>
            </Button>
          </div>
        </Table>
        <WorkspaceModal
          modalInfo={modalInfo}
          onChange={setModalInfo}
          onUpdate={onRefresh}
        />
      </div>
    </>
  );
}

export default WorkspacesManage;
