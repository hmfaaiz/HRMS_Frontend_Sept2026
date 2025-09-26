// import React from "react";
// import { Modal } from "react-bootstrap";
// import BootstrapTable from "react-bootstrap-table-next";
// import {
//   NoRecordsFoundMessage,
//   PleaseWaitMessage,
//   toAbsoluteUrl,
// } from "../../../../../../../_metronic/_helpers";
// import { format } from "date-fns";
// import { Eye } from "lucide-react";
// import { Link } from "react-router-dom";

// const StatsCardModal = ({ onHide, show, data, heading }) => {
//   const columnData = data?.result?.length > 0 ? data?.result[0] : {};
//   const action = data?.action;
//   let columns = Object.keys(columnData)
//     ?.filter((k) => k !== "Id")
//     ?.map((key) => {
//       if (key === "profile_image") {
//         return {
//           dataField: "profile_image",
//           text: "Picture",

//           formatter: (cell) => {
//             return (
//               <img
//                 name="profile_image"
//                 src={
//                   cell
//                     ? `${cell}`
//                     : toAbsoluteUrl("/media/users/profileImage.png")
//                 } // Fallback if no image
//                 alt="Profile"
//                 width={16}
//                 height={16}
//                 className="object-cover rounded-sm"
//                 onError={(e) => {
//                   e.target.onerror = null; // Error loop rokne ke liye
//                   e.target.src = toAbsoluteUrl("/media/users/profileImage.png"); // Agar image load na ho toh fallback image set karo
//                 }}
//               />
//             );
//           },
//         };
//       } else {
//         let value = columnData[key];
//         let isDate =
//           typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
//         let employee_code = key === "Employee_Code";
//         let isAmount = typeof value === "number" || !isNaN(Number(value));
//         return {
//           dataField: key,
//           text: key.split("_").join(" "),

//           formatter: (cell) => {
//             // For date formatting
//             if (isDate && typeof cell === "string") {
//               return (
//                 <div>{cell ? format(new Date(cell), "dd-MMM-yyyy") : ""}</div>
//               );
//             }

//             // For amount formatting
//             if (isAmount) {
//               return (
//                 <div>
//                   {cell || "0"}
//                   {/* {Number(cell).toLocaleString("en-US", {
//                       minimumFractionDigits: 1,
//                       maximumFractionDigits: 1,
//                     })} */}
//                 </div>
//               );
//             }

//             // For all other text fields
//             return <div>{cell || ""}</div>;
//           },
//         };
//       }
//     });

//   if (action?.isLink) {
//     columns = [
//       ...columns,
//       {
//         dataField: "Id",
//         text: "Action",
//         sort: false,
//         style: {
//           minWidth: "50px",
//         },
//         formatter: (cell) => {
//           return (
//             <Link to={action?.url?.replace(":Id", cell)}>
//               <Eye className="w-4 h-4 text-black cursor-pointer" />
//             </Link>
//           );
//         },
//       },
//     ];
//   }
//   return (
//     <Modal
//       size="lg"
//       show={show}
//       onHide={onHide}
//       aria-labelledby="example-modal-sizes-title-lg"
//     >
//       <div className="bg-white rounded-lg px-3 py-2 col-span-2">
//         <h6 className="font-bold mb-0 text-primary">{heading}</h6>
//         <div className="max-h-[65vh] overflow-auto scrollbar-fancy">
//           {data?.result?.length > 0 ? (
//             <BootstrapTable
//               wrapperClasses="table-responsive"
//               bordered={false}
//               classes="big-table table-head-custom table-vertical-center overflow-hidden table-hover"
//               bootstrap4
//               keyField="id"
//               data={data?.result?.length > 0 ? data?.result : []}
//               columns={columns}
//               //   pagination={
//               //     data?.length > 5
//               //       ? paginationFactory({
//               //           sizePerPage: 5,
//               //           hideSizePerPage: true,
//               //           showTotal: true,
//               //         })
//               //       : undefined
//               //   }
//             >
//               <PleaseWaitMessage entities={data?.result || []} />
//               <NoRecordsFoundMessage entities={data?.result || []} />
//             </BootstrapTable>
//           ) : (
//             <label className="text-center">No Record Available</label>
//           )}
//         </div>
//       </div>
//       <Modal.Footer>
//         <button type="button" onClick={onHide} className="btn btn-light">
//           Close
//         </button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default StatsCardModal;

import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../../_metronic/_helpers";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const DEFAULT_IMAGE = toAbsoluteUrl("/media/users/profileImage.png");

const formatCell = (cell, key, sampleValue) => {
  // Date check
  const isDate =
    typeof sampleValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sampleValue);
  if (isDate && typeof cell === "string") {
    return <div>{cell ? format(new Date(cell), "dd-MMM-yyyy") : ""}</div>;
  }

  // Number check
  const isNumeric =
    typeof sampleValue === "number" || !isNaN(Number(sampleValue));
  if (isNumeric) {
    return <div>{cell || "0"}</div>;
  }

  // Fallback: plain text
  return <div>{cell || ""}</div>;
};

const generateColumns = (sampleRow, action , onHide) => {
  if (!sampleRow) return [];

  let columns = Object.keys(sampleRow)
    .filter((k) => k !== "Id")
    .map((key) => {
      if (key === "profile_image") {
        return {
          dataField: key,
          text: "Picture",
          formatter: (cell) => (
            <img
              src={cell || DEFAULT_IMAGE}
              alt="Profile"
              width={16}
              height={16}
              className="object-cover rounded-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          ),
        };
      }

      return {
        dataField: key,
        text: key.replace(/_/g, " "),
        formatter: (cell) => formatCell(cell, key, sampleRow[key]),
      };
    });

  if (action?.isLink) {
    columns.push({
      dataField: "Id",
      text: "Action",
      sort: false,
      style: { minWidth: "50px" },
      formatter: (cell) => (
        <Link target={"_blank"} onClick={onHide} to={action.url?.replace(":Id", cell)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </Link>
      ),
    });
  }

  return columns;
};

const StatsCardModal = ({ onHide, show, data, heading }) => {
  const sampleRow = data?.result?.[0];
  const columns = useMemo(() => generateColumns(sampleRow, data?.action , onHide), [
    sampleRow,
    data?.action,
  ]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="bg-white rounded-lg px-3 py-2 col-span-2">
        <h6 className="font-bold mb-0 text-primary">{heading}</h6>

        <div className="max-h-[65vh] overflow-auto scrollbar-fancy">
          {data?.result?.length > 0 ? (
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="big-table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              keyField="Id"
              data={data.result}
              columns={columns}
            >
              <PleaseWaitMessage entities={data?.result || []} />
              <NoRecordsFoundMessage entities={data?.result || []} />
            </BootstrapTable>
          ) : (
            <label className="text-center block">No Record Available</label>
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

export default StatsCardModal;
