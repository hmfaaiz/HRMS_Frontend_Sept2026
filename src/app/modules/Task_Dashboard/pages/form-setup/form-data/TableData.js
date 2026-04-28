import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";

export function TableData({
  data,
  name,
  handleClick,
  columnColorRules = {},
  completeData,
}) {
  const columnData = data?.length > 0 ? data[0] : {};

  let columns = Object.keys(columnData).map((key) => {
    if (key === "profile_image") {
      return {
        dataField: "profile_image",
        text: "Picture",
        formatter: (cell) => {
          return (
            <img
              name="profile_image"
              src={
                cell
                  ? `${cell}`
                  : toAbsoluteUrl("/media/users/profileImage.png")
              }
              alt="Profile"
              width={16}
              height={16}
              className="object-cover rounded-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = toAbsoluteUrl("/media/users/profileImage.png");
              }}
            />
          );
        },
      };
    } else {
      let value = columnData[key];
      let isDate =
        typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
      let isAmount = typeof value === "number" || !isNaN(Number(value));

      return {
        dataField: key,
        text: key.split("_").join(" "),
        sort: true,
        formatter: (cell, row) => {
          // Determine custom style from columnColorRules if provided
          let customStyle = {};
          if (columnColorRules[key]) {
            const ruleResult = columnColorRules[key](cell, row, completeData);
            if (typeof ruleResult === "string") {
              customStyle = { color: ruleResult };
            } else if (typeof ruleResult === "object") {
              customStyle = ruleResult;
            }
          }

          // Date formatting
          if (isDate && typeof cell === "string") {
            const dateObj = new Date(cell);
            const isValidDate = !isNaN(dateObj.getTime());
            return (
              <div
                style={customStyle}
                title={isValidDate ? format(dateObj, "dd-MMM-yyyy") : ""}
              >
                {isValidDate ? format(dateObj, "dd-MMM-yyyy") : "-"}
              </div>
            );
          }

          // Amount / number formatting
          if (isAmount) {
            return (
              <div style={customStyle} title={cell}>
                {cell || ""}
              </div>
            );
          }

          // Default text field
          return (
            <div
              style={customStyle}
              className={cell?.length > 25 ? "truncate w-36" : "truncate"}
              title={cell}
            >
              {cell || ""}
            </div>
          );
        },
      };
    }
  });

  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <div className="flex justify-between">
        <h6 className="font-bold mb-0 text-primary">{name}</h6>
        {data?.length > 0 ? (
          <label
            className="text-black cursor-pointer font-medium underline text-xs hover:text-tprimary"
            onClick={() => handleClick(data, completeData)}
          >
            View All
          </label>
        ) : (
          <label className="text-gray-500 cursor-not-allowed font-medium text-xs">
            View All
          </label>
        )}
      </div>
      <div
        className={
          data?.length > 0
            ? "max-h-64 overflow-auto scrollbar-fancy"
            : "max-h-6 overflow-auto scrollbar-fancy"
        }
      >
        {data?.length > 0 ? (
          <BootstrapTable
            wrapperClasses="table-responsive"
            bordered={false}
            classes="big-table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            keyField="id"
            data={data}
            columns={columns}
            pagination={
              data?.length > 5
                ? paginationFactory({
                    sizePerPage: 5,
                    hideSizePerPage: true,
                    showTotal: true,
                  })
                : undefined
            }
          >
            <PleaseWaitMessage entities={data || []} />
            <NoRecordsFoundMessage entities={data || []} />
          </BootstrapTable>
        ) : (
          <label className="text-center">No Record Available</label>
        )}
      </div>
    </div>
  );
}
