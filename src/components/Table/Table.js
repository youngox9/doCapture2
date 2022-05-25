import React, {
  useState,
  useEffect,
} from "react";
import {
  Button, Form,
} from "react-bootstrap";
import _ from 'lodash';
import DataGrid from "react-data-grid";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@vlsergey/react-bootstrap-pagination";
import { useTranslation } from "react-i18next";
import ColumnsFilter from './ColumnsFilter';
import StateFilter from './StateFilter';
import Select from '@/components/Select';
import Empty from "@/components/Empty";

function getSortedObj(text) {
  const key = text.replace(/[+-]/g, "");
  let order = "";
  if (text.indexOf("+") > -1) {
    order = "+";
  } else if (text.indexOf("-") > -1) {
    order = "-";
  }

  return { key, order };
}

const COUNT_ARRAY = [
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 30, value: 30 },
  { label: 40, value: 40 }
];

const getIcon = ({ sortKey, sortOrder, key }) => {
  const getIconText = () => {
    if (sortKey === key) {
      if (sortOrder === "+") {
        return "sort-up";
      }
      if (sortOrder === "-") {
        return "sort-down";
      }
    }
    return "sort";
  };
  return <FontAwesomeIcon icon={["fa", getIconText()]} />;
};

let timer;

/**
 * table components :整體表格主要邏輯
 * @param {
 * selected [Array] 被勾選的欄位
 * row [Array] 傳入data
 * columns [Array] 欄位設定
 * onChange [Function] 當改變params(搜尋/Sort/page)時的callback
 * selectChange [Function] 當改變勾選欄位時
 * searchable [Boolean] 是否顯示搜尋列
 * paginable [Boolean] 是否顯示頁碼
 * } props
 *
 */
function Table(props) {

  const {
    selected = [],
    rows = [],
    columns: propsColumns = [],
    params = {},
    onChange = () => { },
    selectable = true,
    children,
    selectChange = () => { },
    searchable = true,
    paginable = true,
    actionFormatter = () => { }
  } = props;

  const [columnsFilter, setcolumnsFilter] = useState([]);
  const [keyword, setKeyword] = useState("");

  const {
    pageNo = 0,
    totalCounts = 0,
    totalPages = 0,
    pageSize = 0
  } = params;

  const { key: sortKey, order: sortOrder } = getSortedObj(params?.sortBy || "");

  const isSelectedAll = selected.length === rows.length && selected.length > 0;
  const isIndeterminate = !!(!isSelectedAll && selected.length > 0);
  const { t } = useTranslation();

  useEffect(() => {
    // const temp = propsColumns.map(obj => obj.key);
    setcolumnsFilter(propsColumns);
  }, [JSON.stringify(propsColumns)]);

  /**
   * 當點選checkbox select 時，把selected array丟到上層的callback
   * @param {*} id
   */
  function onSelected(id) {
    let newSelected = [...selected];
    const isSelected = !!selected.includes(id);
    if (isSelected) {
      newSelected = newSelected.filter(obj => obj.id === id);
    } else {
      newSelected = [...newSelected, id];
    }
    selectChange(newSelected);
  }

  /**
   * 當點選checkbox select all 時，把selected array丟到上層的callback
   * @param {*} id
   */
  function onSelectedAll() {
    if (isSelectedAll) {
      selectChange([]);
    } else {
      selectChange(rows.map(obj => obj.id));
    }
  }

  /**
   * on change table params
   * @param {*} newParams new table parmas
   */
  function changeParams(newParams) {
    selectChange([]);
    onChange(newParams);
  }

  /**
   * on click sort arrow
   * @param {*} key next sort key
   */
  function onSort(key) {
    let sortBy = key;
    if (sortOrder === "" || sortKey !== key) {
      sortBy += "+";
    } else if (sortOrder === "+") {
      sortBy += "-";
    } else if (sortOrder === "-") {
      sortBy += "";
    }
    changeParams({ ...params, sortBy });
  }

  /**
   * on click page button to change pageNo
   * @param {} val pageNo
   */
  function onPageChange(val) {
    changeParams({ ...params, pageNo: val });
  }

  /**
   * onchange page size dropdown
   * @param {*} val page size
   */
  function onPageSizeChange(val) {
    changeParams({ ...params, pageNo: 1, pageSize: val });
  }

  /**
   * on click search utton
   */
  function onSearch() {
    changeParams({ ...params, keyword });
  }

  /**
   * on keydown search debounce
   * @param {} val input value
   */
  function debounceKeydown(val) {
    setKeyword(val);
    clearTimeout(timer);
    timer = setTimeout(() => {
      changeParams({ ...params, keyword: val });
    }, 800);
  }

  // select column
  const selectColumn = {
    key: "select",
    name: "",
    width: 36,
    minWidth: 0,
    resizable: false,
    frozen: true,
    cellClass: `rdg-cell-center`,
    headerCellClass: `rdg-cell-center`,
    headerRenderer: () => (
      <div className="cell">
        <Form.Check
          id="select"
          type="checkbox"
          label=""
          checked={isSelectedAll}
          indeterminate={!!isIndeterminate}
          onChange={() => onSelectedAll()}
        />
      </div>
    ),
    formatter(p) {
      const {
        row: { id }
      } = p;
      const isSelected = !!selected.includes(id);

      return (
        <div className="cell">
          <Form.Check
            id="select"
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelected(id)}
          />
        </div>
      );
    }
  };

  const sortColumns = propsColumns.map(obj => {
    const {
      sortable = false, headerRenderer, formatter, align = 'start', isHover = false
    } = obj;

    return {
      ...obj,
      headerCellClass: `rdg-cell-header rdg-cell-${align}`,
      cellClass: clsx(`rdg-cell-${align}`, { 'rdg-cell-hover': isHover }),
      headerRenderer: (p) => {
        const { column } = p;
        const {
          column: { name, key, stateArray = [] },
        } = p;
        const isSorted = sortKey === key && !!sortOrder;
        const icon = getIcon({ sortKey, sortOrder, key });
        const isTranslate = t(key) !== key;
        const fieldName = isTranslate ? t(key) : name;
        const state = params?.state;
        return (
          <div className={clsx('cell cell-header')}>
            <div className="spacer">
              {sortable
                ? (
                  <Button
                    variant="clear white no-pad"
                    active={isSorted}
                    className="sort-button"
                    onClick={() => onSort(key)}
                    size="md"
                  >
                    <span>
                      {typeof headerRenderer === 'function' ? headerRenderer(p) : fieldName}
                    </span>
                    {icon}
                  </Button>
                ) : (
                  <span>
                    {typeof headerRenderer === 'function' ? headerRenderer(p) : fieldName}
                  </span>
                )}
              {stateArray.length > 0
                && (
                  <StateFilter
                    column={column}
                    value={state}
                    onChange={(val) => changeParams({
                      ...params, state: val
                    })}
                  />
                )}
            </div>
          </div>
        );
      },
      formatter(p) {
        const { column, row } = p;
        const value = _.get(row, column.key, '');

        return (
          <div className={clsx('cell')} alt={value}>
            {typeof formatter === 'function' ? formatter(p) : value}
          </div>
        );
      }
    };
  });

  const orderColumn = {
    key: "order",
    name: "",
    // width: 36,
    minWidth: 0,
    resizable: false,
    // frozen: true,
    isHover: true,
    cellClass: `rdg-cell-center rdg-cell-end rdg-cell-hover`,
    headerCellClass: `rdg-cell-center rdg-cell-end rdg-cell-fixed-right`,
    headerRenderer: () => (
      <div className={clsx('cell cell-header')}>
        <ColumnsFilter
          value={columnsFilter}
          columns={propsColumns}
          onChange={setcolumnsFilter}
        />
      </div>
    ),
    formatter(p) {

      return (
        <div className="cell">
          {typeof actionFormatter === 'function' ? actionFormatter(p) : null}
        </div>
      );
    }
  };

  const filteredColumns = sortColumns.filter((obj) => columnsFilter.find(o => o.key === obj.key) || obj.isHover);

  const columns = [
    ...(selectable && rows.length > 0 ? [selectColumn] : []),
    ...filteredColumns,
    orderColumn
  ];

  return (
    <>
      <div className="table-control">
        {/* table 左上角按鈕區塊 */}
        {children}
        {/* table 搜尋頁 */}
        {searchable && (
          <div className="search-input">
            <input
              placeholder={`${t('search')}...`}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyUp={e => debounceKeydown(e.target.value)}
            />
            <i className="fas fa-search" onClick={e => onSearch(e.target.value)} />
          </div>
        )}
      </div>

      {/* table 主區塊 */}
      <div className="table-container">
        <DataGrid
          rowKey="id"
          defaultColumnOptions={{
            sortable: true,
            resizable: true
          }}
          rowHeight={() => 36}
          noRowsFallback={() => <Empty />}
          enableCellSelect={false}
          columns={columns}
          rows={rows}
          enableVirtualization={false}
        />
      </div>

      {/* table 頁碼 */}
      {paginable && (
        <div className="pagination-container">
          <div className="spacer" align="center" justify="end">
            <p>{t('table_total', { value: totalCounts })}</p>
            <div style={{ width: '80px' }}>
              <Select
                options={COUNT_ARRAY}
                value={COUNT_ARRAY.find(opt => opt.value === pageSize)}
                onChange={opt => onPageSizeChange(opt.value)}
              />
            </div>
            <p>{t("table_per_page")}</p>
            <div className="pagination-wrap">
              <Pagination
                showFirstLast={totalPages >= 10}
                showPrevNext={totalPages >= 10}
                value={pageNo - 1}
                totalPages={totalPages}
                size="sm"
                onChange={e => {
                  const pageIndex = e.target.value + 1;
                  onPageChange(pageIndex);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
