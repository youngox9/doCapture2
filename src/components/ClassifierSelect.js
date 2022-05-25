import React, { useEffect, useState } from "react";

import { useHistory, useParams, useLocation } from "react-router-dom";
import axios from "@/utils/axios";
import Select from "@/components/Select";

/**
 * classifierName dropdown
 */
function ClassifierSelect() {
  const location = useLocation();
  const { classifierName = '' } = Object.fromEntries(
    new URLSearchParams(location.search)
  );
  const { id: workspaceId } = useParams();
  const history = useHistory();
  const [tyleList, setTypeList] = useState([]);

  useEffect(() => {
    getClassifier();
  }, []);

  /**
   * get classifier dropdown list
   */
  async function getClassifier() {
    try {
      const { data } = await axios({
        url: `/fore/classifiers/dropList`,
        method: "GET",
        params: {
          workspaceId
        }
      });

      const res = [
        // 第一個塞all
        {
          label: "All",
          value: '',
          pathname: `/meta${workspaceId ? `/${workspaceId}` : ""}`
        },
        // 塞其他的 classifier
        ...data.map(obj => {
          const {
            classifierDpName: cLabel,
            classifierName: cName
          } = obj;

          return {
            label: cLabel,
            value: cName,
            pathname: `/meta_classifier${workspaceId ? `/${workspaceId}` : ""}`,
            search: cName
          };
        })
      ];

      setTypeList(res);
    } catch (e) {
      console.log(">>>>>", e);
    }
  }

  /**
   * on change classifier option
   */
  function onChange(opt) {
    history.push({
      pathname: opt.pathname,
      search: opt.search ? `?classifierName=${opt.search}` : ""
    });
  }

  return (
    <div style={{ width: 300 }}>
      <Select
        size="sm"
        options={tyleList}
        onChange={onChange}
        value={tyleList.find(obj => obj.value === classifierName)}
      />
    </div>
  );
}

export default ClassifierSelect;
