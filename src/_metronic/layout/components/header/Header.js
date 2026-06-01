import React, { useMemo, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { Menu, Minus, Search, SquareArrowOutUpRight } from "lucide-react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

export function Header({ toggleMenuVisibility, company, isEmployeePortal }) {
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
                className="w-12 h-12"
                src={layoutProps.headerStickyLogo}
              />
            </div>
            <div className="text-white text-xl font-bold">
              {company?.name || ""}
            </div>
          </div>
        </div>
        {/*end::Logo Section*/}
        {/*begin::Header Content Section*/}
        <div className="flex gap-2">
          {user?.allowAIChatbot && !isAIChatbotPage  ? (
            <div className="flex gap-2 items-center">
              <button
                style={{ border: "1.5px solid #0093dd" }}
                onClick={() => window.open("/ask/ai-chatbot/new", "_blank")}
                className="text-tprimary bg-white rounded-3xl text-sm shadow-[0_0_10px_#FFFFFF] px-3 py-1.5"
              >
                AI Assistance{" "}
                <Minus
                  onClick={() => window.open("/ask/ai-chatbot/new", "_blank")}
                  className="w-4 h-4 rotate-90 text-tprimary cursor-pointer"
                />
                <SquareArrowOutUpRight className="w-3.5 h-3.5 text-tprimary cursor-pointer" />
              </button>
            </div>
          ) : null}
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
        </div>
        {/*end::Header Content Section*/}
      </div>
      {/*end::Container*/}
      {/* </div> */}
      {/*end::Header*/}
    </>
  );
}
