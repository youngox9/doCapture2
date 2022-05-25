import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import RoleModal from "@/components/Modal/RoleModal";
import useTableParams from "@/hooks/useTableParams";

function Roles() {
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const { t } = useTranslation();

  const columns = [
    {
      key: "name",
      name: "Name",
      // width: 200,
      sortable: false
    },
    {
      name: "State",
      key: "state",
      sortable: false,
      width: 100,
    }
  ];

  useEffect(() => {
    getList();
  }, [workspaceId]);


  function actionFormatter(p) {
    const { column, row } = p;
    const { name, state } = row;
    return (
      <div className="spacer spacer-full" justify="end">
        <Button variant="outline-success" size="sm" onClick={() => postService(name, 'start')} disabled={state && state === 'running'}>
          <i className="fas fa-play" />
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => postService(name, 'stop')} disabled={state && state !== 'running'}>
          <i className="fas fa-stop" />
        </Button>

        <hr vertical="true" />
        <Button variant="dark" size="sm" onClick={() => postService(name, 'enable')}>
          {t('enable')}
        </Button>
        <Button variant="dark" size="sm" onClick={() => postService(name, 'disable')}>
          {t('disabled')}
        </Button>
      </div>
    );
  }

  async function getList(p = params) {
    try {
      const { data } = await axios({
        url: `/sysadm/services`,
        method: "GET",
      });
      setList(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function putService() {
    try {
      const { data } = await axios({
        url: `/sysadm/services/install`,
        method: "PUT",
      });
      getList();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function postService(name, operation) {
    try {
      const { data } = await axios({
        url: `/sysadm/services/${name}/${operation}`,
        method: "POST",
      });
      getList();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  return (
    <>
      <div className="main">
        <PageHeader
          title={[t('service')]}
          onClick={getList}
        />
        <Table
          actionFormatter={actionFormatter}
          selected={selected}
          selectChange={setSelected}
          columns={columns}
          rows={list}
          params={params}
          selectable={false}
          searchable={false}
          paginable={false}
        >
          <div className="spacer">
            <Button
              variant="primary"
              size="sm"
              onClick={putService}
            >
              <span>{t('install_service')}</span>
            </Button>
          </div>
        </Table>
      </div>
    </>
  );
}

export default Roles;
