import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import objectPath from "object-path"
import SVG from "react-inlinesvg"
import { useHtmlClassService } from "../../_core/MetronicLayout"
import { toAbsoluteUrl } from "../../../_helpers"

export function Brand() {
  const uiService = useHtmlClassService()

  const layoutProps = useMemo(() => {
    return {
      brandClasses: uiService.getClasses("brand", true),
      asideSelfMinimizeToggle: objectPath.get(
        uiService.config,
        "aside.self.minimize.toggle"
      ),
      headerLogo: uiService.getLogo(),
      headerStickyLogo: uiService.getStickyLogo(),
    }
  }, [uiService])

  return (
    <>
      {/* begin::Brand */}
      <div
        className={`brand flex-column-auto ${layoutProps.brandClasses}`}
        id="kt_brand" 
        // style={{ position: "fixed", width: "100%",zIndex:"10" ,backgroundColor:"#0093DD"}}
      >
        {/* begin::Logo */}
        <Link to="/dashboard" className="brand-logo">
          <div style={{ float: "left" }}> <img alt="logo" width={55} height={50} src={layoutProps.headerLogo} /></div>
          <div style={{ float: "left", color: "white", fontSize: "22px", marginLeft: "5px", marginTop: "5px" }}>Dynasoft Cloud</div>
        </Link>
        {/* end::Logo */}

        {layoutProps.asideSelfMinimizeToggle && (
          <>
            {/* begin::Toggle */}
            {/* <button
              className="brand-toggle btn btn-sm px-0"
              id="kt_aside_toggle"
            >
              <span className="svg-icon svg-icon-xl">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Navigation/Angle-double-left.svg"
                  )}
                />
              </span>
            </button> */}
            {/* end::Toolbar */}
          </>
        )}
      </div>
      {/* end::Brand */}
    </>
  )
}
