import React from "react";

// Helper to pick a label for any row
const getRowLabel = (row) =>
  row.projectName ||
  row.employeeName ||
  row.ticketName ||
  row.ticketTypeName ||
  row.name ||
  "N/A";

// Helper to wrap text after 60 characters
const wrapText = (text, limit = 60) => {
  if (!text) return "";

  const words = String(text).split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (testLine.length > limit) {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </React.Fragment>
  ));
};

// Helper component to render rows recursively
const PivotRow = ({ row, dateColumns, level = 0 }) => {
  const indent = {
    paddingLeft: `${level * 20}px`,
  };

  const rowLabel = getRowLabel(row);

  return (
    <>
      <tr
        style={{
          fontWeight: row.isTotal ? "bold" : "normal",
          backgroundColor: row.isTotal ? "#4F81BD" : "transparent",
          color: row.isTotal ? "white" : "inherit",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Name */}
        <td
          style={{
            ...indent,
            width: "300px",
            maxWidth: "300px",
            minWidth: "300px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "normal",
            verticalAlign: "top",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          {wrapText(rowLabel, 200)}
        </td>

        {/* Logged */}
        <td
          style={{
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {row.logged
            ? Number(row.logged).toFixed(2)
            : ""}
        </td>

        {/* Date columns */}
        {dateColumns.map((d) => (
          <td
            key={d.key}
            style={{
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {row.dates?.[d.key] != null
              ? Number(row.dates[d.key]).toFixed(2)
              : row[d.key] != null
              ? Number(row[d.key]).toFixed(2)
              : ""}
          </td>
        ))}
      </tr>

      {/* Recursively render nested rows */}
      {row.employees &&
        Object.values(row.employees).map((emp) => (
          <PivotRow
            key={emp.employeeName || emp.name}
            row={emp}
            dateColumns={dateColumns}
            level={level + 1}
          />
        ))}

      {row.projects &&
        Object.values(row.projects).map((proj) => (
          <PivotRow
            key={proj.projectName || proj.name}
            row={proj}
            dateColumns={dateColumns}
            level={level + 1}
          />
        ))}

      {row.tickets &&
        Object.values(row.tickets).map((ticket) => (
          <PivotRow
            key={ticket.ticketName || ticket.name}
            row={ticket}
            dateColumns={dateColumns}
            level={level + 1}
          />
        ))}

      {row.ticketTypes &&
        Object.values(row.ticketTypes).map((type) => (
          <PivotRow
            key={type.ticketTypeName || type.name}
            row={type}
            dateColumns={dateColumns}
            level={level + 1}
          />
        ))}
    </>
  );
};

function FormPreview({ data }) {
  if (!data || !data.data) return <div></div>;

  const { data: pivotData, totals, dateColumns } = data;

  return (
    <div
      className="
        w-full
        overflow-x-auto
        block
        border
        border-gray-300
        whitespace-nowrap
        relative
        custom-scrollbar
      "
    >
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4F81BD;
            border-radius: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #4F81BD;
          }
        `}
      </style>

      <table
        className="border-collapse table-auto"
        style={{
          minWidth: `${(dateColumns.length + 2) * 80}px`,
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#4F81BD",
              color: "white",
            }}
          >
            <th
              style={{
                padding: "4px",
                textAlign: "left",
                width: "300px",
                minWidth: "300px",
                maxWidth: "300px",
                whiteSpace: "normal",
              }}
            >
              Name
            </th>

            <th
              style={{
                padding: "4px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Logged
            </th>

            {dateColumns.map((d) => (
              <th
                key={d.key}
                style={{
                  padding: "4px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {d.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.values(pivotData).map((row) => (
            <PivotRow
              key={getRowLabel(row)}
              row={row}
              dateColumns={dateColumns}
            />
          ))}

          {/* Total row */}
          <PivotRow
            row={totals}
            dateColumns={dateColumns}
          />
        </tbody>
      </table>
    </div>
  );
}

export default FormPreview;