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

export function BigTable({ data }) {
  const columnData = data?.data?.length > 0 ? data?.data[0] : {};

  let columns = Object.keys(columnData).map((key) => {
    if (key === "profile_image") {
      return {
        dataField: "profile_image",
        text: "Profile Image",
        style: { textAlign: "center", minWidth: `${key.length}0px` },
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0093dd",
          color: "#fff",
          fontSize: "13px",
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
              width={40}
              height={40}
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
      return {
        dataField: key,
        text: key.split("_").join(" "),
        style: {
          textAlign: "center",
          minWidth: `${key.length > 9 ? key.length : 9}0px`,
        },
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0093dd",
          color: "#fff",
          fontSize: "13px",
        },
      };
    }
  });

  return (
    <Accordion
      className="my-3"
      defaultActiveKey={data?.accordian_open ? "0" : ""}
    >
      <Card>
        <Accordion.Toggle
          as={Button}
          variant="link"
          eventKey="0"
          className="text-primary font-weight-bold text-decoration-none d-flex justify-content-between align-items-center"
        >
          <span className="">{data?.dashlet_name}</span>
          <KeyboardArrowDown />
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <div
            style={{
              width: "100%",
              overflow: "auto",
              height: "415px",
              fontSize: "10px",
            }}
          >
            {data?.data.length > 0 ? (
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                keyField="id"
                data={data?.data?.length > 0 ? data?.data : []}
                columns={columns}
                rowClasses={(row, rowIndex) =>
                  rowIndex % 2 === 0 ? "table-row-even" : "table-row-odd"
                }
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
