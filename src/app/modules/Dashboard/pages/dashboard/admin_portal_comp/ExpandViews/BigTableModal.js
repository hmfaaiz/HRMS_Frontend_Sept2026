import React from "react";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../../_metronic/_helpers";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { PeriodType } from "../../EmpUIHelper";

const BigTableModal = ({ onHide, show, data }) => {
  const columnData = data?.data?.length > 0 ? data?.data[0] : {};
  const dashboard = useSelector((state) => state.dashboard || []);
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
        sort: true,
        formatter: (cell) => {
          // For date formatting
          if (isDate && typeof cell === "string") {
            return (
              <div>{cell ? format(new Date(cell), "dd-MMM-yyyy") : ""}</div>
            );
          }

          // For amount formatting
          if (isAmount) {
            return (
              <div>
                {cell || "-"}
                {/* {Number(cell).toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })} */}
              </div>
            );
          }

          // For all other text fields
          return <div>{cell || ""}</div>;
        },
      };
    }
  });

  const getHeading = () => {
    if (!data) return "";
    let name = data.dashlet_name || "";
    if (data.isPeriodType) {
      const periodLabel = PeriodType[data.PeriodType];
      if (periodLabel) {
        name = `${name} In ${periodLabel}`;
      } else {
        const type = data.sequenceStatus == "0" ? "Next" : "Last";
        name = `${name} In ${type} ${data.days} Days`;
      }
    }
    if (data.trendValue) {
      const label =
        Number(data.trendValue) === 1
          ? dashboard?.activeFiscalYear?.label
          : dashboard?.activeFiscalYear?.payrollMonthLabel;
      name = `${name} - ${label ?? ""}`;
    }
    return name;
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="bg-white rounded-lg px-3 py-2 col-span-2">
        <h6 className="font-bold mb-0 text-primary"> {getHeading()}</h6>
        <div className="max-h-[65vh] overflow-auto scrollbar-fancy">
          {data?.data.length > 0 ? (
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="big-table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              keyField="id"
              data={data?.data?.length > 0 ? data?.data : []}
              columns={columns}
              //   pagination={
              //     data?.data?.length > 5
              //       ? paginationFactory({
              //           sizePerPage: 5,
              //           hideSizePerPage: true,
              //           showTotal: true,
              //         })
              //       : undefined
              //   }
            >
              <PleaseWaitMessage entities={data?.data || []} />
              <NoRecordsFoundMessage entities={data?.data || []} />
            </BootstrapTable>
          ) : (
            <label className="text-center">No Record Available</label>
          )}
        </div>
      </div>
      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BigTableModal;
