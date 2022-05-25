import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";
import ClassifierModal from "@/components/Modal/ClassifierModal";

import PageHeader from "@/components/PageHeader";
import useTableParams from "@/hooks/useTableParams";

function ClassifierManage() {
  const { t } = useTranslation();
  // const { folder = "default" } = useParams();
  const userInfo = useSelector(state => state?.global?.userInfo || {});
  const { email, firstName, lastName } = userInfo;
  const folder = email || '';

  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);

  const [params, setParams] = useTableParams({});

  const [classifierModalInfo, setClassifierModalInfo] = useState({
    isOpen: false
  });

  useEffect(() => {
    getList();
  }, []);

  const columns = [
    {
      key: "classifierName",
      name: 'Classifier Name',
      width: 300
    },
    {
      key: "classifierDpName",
      name: 'Classifier Display Name'
    }
  ];

  async function getList(p = params) {
    try {
      const { data } = await axios({
        url: `/fore/classifiers`,
        method: "GET",
      });
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  function actionFormatter(p) {
    const { row } = p;
    const { subscribed } = row;
    return subscribed && (
      <Button
        variant="icon"
        onClick={() => {
          setClassifierModalInfo({
            ...classifierModalInfo,
            isOpen: true,
            record: { ...row, folder }
          });
        }}
      >
        <i className="fas fa-edit" />
      </Button>
    );
  }
  return (
    <>
      <div className="main">
        <PageHeader title={[t('classifier')]} onClick={getList} />
        <Table
          searchable={false}
          paginable={false}
          selected={selected}
          selectChange={setSelected}
          columns={columns}
          rows={data}
          params={params}
          selectable={false}
          actionFormatter={actionFormatter}
          onChange={p => {
            setParams(p);
            getList(p);
          }}
        />
        <ClassifierModal
          modalInfo={classifierModalInfo}
          onChange={setClassifierModalInfo}
          isOpen={classifierModalInfo.isOpen}
          onClose={() => setClassifierModalInfo({ ...classifierModalInfo, isOpen: false })}
          onUpdate={getList}
        />
      </div>
    </>
  );
}

export default ClassifierManage;
