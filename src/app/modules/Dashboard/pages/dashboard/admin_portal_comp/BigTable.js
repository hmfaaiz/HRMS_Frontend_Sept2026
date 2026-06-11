import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Accordion, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { PeriodType } from "../EmpUIHelper";

export function BigTable({ data, setBigTableModalData, expand }) {
  const [activeKey, setActiveKey] = useState(expand ? "0" : null); // Start with accordion closed (null)

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
      let employee_code = key === "Employee_Code";
      let isAmount = typeof value === "number" || !isNaN(Number(value));
      return {
        dataField: key,
        headerClasses: "text-xs",
        text: key.split("_").join(" "),
        sort: true,
        formatter: (cell) => {
          if (isDate && typeof cell === "string") {
            const dateObj = new Date(cell);
            const isValidDate = !isNaN(dateObj.getTime());
            return (
              <div
                className="line-clamp-1"
                title={isValidDate ? format(dateObj, "dd-MMM-yyyy") : ""}
              >
                {isValidDate ? format(dateObj, "dd-MMM-yyyy") : "-"}
              </div>
            );
          }
          if (isAmount) {
            return (
              <div className="line-clamp-1" title={cell}>
                {cell || "0"}
              </div>
            );
          }
          return (
            <div
              className={
                cell?.length > 25
                  ? "truncate w-36 line-clamp-1"
                  : "truncate line-clamp-1"
              }
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
        data.trendValue == 1
          ? dashboard?.activeFiscalYear?.label
          : dashboard?.activeFiscalYear?.payrollMonthLabel;
      name = `${name} - ${label ?? ""}`;
    }
    return name;
  };

  return (
    <div className="bg-white rounded-lg px-3 py-2 self-start">
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        <Card className="border-0">
          <Card.Header className="bg-white border-0 p-0">
            <div className="flex justify-between items-center w-full">
              {/* Left side - Accordion toggle with icon and heading */}
              <Accordion.Toggle
                eventKey="0"
                className="flex items-center gap-2 p-0 border-0 bg-transparent shadow-none hover:bg-transparent"
                style={{ outline: "none" }}
              >
                {activeKey === "0" ? (
                  <CircleMinus className="h-4 w-4 text-primary" />
                ) : (
                  <CirclePlus className="h-4 w-4 text-primary" />
                )}
                <h6 className="font-bold mb-0 text-primary">{getHeading()}</h6>
              </Accordion.Toggle>

              {/* Right side - View All button (only visible when accordion is open) */}
              {activeKey === "0" &&
                (data?.data.length > 0 ? (
                  <label
                    className="text-black cursor-pointer font-medium underline text-xs hover:text-tprimary mb-0"
                    onClick={() => setBigTableModalData(data)}
                  >
                    View All
                  </label>
                ) : (
                  <label className="text-gray-500 cursor-not-allowed font-medium text-xs mb-0">
                    View All
                  </label>
                ))}
            </div>
          </Card.Header>

          <Accordion.Collapse eventKey="0">
            <div className="pt-3">
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
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
