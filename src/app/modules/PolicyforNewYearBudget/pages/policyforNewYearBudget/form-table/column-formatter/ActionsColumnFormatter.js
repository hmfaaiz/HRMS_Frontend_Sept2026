import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, MailPlus, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
  isAccessForRead,
  
  }
) {
  const isUserRead = false;

  const recordIsEditable = () => {
    if (new Date(row?.from_date) >= new Date(row?.activePayrollMonth?.startDate)) {
      return true;
    }
    return false;
  };

  return (
    <div className="space-x-2">
      {isAccessForRead  && (
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
      >
        <a
          title=""
          className=""
          onClick={() => openReadFormDialog(row.Id, isUserRead)}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      )}
      {isAccessForEdit  && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a title="" className="" onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
             Delete
            </Tooltip>
          }
        >
 
            <a
              title=""
              className=""
              onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
            >
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
        
        
        </OverlayTrigger>
      )}
    </div>
  );
}
