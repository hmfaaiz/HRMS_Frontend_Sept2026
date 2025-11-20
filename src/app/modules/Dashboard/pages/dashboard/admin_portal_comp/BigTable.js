import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";
import { PeriodType } from "../EmpUIHelper";

export function BigTable({ data, setBigTableModalData }) {
  const columnData = data?.data?.length > 0 ? data?.data[0] : {};

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
              } // Fallback if no image
              alt="Profile"
              width={16}
              height={16}
              className="object-cover rounded-sm"
              onError={(e) => {
                e.target.onerror = null; // Error loop rokne ke liye
                e.target.src = toAbsoluteUrl("/media/users/profileImage.png"); // Agar image load na ho toh fallback image set karo
              }}
            />
          );
        },
      };
    } else {
      let value = columnData[key];

      let isDate =
        typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
      let employee_code = key === "Employee_Code";
      let isAmount = typeof value === "number" || !isNaN(Number(value));
      return {
        dataField: key,
        text: key.split("_").join(" "),

        formatter: (cell) => {
          // For date formatting
          if (isDate && typeof cell === "string") {
            return (
              <div title={cell ? format(new Date(cell), "dd-MMM-yyyy") : ""}>
                {cell ? format(new Date(cell), "dd-MMM-yyyy") : ""}
              </div>
            );
          }

          // For amount formatting
          if (isAmount) {
            return (
              <div title={cell}>
                {cell || "0"}
                {/* {Number(cell).toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })} */}
              </div>
            );
          }

          // For all other text fields
          return (
            <div
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

  const getHeading = () => {
    if (data?.isPeriodType) {
      if (PeriodType[data?.PeriodType]) {
        return `${data.dashlet_name} In ${PeriodType[data?.PeriodType]}`;
      } else {
        return `${data.dashlet_name} In ${
          data?.sequenceStatus == "0" ? "Next" : "Last"
        } ${data?.days} Days`;
      }
    } else {
      return data?.dashlet_name;
    }
  };

  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <div className="flex justify-between">
        <h6 className="font-bold mb-0 text-primary">{getHeading()}</h6>

        {data?.data.length > 0 ? (
          <lable
            className={`text-black cursor-pointer font-medium underline text-xs hover:text-tprimary`}
            onClick={() => setBigTableModalData(data)}
          >
            View All
          </lable>
        ) : (
          <lable
            className={`text-gray-500 cursor-not-allowed font-medium text-xs`}
          >
            View All
          </lable>
        )}
      </div>
      <div
        className={
          data?.data.length > 0
            ? "max-h-64 overflow-auto scrollbar-fancy"
            : `max-h-6 overflow-auto scrollbar-fancy`
        }
      >
        {data?.data.length > 0 ? (
          <BootstrapTable
            wrapperClasses="table-responsive"
            bordered={false}
            classes="big-table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            keyField="id"
            data={data?.data?.length > 0 ? data?.data : []}
            columns={columns}
            pagination={
              data?.data?.length > 5
                ? paginationFactory({
                    sizePerPage: 5,
                    hideSizePerPage: true,
                    showTotal: true,
                  })
                : undefined
            }
          >
            <PleaseWaitMessage entities={data?.data || []} />
            <NoRecordsFoundMessage entities={data?.data || []} />
          </BootstrapTable>
        ) : (
          <label className="text-center">No Record Available</label>
        )}
      </div>
    </div>
  );
}
