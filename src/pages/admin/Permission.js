import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";

import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import FeaturesModal from "@/components/Modal/FeaturesModal";
import useTableParams from "@/hooks/useTableParams";

function Permission() {
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const [modalInfo, setModalInfo] = useState({ isOpen: false });
  const [columns, setColumns] = useState([]);
  const [features, setFeatures] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const { t } = useTranslation();


  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    getColumns();
  },
    [
      JSON.stringify(features),
      JSON.stringify(permissions)
    ]
  );

  function getColumns() {
    const newColumns = features.map(obj => {
      const { id, name } = obj;
      return {
        name,
        key: id,
        sortable: false,
        width: 200,
        align: 'center',
        formatter(p) {
          const { column, row } = p;

          const featureId = column?.key;
          const roleId = row?.id;
          const permissionId = permissions.find(
            o => o.featureId === featureId && o.roleId === roleId
          )?.id;
          const isSelected = !!permissionId;

          return (
            <Switch
              checked={isSelected}
              onChange={() => {
                if (isSelected) {
                  deletePermission(permissionId);
                } else {
                  postPermission(roleId, featureId);
                }
              }}
            />
          );
        }
      };
    });
    const res = [
      {
        name: "Role",
        key: "name",
        width: 200,
        sortable: false,
        frozen: true
      },
      ...newColumns
    ];
    setColumns(res);
  }

  async function postPermission(roleId, featureId) {
    try {
      const { data } = await axios({
        url: `/back/permissions`,
        method: "POST",
        data: {
          featureId,
          roleId
        }
      });
      getPermission();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function deletePermission(permissionId) {
    try {
      const { data } = await axios({
        url: `/back/permissions/${permissionId}`,
        method: "DELETE"
      });
      getPermission();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function getFeatures() {
    try {
      const { data } = await axios({
        url: `/back/features`,
        method: "GET"
      });
      setFeatures(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function getPermission() {
    try {
      const { data } = await axios({
        url: `/back/permissions`,
        method: "GET"
      });

      setPermissions(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function getRoles() {
    try {
      const { data } = await axios({
        url: `/back/roles`,
        method: "GET"
      });
      setRoles(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  function getList() {
    getRoles();
    getColumns();
    getPermission();
    getFeatures();
  }

  return (
    <>
      <div className="main">
        <PageHeader title={[t("permission")]} onClick={getList} />
        <Table
          paginable={false}
          searchable={false}
          selected={selected}
          selectChange={setSelected}
          columns={columns}
          rows={roles}
          params={params}
          selectable={false}
          headerRowHeight={30}
          rowHeight={50}
          onChange={p => {
            setParams(p);
            getList(p);
          }}
        />
        <FeaturesModal
          modalInfo={modalInfo}
          onChange={setModalInfo}
          onUpdate={getList}
        />
      </div>
    </>
  );
}

export default Permission;
