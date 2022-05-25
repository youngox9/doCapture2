import React, { useEffect, useState, useRef } from "react";
import { Button, Nav } from "react-bootstrap";
import {
  useParams, useLocation, Link
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";

import PageHeader from "@/components/PageHeader";
import AccountModal from "@/components/Modal/AccountModal";
import useTableParams from "@/hooks/useTableParams";
import { comfirm } from "@/utils";
import { setUserInfo } from "@/reducers/global";

/**
 * 
 * @returns 
 */
function Accounts() {
  const dispatch = useDispatch();
  const { id: workspaceId } = useParams();
  const [selected, setSelected] = useState([]);
  const [list, setList] = useState([]);
  const [params, setParams] = useTableParams({ workspaceId });
  const [modalInfo, setModalInfo] = useState({ isOpen: false });
  const location = useLocation();

  const { t } = useTranslation();


  useEffect(() => {
    getList();
  }, [workspaceId]);


  function onUpdate() {
    getList();
  }

  /** 取得user data */
  async function getUserInfo() {
    try {
      const { data } = await axios({
        url: `/fore/users/profile`,
        method: "GET",
      });
      dispatch(setUserInfo(data));
      setForm(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  const columns = [
    {
      key: "name",
      name: "Name",
      sortable: true,
      formatter(props) {
        const { column, row } = props;
        const { firstName = '', lastName = '' } = row;
        return `${firstName} ${lastName}`;
      }
    },
    { key: "email", name: "Email", sortable: true, },
    { key: "roleName", name: "Role", sortable: true, },
  ];

  async function getList(p = params) {
    try {
      const { data, ...rest } = await axios({
        url: `/back/users`,
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
    const { id } = record;

    comfirm({
      type: "warning",
      title: `${t("alert_delete_des", { value: `${record.firstName} ${record.lastName}` })}`,
      callback: deleteUser
    });

    async function deleteUser() {
      try {
        const { data } = await axios({
          url: `/back/users/${id}`,
          method: "DELETE"
        });
        getList();
      } catch (e) {
        console.log(">>>>>", e);
      }
    }
  }

  function actionFormatter(p) {
    const { column, row } = p;
    const { email } = row;
    return (
      <div className="spacer spacer-full" justify="end">
        <Link
          component={Button}
          variant="outline-dark"
          size="sm"
          to={`/admin/classifier/${email}`}
        >
          <i className="fas fa-edit" />
          {t("classifier")}
        </Link>
        <hr vertical="true" />
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
        <PageHeader title={[t('accounts')]} onClick={getList} />
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
        <AccountModal
          modalInfo={modalInfo}
          onChange={setModalInfo}
          onUpdate={getList}
        />
      </div>
    </>
  );
}

export default Accounts;
