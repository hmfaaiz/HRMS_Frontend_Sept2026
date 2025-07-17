import React, { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

const SingleCard = ({ data }) => {
  return (
    <Accordion
      className={`my-3 ${data?.color_theme_class}`}
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
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              textAlign: "left",
            }}
          >
            {data?.days
              ? data?.dashlet_name?.replace("${days}", data?.days)
              : data?.dashlet_name}
          </span>
          <span>
            <KeyboardArrowDown
              style={{ fontSize: "25px", borderRadius: "50%" }}
            />
          </span>
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <div
            style={{
              maxHeight: "385px",
              minHeight: "385px",
              overflowY: "auto",
              padding: "10px 0px",
            }}
            className="pt-3"
          >
            {data?.data.length > 0 &&
              data?.data.map((person) => (
                <div
                  key={person?.Id}
                  className="d-flex align-items-center justify-content-between p-2"
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={person?.profile_image}
                      alt={person?.Employee_Name}
                      className="rounded-circle"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "12px",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {person?.Employee_Name}
                      </div>
                      <div style={{ fontSize: "13px" }}>
                        {person?.Designation}
                      </div>
                      <div style={{ fontSize: "12px", color: "#888" }}>
                        {person.departmentName}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                    }}
                  >
                    <span>{person?.main_value}</span>
                  </div>
                </div>
              ))}
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default function SmallTable({ data }) {
  return <SingleCard data={data} />;
}
