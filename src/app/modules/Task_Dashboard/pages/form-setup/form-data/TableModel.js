import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";

const DEFAULT_IMAGE = toAbsoluteUrl("/media/users/profileImage.png");

const formatCell = (cell, key, sampleValue, columnColorRules = {}, row) => {
  // Apply custom style from rules
  let customStyle = {};
  if (columnColorRules[key]) {
    const ruleResult = columnColorRules[key](cell, row);
    if (typeof ruleResult === "string") {
      customStyle = { color: ruleResult };
    } else if (typeof ruleResult === "object") {
      customStyle = ruleResult;
    }
  }

  // Date check
  const isDate =
    typeof sampleValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sampleValue);
  if (isDate && typeof cell === "string") {
    return (
      <div style={customStyle}>
        {cell ? format(new Date(cell), "dd-MMM-yyyy") : ""}
      </div>
    );
  }

  // Number check
  const isNumeric =
    typeof sampleValue === "number" || !isNaN(Number(sampleValue));
  if (isNumeric) {
    return <div style={customStyle}>{cell || ""}</div>;
  }

  // Fallback: plain text
  return <div style={customStyle}>{cell || ""}</div>;
};

const generateColumns = (sampleRow, action, onHide, columnColorRules = {}) => {
  if (!sampleRow) return [];

  let columns = Object.keys(sampleRow)
    .filter((k) => k !== "Id" && k !== "subsidiaryId")
    .map((key) => {
      if (key === "profile_image") {
        return {
          dataField: key,
          text: "Picture",
          sort: false,
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
        sort: true,
        text: key.replace(/_/g, " "),
        formatter: (cell, row) =>
          formatCell(cell, key, sampleRow[key], columnColorRules, row),
      };
    });

  if (action?.isLink) {
    columns.push({
      dataField: "Id",
      text: "Action",
      sort: false,
      style: { minWidth: "50px" },
      formatter: (row, cell) => {
        let toLink = cell?.subsidiaryId
          ? `${action.url?.replace(":Id", row)}?subsidiary=${
              cell?.subsidiaryId
            }`
          : action.url?.replace(":Id", row);
        return (
          <Link target={"_blank"} onClick={onHide} to={toLink}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </Link>
        );
      },
    });
  }

  return columns;
};

const TableModel = ({ onHide, show, data, heading, columnColorRules = {} }) => {
  const sampleRow = data?.result?.[0];
  const columns = useMemo(
    () => generateColumns(sampleRow, data?.action, onHide, columnColorRules),
    [sampleRow, data?.action, onHide, columnColorRules],
  );

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

export default TableModel;
