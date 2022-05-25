import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import axios from "@/utils/axios";

let timer;

function UserSelect(props) {
  const { style = {}, onChange = () => { }, value = "", isMulti, excepts = [], showDefault = true } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      getList();
    }, 600);
  }, [keyword]);

  function onInputChange(val) {
    setKeyword(val);
  }

  const location = useLocation();

  const authType = location.pathname.includes('/admin') ? 'back' : 'fore';

  async function getList() {
    setIsLoading(true);
    try {
      const { data, ...rest } = await axios({
        url: `/${authType}/users`,
        method: "GET",
        withLoading: false,
        params: {
          pageSize: 20,
          pageNo: 1,
          keyword
        }
      });

      const opts = [
        ...(showDefault ? [{ label: "default", value: "default", email: "default" }] : []),
        ...data.map(obj => ({
          label: `${obj.firstName} ${obj.lastName}`,
          email: obj.email,
          value: obj.id
        }))
      ];

      setOptions(opts);
    } catch (e) {
      console.log(">>>>>", e);
    }
    setIsLoading(false);
  }

  const filterOpts = options.filter(obj => !excepts.includes(obj.value));

  return (
    <>
      <div style={{ width: "300px", maxWidth: '100%', ...style }}>
        <Select
          {...props}
          isLoading={isLoading}
          menuPosition="fixed"
          classNamePrefix="react-select"
          options={filterOpts}
          inputValue={keyword}
          onInputChange={onInputChange}
          value={value}
          onChange={onChange}
          closeMenuOnSelect={!isMulti}
          onMenuOpen={() => {
            getList();
            setKeyword("");
          }}
        />
      </div>
    </>
  );
}

export default UserSelect;
