import React, { useState } from "react";
import _ from "lodash";

const DEFAULT_PAGE_CONFIG = {
  sortBy: "",
  pageNo: 1,
  pageSize: 10,
  totalCounts: 0,
  keyword: ""
};
const useTableParams = ({ params: propsParams = DEFAULT_PAGE_CONFIG }) => {
  const [params, setParams] = useState({
    ...DEFAULT_PAGE_CONFIG,
    ...propsParams
  });
  return [params, setParams];
};

export default useTableParams;
