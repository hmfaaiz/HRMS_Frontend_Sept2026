import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, LayoutList, Reply } from "lucide-react";

export function ActionsColumnFormatter(cellContent, row, rowIndex, { setReadMode, setReceiveMode, setMasterId, openDetailGridData }) {
  return (
    <div className="space-x-2">
      <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
        <a onClick={() => setReadMode(true)}>
          <Eye className="w-4 h-4 cursor-pointer" />
        </a>
      </OverlayTrigger>

      <OverlayTrigger overlay={<Tooltip>Detail</Tooltip>}>
        <button
          type="button"
          onClick={() => {
            setReadMode(false);
            setReceiveMode(false);
            setMasterId(row.masterId);
            openDetailGridData(row.masterId);
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <LayoutList className="w-4 h-4 cursor-pointer" />
        </button>
      </OverlayTrigger>
    </div>
  );
}

export function ResponseColumnFormatter(cellContent, row, rowIndex, { setReadMode, setReceiveMode, setMasterId, openDetailGridData }) {
  return (
    <div className="space-x-2">
      <OverlayTrigger overlay={<Tooltip>Response</Tooltip>}>
        <a onClick={() => setReceiveMode(true)}>
          <Reply className="w-4 h-4 cursor-pointer" />
        </a>
      </OverlayTrigger>

      <OverlayTrigger overlay={<Tooltip>Detail</Tooltip>}>
        <button
          type="button"
          onClick={() => {
            setReadMode(false);
            setReceiveMode(false);
            setMasterId(row.masterId);
            openDetailGridData(row.masterId);
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <LayoutList className="w-4 h-4 cursor-pointer" />
        </button>
      </OverlayTrigger>
    </div>
  );
}
