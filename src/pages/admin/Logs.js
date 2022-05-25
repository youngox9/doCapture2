import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Table from "@/components/Table";
import UserSelect from "@/components/UserSelect";
import PageHeader from "@/components/PageHeader";
import useTableParams from "@/hooks/useTableParams";

function ClassifierManage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({ label: 'default', value: '' });
  const [params, setParams] = useTableParams({});



  useEffect(() => {
    getList();
  }, [user?.value]);


  /**
   * [GET] get logs list
   * @param {*} p api params
   */

  async function getList(p = params) {
    try {
      const { data } = await axios({
        url: `/back/notifications`,
        method: "GET",
        params: {
          ...params,
          userId: user?.value === 'default' ? '' : user?.value
        }
      });
      setParams(p);
      setData(data);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }


  /**
   * on user dropdown change
   * @param {} opt user option data
   */
  function onUserChange(opt) {
    setUser(opt);
  }


  const columns = [
    {
      key: "level",
      name: t('security_level'),
      width: 200,
      sortable: true
    },
    {
      key: "createTime",
      name: "create Time",
      sortable: true
    },
    {
      key: "category",
      name: "Category",
      sortable: true
    },
    {
      key: "user",
      name: "User",
      sortable: true
    },
    {
      key: "content",
      name: "Content",
      // sortable: true
    },
  ];

  return (
    <>
      <div className="main">
        <PageHeader title={[t("logs")]} onClick={getList} />
        <Table
          searchable={false}
          paginable
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
          <div className="spacer spacer-full">
            <p>{t('user')}</p>
            <UserSelect
              onChange={onUserChange}
              value={user}
            />
          </div>
        </Table>
      </div>
    </>
  );
}

export default ClassifierManage;
