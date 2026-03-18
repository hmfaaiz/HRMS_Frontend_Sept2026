import React from "react";
import { Accordion, Card, Row, Col } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { formatNumberWithCommas, formatDates } from "../../../../../utils/common";

export function LoanDetail({ loanTypeId, loanPanelMode }) {
  const { loanOutstanding, actionsLoading, loanTypeList } = useSelector(
    (state) => ({
      loanOutstanding: state.cash_payment_against_loan?.loanOutstanding ?? null,
      actionsLoading:  state.cash_payment_against_loan?.actionsLoading  ?? false,
      loanTypeList:    state.employee_loan_request?.loan_type           || [],
    }),
    shallowEqual
  );

  if (!loanPanelMode || !loanTypeId) return null;

  const loanTypeName =
    loanTypeList.find((lt) => lt.value === Number(loanTypeId))?.label || "—";

  const Field = ({ label, value, highlight }) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <span
        className="text-sm mb-1 d-block"
        style={highlight ? { color: "#c0392b", fontWeight: 700 } : {}}
      >
        <span className="font-medium">{label} </span>
        <span>{value}</span>
      </span>
    );
  };

  if (actionsLoading)
    return (
      <div className="d-flex align-items-center" style={{ gap: 8 }}>
        <span className="spinner spinner-primary spinner-sm" />
        <span className="text-muted text-sm">Loading loan details...</span>
      </div>
    );

  if (!loanOutstanding)
    return (
      <p className="text-warning font-weight-bold mb-0">
        ⚠ No active loan request found for <strong>{loanTypeName}</strong>.
      </p>
    );

  // ── Prepare fields
  const fields = [
    { label: "Applied Date:", value: loanOutstanding.applied_date ? formatDates(loanOutstanding.applied_date) : "—" },
    { label: "Total Loan Amount:", value: formatNumberWithCommas(Number(loanOutstanding.total_loan_amount ?? 0)) },
    { label: "Loan Amount Paid:", value: formatNumberWithCommas(Number(loanOutstanding.loan_amount_paid ?? 0)) },
    { label: "Installment Start Date:", value: loanOutstanding.installment_start_date ? formatDates(loanOutstanding.installment_start_date) : "—" },
    { label: "Monthly Installment:", value: formatNumberWithCommas(Number(loanOutstanding.monthly_installment ?? 0)) },
    { label: "Loan Amount Outstanding:", value: formatNumberWithCommas(Number(loanOutstanding.loanOutstanding ?? 0)), highlight: Number(loanOutstanding.loanOutstanding ?? 0) > 0 },
    { label: "Total Installments:", value: loanOutstanding.total_installment ?? "—" },
  ];

  // ── Chunk into 4 per row
  const chunkedFields = [];
  for (let i = 0; i < fields.length; i += 4) {
    chunkedFields.push(fields.slice(i, i + 4));
  }

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="bg-tsecondary p-2">
            <h6 className="font-bold mb-2 text-primary">Loan Detail</h6>

            {chunkedFields.map((rowFields, rowIndex) => (
              <Row key={rowIndex} className="mb-1">
                {rowFields.map((field, colIndex) => (
                  <Col md={3} key={colIndex}>
                    <Field {...field} />
                  </Col>
                ))}
              </Row>
            ))}

            {loanOutstanding.reason && (
              <Row className="mt-2">
                <Col md={12}>
                  <span className="text-sm d-block">
                    <span className="font-medium">Reason: </span>
                    <span>{loanOutstanding.reason}</span>
                  </span>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}