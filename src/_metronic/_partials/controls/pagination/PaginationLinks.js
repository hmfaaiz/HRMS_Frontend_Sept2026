/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { getPages, getPagesCount } from "../../../_helpers";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export function PaginationLinks({ paginationProps }) {
  const { totalSize, sizePerPage, page, paginationSize } = paginationProps;
  const pagesCount = getPagesCount(totalSize, sizePerPage);
  const pages = getPages(page, pagesCount, paginationSize);
  const handleFirstPage = ({ onPageChange }) => {
    onPageChange(1);
  };

  const handlePrevPage = ({ page, onPageChange }) => {
    onPageChange(page - 1);
  };

  const handleNextPage = ({ page, onPageChange }) => {
    if (page < pagesCount) {
      onPageChange(page + 1);
    }
  };

  const handleLastPage = ({ onPageChange }) => {
    onPageChange(pagesCount);
  };

  const handleSelectedPage = ({ onPageChange }, pageNum) => {
    onPageChange(pageNum);
  };

  const disabledClass = pagesCount > 1 ? "" : "disabled";
  return (
    <div>
      {pagesCount < 2 && <></>}
      {pagesCount > 1 && (
        <>
          <div className={`flex flex-wrap justify-center ${disabledClass}`}>
            {/* First Page */}
            <button
              onClick={() => handleFirstPage(paginationProps)}
              className="w-6 h-6 flex justify-center items-center rounded-md border-none bg-tlight text-black mr-2 my-1"
            >
              <ChevronsLeft size={10} />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => handlePrevPage(paginationProps)}
              className="w-6 h-6 flex justify-center items-center rounded-md border-none bg-tlight text-black mr-2 my-1"
            >
              <ChevronLeft size={10} />
            </button>

            {/* Ellipsis Before */}
            {page > 1 && (
              <span className="w-6 h-6 flex justify-center items-center text-xs text-black mr-2 my-1">...</span>
            )}

            {/* Page Numbers */}
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => handleSelectedPage(paginationProps, p)}
                className={`w-6 h-6 flex justify-center items-center text-xs rounded-md border-0 mr-2 my-1 ${
                  page === p
                    ? "bg-primary text-white"
                    : "bg-tlight hover:bg-tprimary text-black"
                }`}
              >
                {p}
              </button>
            ))}

            {/* Ellipsis After */}
            {page < pagesCount && (
              <span className="w-6 h-6 flex justify-center items-center text-xs text-black mr-2 my-1">...</span>
            )}

            {/* Next Page */}
            <button
              onClick={() => handleNextPage(paginationProps)}
              className="w-6 h-6 flex justify-center items-center rounded-md border-none bg-tlight text-black mr-2 my-1"
            >
              <ChevronRight size={10} />
            </button>

            {/* Last Page */}
            <button
              onClick={() => handleLastPage(paginationProps)}
              className="w-6 h-6 flex justify-center items-center rounded-md border-none bg-tlight text-black mr-2 my-1"
            >
              <ChevronsRight size={10} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
