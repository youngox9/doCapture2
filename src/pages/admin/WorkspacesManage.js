import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import WorkspaceManageModal from "@/components/Modal/WorkspaceManageModal";
import useTableParams from "@/hooks/useTableParams";
import { comfirm } from "@/utils";

function WorkspacesManage() {
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const [modalInfo, setModalInfo] = useState({ isOpen: false });
  const { t } = useTranslation();

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
      sortable: false,
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
    }
  ];

  useEffect(() => {
    getList();
  }, [workspaceId]);

  async function getList(p = params) {
    try {
      const { data, ...rest } = await axios({
        url: `/back/workspaces`,
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

  function onDelete(record) {
    const { id, name } = record;

    comfirm({
      type: "warning",
      title: t('alert_delete_des', { value: name }),
      callback: async () => {
        try {
          const { data } = await axios({
            url: `/back/workspaces/${id}`,
            method: "DELETE"
          });
          getList();
        } catch (e) {
          console.log(">>>>>", e);
        }
      }
    });
  }


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
        <PageHeader title={[t('workspaces')]} onClick={getList} />
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
              onClick={() => setModalInfo({ mode: "create", isOpen: true, record: {} })}
            >
              <i className="fas fa-plus-circle" />
              <span>{t('create')}</span>
            </Button>
          </div>
        </Table>
        <WorkspaceManageModal
          modalInfo={modalInfo}
          onChange={setModalInfo}
          onUpdate={getList}
        />
      </div>
    </>
  );
}

export default WorkspacesManage;
