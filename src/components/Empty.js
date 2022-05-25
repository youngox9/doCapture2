import React from "react";
import { } from "react-redux";
import { Empty } from 'antd';
import { useTranslation } from "react-i18next";

/**
 * no data 的 component
 * @returns 
 */
function EmptyEle() {
    const { t } = useTranslation();
    return <Empty description={t('no_data')} />;
}

export default EmptyEle;
