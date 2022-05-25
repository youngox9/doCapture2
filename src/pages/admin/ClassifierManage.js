import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useHistory, useParams, useLocation } from "react-router-dom";
import FileSaver from "file-saver";
import { Switch } from "antd";
import axios from "@/utils/axios";
import Table from "@/components/Table";
import UserSelect from "@/components/UserSelect";
import BackClassifierModal from "@/components/Modal/BackClassifierModal";
import ExtractionsModal from "@/components/Modal/ExtractionsModal";

import PageHeader from "@/components/PageHeader";
import useTableParams from "@/hooks/useTableParams";

import { useTranslation } from "react-i18next";

function ClassifierManage() {
  const { folder = "default" } = useParams();

  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);

  const [params, setParams] = useTableParams({});
  const [status, setStatus] = useState('');
  const [userData, setUserData] = useState([]);
  const [classifierModalInfo, setClassifierModalInfo] = useState({
    isOpen: false
  });
  const [extractionsModalInfo, setExtractionsModalInfo] = useState({
    isOpen: false
  });
  const history = useHistory();
  const { t } = useTranslation();

  const columns = [
    {
      key: "classifierName",
      name: "Name",
      width: 300,
      sortable: true
    },
    {
      key: "classifierDpName",
      name: "Display Name",
      sortable: true
    },
    ...(folder === "default"
      ? []
      : [
        {
          name: "Subcribe",
          key: "subcribe",
          width: 50,
          sortable: false,
          align: 'center',
          formatter(p) {
            const { row } = p;
            const { classifierName = "", subscribed = false } = row;
            return (
              <Switch
                checked={subscribed}
                onChange={() => {
                  if (subscribed) {
                    deleteSubscribe(classifierName);
                  } else {
                    postSubscribe(classifierName);
                  }
                }}
              />
            );
          }
        }
      ]),
  ];

  useEffect(() => {
    onRefresh();
  }, [folder]);

  function onRefresh() {
    if (folder) {
      getList();
      if (folder !== 'default') {
        checkRebuildStatus();
      }
    }
  }

  async function onRefreshClassifier() {
    try {
      const { data } = await axios({
        url: `/back/classifiers/refresh`,
        method: "GET"
      });
      getList();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function onRebuild() {
    try {
      const { data } = await axios({
        url: `/back/classifiers/rebuild`,
        method: "POST",
        data: {
          folder
        }
      });
      onRefresh();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function checkRebuildStatus() {
    try {
      const { data } = await axios({
        url: `/back/classifiers/rebuildStatus`,
        method: "POST",
        data: {
          folder
        }
      });
      setStatus(data.status);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function onExport() {
    try {
      const { data, headers } = await axios({
        url: `/back/classifiers/export`,
        method: "GET",
        responseType: "blob",
        params: {
          folder
        }
      });
      const disposition = headers["content-disposition"];
      const fileName = disposition.match(/filename="(.+)"/)[1];
      FileSaver.saveAs(data, fileName);

    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function getList(p = params) {
    try {
      const { data } = await axios({
        url: `/back/classifiers`,
        method: "GET",
        params: {
          folder
        }
      });
      // setUserData(data);
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function postSubscribe(classifierName) {
    try {
      const { data } = await axios({
        url: `/back/classifiers/subscribebyName`,
        method: "POST",
        data: {
          classifierName,
          folder
        }
      });
      onRefresh();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  async function deleteSubscribe(classifierName) {
    try {
      const { data } = await axios({
        url: `/back/classifiers/subscribebyName`,
        method: "DELETE",
        data: {
          classifierName,
          folder
        }
      });
      onRefresh();
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  function onUserChange(opt) {
    const { email } = opt;
    history.push(`/admin/classifier/${email}`);
  }


  function actionFormatter(p) {
    const { row } = p;
    const { subscribed = false } = row;
    return (
      <div className="spacer spacer-full" justify="end">
        <Button
          size="sm"
          variant="outline-dark"
          onClick={() => {
            setExtractionsModalInfo({
              ...extractionsModalInfo,
              isOpen: true,
              record: { ...row, folder }
            });
          }}
        >
          {t('extractions')}
        </Button>
        {

          subscribed && (
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => {
                setClassifierModalInfo({
                  ...classifierModalInfo,
                  isOpen: true,
                  record: { ...row, folder }
                });
              }}
            >
              {t('classifier')}
            </Button>
          )
        }
      </div>
    );
  }

  return (
    <>
      <div className="main">
        <PageHeader title={[t('classifier')]} onClick={onRefresh} />
        <Table
          actionFormatter={actionFormatter}
          searchable={false}
          paginable={false}
          selected={selected}
          selectChange={setSelected}
          columns={columns}
          rows={data}
          params={params}
          selectable={false}
          onChange={p => {
            setParams(p);
            getList(p);
          }}
        >
          <div className="spacer spacer-full" justify="space-between">
            <p>{t('user')}:</p>
            <UserSelect
              onChange={onUserChange}
              value={{ label: folder, value: folder }}
            />
            <div className="spacer spacer-full" justify="end">
              {
                folder === 'default'
                  ? (
                    <Button variant="dark" size="sm" onClick={() => onRefreshClassifier()}>
                      <i className="fas fa-sync-alt" />
                      {t('refresh')}
                    </Button>
                  )
                  : (
                    <>
                      <Button variant="dark" size="sm" onClick={() => onRebuild()} disabled={status === 'busy'}>
                        <i className="fas fa-sync-alt" />
                        {t('rebuild')}
                      </Button>
                    </>
                  )
              }

              <Button variant="outline-dark" size="sm" onClick={() => onExport()}>
                <i className="fas fa-file-export" />
                {t('export')}
              </Button>
            </div>
          </div>
        </Table>
      </div>
      <ExtractionsModal
        modalInfo={extractionsModalInfo}
        onChange={setExtractionsModalInfo}
        isOpen={extractionsModalInfo.isOpen}
        onUpdate={() => getList()}
      />
      <BackClassifierModal
        modalInfo={classifierModalInfo}
        onChange={setClassifierModalInfo}
        isOpen={classifierModalInfo.isOpen}
        onUpdate={() => getList()}
      />
    </>
  );
}

export default ClassifierManage;
