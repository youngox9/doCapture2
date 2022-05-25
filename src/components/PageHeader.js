import React from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * 個頁面的大標題
 * @param {*} props
 * @returns
 */
function PageHeader(props) {
  const { t } = useTranslation();
  const { title = [], onClick, showWorkspace = false } = props;
  const { id: workspaceId } = useParams();

  const workspaces = useSelector(state => {
    const global = state?.global || {};
    const { ownedWorkspaces = [], sharedWorkspaces = [] } = global;
    return [...ownedWorkspaces, ...sharedWorkspaces];
  });

  const workspaceName = workspaceId
    ? workspaces.find(obj => obj.id === workspaceId)?.name || ""
    : t('my_space');

  const titleArr = [
    // 是否最前面要顯示workspace
    ...(workspaceName && showWorkspace ? [workspaceName] : []),
    ...title,
  ];

  return (
    <h3 className="page-header">
      <div className="spacer">
        {titleArr.map((tit, idx) => (
          <>
            <span>{tit}</span>
            {idx < titleArr.length - 1 && <span> / </span>}
          </>
        ))}
        {/* 重整的按鈕 */}
        {
          !!onClick && (
            <Button
              variant="icon"
              onClick={() => {
                if (typeof onClick === 'function') {
                  onClick();
                }
              }}>
              <i className="fas fa-sync-alt" />
            </Button>
          )
        }

      </div>
    </h3>
  );
}

export default PageHeader;
