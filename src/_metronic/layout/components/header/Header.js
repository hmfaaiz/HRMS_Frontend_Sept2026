import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { HeaderMenuWrapper } from "./header-menu/HeaderMenuWrapper";
import { AnimateLoading } from "../../../_partials/controls";
import { Menu } from "lucide-react";

export function Header({ toggleMenuVisibility, company, isEmployeePortal }) {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      headerClasses: uiService.getClasses("header", true),
      headerAttributes: uiService.getAttributes("header"),
      headerContainerClasses: uiService.getClasses("header_container", true),
      headerStickyLogo: uiService.getStickyLogo(),
      menuHeaderDisplay: objectPath.get(
        uiService.config,
        "header.menu.self.display"
      ),
    };
  }, [uiService]);

  return (
    <>
      {/*begin::Header*/}
      {/* <div
        className={`header ${layoutProps.headerClasses}`}
        id="kt_header"
        {...layoutProps.headerAttributes}
      > */}
      {/*begin::Container*/}
      <div
        className={`${layoutProps.headerContainerClasses} flex items-center justify-between py-1`}
      >
        {/*begin::Logo Section*/}
        <Link to="/dashboard" className="flex items-center">
          {isEmployeePortal === "1" && (
            <button
              className="xl:hidden p-1 rounded bg-transparent border-none"
              onClick={toggleMenuVisibility}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 mr-2 text-white " />
            </button>
          )}
          <div className="flex items-center">
            <img
              alt="logo"
              className="w-12 h-12"
              src={layoutProps.headerStickyLogo}
            />
          </div>
          <div className="text-white text-xl ml-2 font-bold">
            {company?.name || ""}
          </div>
        </Link>
        {/*end::Logo Section*/}

        {/*begin::Header Content Section*/}
        <div className="">
          {/* <AnimateLoading /> */}
          {/*begin::Header Menu Wrapper*/}
          {/* {layoutProps.menuHeaderDisplay && <HeaderMenuWrapper />} */}
          {!layoutProps.menuHeaderDisplay && <div />}
          {/*end::Header Menu Wrapper*/}

          {/*begin::Topbar*/}
          <Topbar />
          {/*end::Topbar*/}
        </div>
        {/*end::Header Content Section*/}
      </div>
      {/*end::Container*/}
      {/* </div> */}
      {/*end::Header*/}
    </>
  );
}
