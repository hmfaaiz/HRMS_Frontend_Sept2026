import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditTicketEscalationPolicyDialog,
    openDeleteTicketEscalationPolicyDialog,
    openReadTicketEscalationPolicyDialog,
    isAccessForEdit,
    isAccessForDelete,
  }
) {
  return (
    <div className="space-x-2">
      {/* VIEW */}
      <OverlayTrigger overlay={<Tooltip id="tep-view-tooltip">View</Tooltip>}>
        <a onClick={() => openReadTicketEscalationPolicyDialog(row.Id)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* EDIT */}
      {isAccessForEdit && (
        <OverlayTrigger overlay={<Tooltip id="tep-edit-tooltip">Edit</Tooltip>}>
          <a onClick={() => openEditTicketEscalationPolicyDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* DELETE */}
      {isAccessForDelete && (
        <OverlayTrigger overlay={<Tooltip id="tep-delete-tooltip">Delete</Tooltip>}>
          <a onClick={() => openDeleteTicketEscalationPolicyDialog(row.Id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}