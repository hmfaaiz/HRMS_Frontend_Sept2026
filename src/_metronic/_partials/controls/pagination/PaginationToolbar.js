/* eslint-disable no-unused-vars */
import React from "react";
import {PaginationTotalStandalone} from "react-bootstrap-table2-paginator";

export function PaginationToolbar(props) {

 
  const { isLoading, paginationProps } = props;
  const {
    sizePerPageList,
    sizePerPage,
    totalSize,
    onSizePerPageChange = [
      { text: "3", value: 3 },
      { text: "5", value: 5 },
      { text: "10", value: 10 }
    ]
  } = paginationProps;
  const style = {
    width: "55px",
    color: "#000000",

  };

  const onSizeChange = event => {
    const newSize = +event.target.value;
    onSizePerPageChange(newSize);
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && (
        <div className="d-flex align-items-center">
          <div className="mr-2 text-muted">Loading...</div>
          <div className="spinner spinner-primary mr-10"></div>
        </div>
      )}
      <select
        disabled={totalSize === 0}
        className={`text-xs bg-tsecondary rounded-sm border ${totalSize ===
          0 && "disabled"}`}
        onChange={onSizeChange}
        value={sizePerPage}
        style={style}
      >
        {sizePerPageList.map(option => {
          const isSelect = sizePerPage === `${option.page}`;
          return (
            <option
              key={option.text}
              value={option.page}
              className={`${isSelect ? "bg-tprimary" : "bg-tsecondary "}`}
            >
              {option.text}
            </option>
          );
        })}
      </select>
      <PaginationTotalStandalone className="text-muted" {...paginationProps} />
    </div>
  );
}
