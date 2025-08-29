import React from "react"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers"
import { OverlayTrigger, Tooltip } from "react-bootstrap"

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditCenterDialog,
    openDeleteCenterDialog,
    openReadCenterDialog,
    isAccessForEdit,
    isAccessForDelete,
  }
) {
  const isUserRead = false
  // const { userAccess } = useSelector(
  //   (state) => ({
  //     userAccess: state.auth.userAccess.Users,
  //   }),
  //   shallowEqual
  // )

  // // const isAccessForEdit = userAccess.find(
  // //   (item) => item.componentName === "UpdateUser"
  // // )
  // console.log("userAccess", userAccess)
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Read Sub Center</Tooltip>}
      >
        <a
          title="Read User"
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          onClick={() => openReadCenterDialog(row.id, isUserRead)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>
      {isAccessForEdit && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit Sub Center</Tooltip>}
        >
          <a
            title="Edit customer"
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            onClick={() => openEditCenterDialog(row.id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

      <> </>
      {/* {isAccessForDelete && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete Center</Tooltip>}
        >
          <a
            title="Delete customer"
            className="btn btn-icon btn-light btn-hover-danger btn-sm"
            onClick={() => openDeleteCenterDialog(row.id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )} */}
    </>
  )
}
