import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import RoleModal from "@/components/Modal/RoleModal";
import useTableParams from "@/hooks/useTableParams";
import { comfirm } from "@/utils";

function Roles() {
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const [modalInfo, setModalInfo] = useState({ isOpen: false });
  const { t } = useTranslation();

  const columns = [
    {
      key: "name",
      name: "Name",
      width: 200,
      sortable: true
    },
    {
      name: "Remark",
      key: "remark",
      sortable: true
    },
  ];

  useEffect(() => {
    getList();
  }, [workspaceId]);

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
  /**
   * get role list
   * @param {*} p api params
   */
  async function getList(p = params) {
    try {
      const { data, ...rest } = await axios({
        url: `/back/roles`,
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
   * [DELETE] delete role
   * @param {*} record role data
   */
  function onDelete(record) {
    const { id, name } = record;

    comfirm({
      type: "warning",
      title: t('alert_delete_des', { value: name }),
      callback: async () => {
        try {
          const { data } = await axios({
            url: `/back/roles/${id}`,
            method: "DELETE"
          });
          getList();
        } catch (e) {
          console.log(">>>>>", e);
        }
      }
    });
  }

  return (
    <>
      <div className="main">
        <PageHeader title={[t('role')]} onClick={getList} />
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
              onClick={() => setModalInfo({ ...modalInfo, mode: 'create', isOpen: true })}
            >
              <i className="fas fa-plus-circle" />
              <span>{t('create')}</span>
            </Button>
          </div>
        </Table>
        <RoleModal
          modalInfo={modalInfo}
          onChange={setModalInfo}
          onUpdate={getList}
        />
      </div>
    </>
  );
}

export default Roles;
