import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import FeaturesModal from "@/components/Modal/FeaturesModal";
import useTableParams from "@/hooks/useTableParams";
import { comfirm } from "@/utils";

function Features() {
  const { t } = useTranslation();
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const [modalInfo, setModalInfo] = useState({ isOpen: false });

  const columns = [
    {
      name: "Type",
      key: "type",
      sortable: true,
    },
    {
      name: "Name",
      key: "name",
      sortable: true,
    },
    {
      name: "Path",
      key: "path",
      sortable: true,
    },
    {
      name: "Method",
      key: "method",
      sortable: true,
      align: 'center'
    },
    { key: "enabled", name: "Enabled", sortable: true, },
    { key: "remark", name: "Remark", sortable: true, },
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

  useEffect(() => {
    getList();
  }, []);

  async function getList(p = params) {
    try {
      const { data, ...rest } = await axios({
        url: `/back/features`,
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
    const { id, name = '' } = record;

    comfirm({
      type: "warning",
      title: t(`alert_delete_des`, { value: name }),
      callback: deleteUser
    });

    async function deleteUser() {
      try {
        const { data } = await axios({
          url: `/back/features/${id}`,
          method: "DELETE"
        });
        getList();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  return (
    <>
      <div className="main">
        <PageHeader title={[t("features")]} onClick={getList} />
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
              onClick={() => setModalInfo({
                ...modalInfo,
                mode: 'create',
                isOpen: true,
                record: {},
              })}
            >
              <i className="fas fa-plus-circle" />
              <span>{t("create")}</span>
            </Button>
          </div>
        </Table>
        <FeaturesModal
          modalInfo={modalInfo}
          onChange={setModalInfo}
          onUpdate={getList}
        />
      </div>
    </>
  );
}

export default Features;
