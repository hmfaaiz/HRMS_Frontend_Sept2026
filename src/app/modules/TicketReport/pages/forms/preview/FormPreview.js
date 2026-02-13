// import React from "react";

// // Helper component to render rows recursively
// const PivotRow = ({ row, dateColumns, level = 0 }) => {
//     const indent = { paddingLeft: `${level * 20}px` }; // Excel-like indentation

//     return (
//         <>
//             <tr style={{ fontWeight: row.isTotal ? "bold" : "normal", backgroundColor: row.isTotal ? "#4F81BD" : "transparent", color: row.isTotal ? "white" : "inherit" }}>
//                 <td style={indent}>{row.name || row.projectName || row.employeeName}</td>
//                 <td>{row.logged || 0}</td>
//                 {dateColumns.map((d) => (
//                     //   <td key={d.key}>{row.dates?.[d.key] ?? 0}</td>
//                     <td key={d.key}>
//                         {row.dates?.[d.key] ?? row[d.key] ?? 0}
//                     </td>

//                 ))}
//             </tr>

//             {/* Render nested levels */}
//             {row.employees && row.employees.map((emp) => (
//                 <PivotRow key={emp.name} row={emp} dateColumns={dateColumns} level={level + 1} />
//             ))}
//             {row.projects && row.projects.map((proj) => (
//                 <PivotRow key={proj.name} row={proj} dateColumns={dateColumns} level={level + 1} />
//             ))}
//             {row.tickets && row.tickets.map((ticket) => (
//                 <PivotRow key={ticket.name} row={ticket} dateColumns={dateColumns} level={level + 1} />
//             ))}
//             {row.ticketTypes && row.ticketTypes.map((type) => (
//                 <PivotRow key={type.name} row={type} dateColumns={dateColumns} level={level + 1} />
//             ))}
//         </>
//     );
// };

// function FormPreview({ data }) {
//     if (!data || !data.data) return <div>No data to display</div>;

//     const { data: pivotData, totals, dateColumns } = data;

//     return (
//         <div style={{ overflowX: "auto" }}>
//             <table style={{ borderCollapse: "collapse", width: "100%" }}>
//                 <thead>
//                     <tr style={{ backgroundColor: "#4F81BD", color: "white" }}>
//                         <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
//                         <th style={{ padding: "8px", textAlign: "center" }}>Logged</th>
//                         {dateColumns.map((d) => (
//                             <th key={d.key} style={{ padding: "8px", textAlign: "center" }}>{d.header}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {Object.values(pivotData).map((row) => (
//                         <PivotRow key={row.name || row.projectName || row.employeeName} row={row} dateColumns={dateColumns} />
//                     ))}

//                     {/* Total row */}
//                     <PivotRow row={totals} dateColumns={dateColumns} />
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default FormPreview;


import React from "react";

// Helper to pick a label for any row
const getRowLabel = (row) =>
  row.projectName ||
  row.employeeName ||
  row.ticketName ||
  row.ticketTypeName ||
  row.name ||
  "N/A";

// Helper component to render rows recursively
const PivotRow = ({ row, dateColumns, level = 0 }) => {
  const indent = { paddingLeft: `${level * 20}px` }; // Excel-like indentation

  return (
    <>
      <tr
        style={{
          fontWeight: row.isTotal ? "bold" : "normal",
          backgroundColor: row.isTotal ? "#4F81BD" : "transparent",
          color: row.isTotal ? "white" : "inherit",
        }}
      >
        <td style={indent}>{getRowLabel(row)}</td>
        <td>{row.logged || 0}</td>
        {dateColumns.map((d) => (
          <td key={d.key} style={{ textAlign: "center" }}>
            {row.dates?.[d.key] ?? row[d.key] ?? 0}
          </td>
        ))}
      </tr>

      {/* Recursively render nested rows */}
      {row.employees &&
        Object.values(row.employees).map((emp) => (
          <PivotRow key={emp.employeeName || emp.name} row={emp} dateColumns={dateColumns} level={level + 1} />
        ))}

      {row.projects &&
        Object.values(row.projects).map((proj) => (
          <PivotRow key={proj.projectName || proj.name} row={proj} dateColumns={dateColumns} level={level + 1} />
        ))}

      {row.tickets &&
        Object.values(row.tickets).map((ticket) => (
          <PivotRow key={ticket.ticketName || ticket.name} row={ticket} dateColumns={dateColumns} level={level + 1} />
        ))}

      {row.ticketTypes &&
        Object.values(row.ticketTypes).map((type) => (
          <PivotRow key={type.ticketTypeName || type.name} row={type} dateColumns={dateColumns} level={level + 1} />
        ))}
    </>
  );
};

function FormPreview({ data }) {
  if (!data || !data.data) return <div>No data to display</div>;

  const { data: pivotData, totals, dateColumns } = data;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#4F81BD", color: "white" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "8px", textAlign: "center" }}>Logged</th>
            {dateColumns.map((d) => (
              <th key={d.key} style={{ padding: "8px", textAlign: "center" }}>
                {d.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(pivotData).map((row) => (
            <PivotRow key={getRowLabel(row)} row={row} dateColumns={dateColumns} />
          ))}

          {/* Total row */}
          <PivotRow row={totals} dateColumns={dateColumns} />
        </tbody>
      </table>
    </div>
  );
}

export default FormPreview;

