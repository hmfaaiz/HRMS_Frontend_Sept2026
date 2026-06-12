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

export function BigTable({
  data,
  name,
  expand,
  setModalHeading,
  setModalData,
}) {
  const [activeKey, setActiveKey] = useState(expand ? "0" : null);
  const columnData = data?.length > 0 ? data?.[0] : {};

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

  return (
    <div className="bg-white rounded-lg px-3 py-2 self-start h-full">
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
                <h6 className="font-bold mb-0 text-primary">{name}</h6>
              </Accordion.Toggle>

              {/* Right side - View All button (only visible when accordion is open) */}
              {activeKey === "0" &&
                (data?.length > 0 ? (
                  <label
                    className="text-black cursor-pointer font-medium underline text-xs hover:text-tprimary mb-0"
                    onClick={() => {
                      setModalData(data);
                      setModalHeading(name);
                    }}
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
                  data?.length > 0
                    ? "max-h-64 overflow-auto scrollbar-fancy"
                    : `max-h-6 overflow-auto scrollbar-fancy`
                }
              >
                {data?.length > 0 ? (
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    bordered={false}
                    classes="big-table table-head-custom table-vertical-center overflow-hidden table-hover"
                    bootstrap4
                    keyField="id"
                    data={data?.length > 0 ? data : []}
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
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
