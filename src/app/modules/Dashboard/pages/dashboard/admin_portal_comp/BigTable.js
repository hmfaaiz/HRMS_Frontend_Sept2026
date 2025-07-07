import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { format } from "date-fns";

export function BigTable({ data }) {
  const columnData = data?.data?.length > 0 ? data?.data[0] : {};

  let columns = Object.keys(columnData).map((key) => {
    if (key === "profile_image") {
      return {
        dataField: "profile_image",
        text: "Picture",
        style: { textAlign: "left", minWidth: `25px`, maxWidth: `25px` },
        headerStyle: {
          textAlign: "left",
          backgroundColor: "#0093dd",
          color: "#fff",
          fontSize: "14px",
        },
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
              width={26}
              height={26}
              style={{
                borderRadius: "50%", // Make the image circular
                objectFit: "cover", // Ensure the image covers the entire area without distortion
              }}
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
        style: {
          textAlign:
            isDate || employee_code ? "center" : isAmount ? "right" : "left",
          minWidth: `${key.length > 7 ? key.length - 7 : 7}0px`,
          // maxWidth: `${key.length > 7 ? key.length - 7 : 7}0px`,
        },
        headerStyle: {
          textAlign:
            isDate || employee_code ? "center" : isAmount ? "right" : "left",
          backgroundColor: "#0093dd",
          color: "#fff",
          fontSize: "14px",
        },
        formatter: (cell) => {
          // For date formatting
          if (isDate && typeof cell === "string") {
            return <div>{format(new Date(cell), "dd-MMM-yyyy")}</div>;
          }

          // For amount formatting
          if (isAmount) {
            return (
              <div>
                {Number(cell).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            );
          }

          // For all other text fields
          return <div>{cell}</div>;
        },
      };
    }
  });

  return (
    <Accordion
      className="my-3"
      defaultActiveKey={data?.accordian_open ? "0" : ""}
    >
      <Card className="dashboard_card">
        <Accordion.Toggle
          as={Button}
          variant="link"
          eventKey="0"
          style={{
            backgroundColor: "#fafafc",
          }}
          className="text-primary font-weight-bold text-decoration-none d-flex justify-content-between align-items-center"
        >
          <span
            className=""
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
            }}
          >
            {data?.dashlet_name}
          </span>
          <span
            style={{
              borderRadius: "50%",
              backgroundColor: "#0093dd",
              color: "#fff",
            }}
          >
            <KeyboardArrowDown style={{ fontSize: "25px" }} />
          </span>
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <div
            style={{
              width: "100%",
              overflow: "auto",
              height: "385px",
              fontSize: "13px",
              marginTop: "14px",
            }}
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
              <div
                style={{ color: "gray", fontSize: "13px", textAlign: "center" }}
              >
                No data available
              </div>
            )}
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
