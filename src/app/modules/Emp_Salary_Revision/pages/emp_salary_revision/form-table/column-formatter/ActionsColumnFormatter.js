import React from "react";
import SVG from "react-inlinesvg";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { fetchPreviousEmpSalaryById, updateUserAccess } from "../../../../_redux/redux-Actions";
import { CirclePower, Eye, Pencil, Trash2 } from "lucide-react";

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
    setIds,
    setIsFileReq,
    isForDelete,
    dispatch,
  }
) {
  const isUserRead = false;

  // const dispatch = useDispatch();


  return (
    <div className="space-x-2">
      {" "}
      {row.isForRead && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a
            onClick={() => {
              setIds(row.Id);
              dispatch(updateUserAccess("read"));
              dispatch(fetchPreviousEmpSalaryById(row.Id));
            }}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {row.isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            onClick={() => {
              setIds(row.Id);
               dispatch(updateUserAccess("edit"))
               dispatch(fetchPreviousEmpSalaryById(row.Id));
            }}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {row.isForDelete && !row?.appraisalId && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ?  (
            <a onClick={() => openDeleteFormDialog(row.Id, row.isActive)}>
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <a
              onClick={() => openActiveFormDialog(row.Id, row.isActive)}
            >
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
