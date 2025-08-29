import React from "react";

export const makeTablePaginationRenderer = ({
  isLoading,
  totalCount,
  pageSize
}) => props => {

  const { pages, onPageChange } = props;
  return (
    <div className="custom-pagination">
      {pages && pages.length > 0 && isLoading && (
        <span className={"spinner spinner-md spinner-primary"}></span>
      )}
      {pages.map(p => (
        <button
          key={p.page}
          className="btn btn-success"
          onClick={() => onPageChange(p.page)}
        >
          {p.page}
        </button>
      ))}
    </div>
  );
};
