import React from "react";
import { PaginationLinks } from "./PaginationLinks";
import { PaginationToolbar } from "./PaginationToolbar";

export function Pagination(props) {
  const { children, isLoading, paginationProps } = props;
  return (
    <>
      {children}
      <div className="flex justify-between">
        <PaginationLinks paginationProps={paginationProps} />
        <PaginationToolbar
          isLoading={isLoading}
          paginationProps={paginationProps}
        />
      </div>
    </>
  );
}
