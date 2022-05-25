import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "@/utils/axios";
import Popper from "@/components/Popper";
import Select from "@/components/Select";

function WorkspaceSelect(props) {
  const { t } = useTranslation();
  const { id: workspaceId = '' } = useParams();
  const { style = {}, onChange = () => { }, children } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    getList();
  }, []);

  function handleChange(opt) {
    setValue(opt);
  }
  async function getList() {
    setIsLoading(true);
    const a = await getSharedWorkspaces();
    const b = await getOwnedWorkspaces();
    const workspacesArr = [...a, ...b].map(obj => ({ label: obj.name, value: obj.id }));
    const opts = [{ label: t('my_space'), value: '' }, ...workspacesArr];
    const newOpts = opts.filter(obj => obj.value !== workspaceId);
    setOptions(newOpts);
    setIsLoading(false);
  }

  async function getSharedWorkspaces() {
    try {
      const { data } = await axios({
        url: `/fore/workspaces/shared`,
        method: "GET",
        withLoading: false,
        withError: false
      });
      return data;
    } catch (e) {
      console.log(">>>>>", e);
    }
    return [];
  }
  async function getOwnedWorkspaces() {
    try {
      const { data } = await axios({
        url: `/fore/workspaces/owned `,
        method: "GET",
        withLoading: false,
        withError: false
      });
      return data;
    } catch (e) {
      console.log(">>>>>", e);
    }
    return [];
  }
  return (
    <>
      <Popper
        width={300}
        component={() => (
          <div>
            {t('select_workspace')}
            <Select
              isLoading={isLoading}
              options={options}
              value={value}
              onChange={handleChange}
              placeholder={t('select_workspace')}
            />
            <div className="spacer spacer-full mt-2" justify="end">
              <Button variant="dark" size="sm" onClick={() => onChange(value?.value)} disabled={value?.value === undefined}>
                {t('submit')}
              </Button>
            </div>
          </div>
        )} >
        {children}
      </Popper>
    </>
  );
}

export default WorkspaceSelect;
