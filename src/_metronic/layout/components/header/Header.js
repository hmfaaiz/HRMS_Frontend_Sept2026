import React, { useMemo, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { Menu, Minus, Search, SquareArrowOutUpRight } from "lucide-react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

export function Header({ toggleMenuVisibility, company, isEmployeePortal, isCollapsed }) {
  const uiService = useHtmlClassService();
  // const history = useHistory();
  const [value, setValue] = useState("");

  const user = useSelector((state) => state?.auth?.user);
  const layoutProps = useMemo(() => {
    return {
      headerClasses: uiService.getClasses("header", true),
      headerAttributes: uiService.getAttributes("header"),
      headerContainerClasses: uiService.getClasses("header_container", true),
      headerStickyLogo: uiService.getStickyLogo(),
      menuHeaderDisplay: objectPath.get(
        uiService.config,
        "header.menu.self.display",
      ),
    };
  }, [uiService]);

  const isAIChatbotPage = window.location.pathname.includes("/ask/ai-chatbot");

  const handleSearch = () => {
    if (value.trim()) {
      window.open(
        `/ask/ai-chatbot/new?question=${btoa(value)}`,
        "_blank",
        "noreferrer",
      );
      // history.push(`/ask/ai-chatbot/new?question=${btoa(value)}`);
      setValue("");
    }
  };

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
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="flex items-center gap-2">
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
                className="w-10 h-10 flex-shrink-0"
                src={layoutProps.headerStickyLogo}
              />
            </div>
            {!isCollapsed && (
              <div className="text-white text-base font-bold truncate max-w-[140px]">
                {company?.name || ""}
              </div>
            )}
          </div>
        </div>
        {/*end::Logo Section*/}
        {/* Removed AI Assistant and Topbar from here to move to the bottom of the sidebar */}
      </div>
      {/*end::Container*/}
      {/* </div> */}
      {/*end::Header*/}
    </>
  );
}
