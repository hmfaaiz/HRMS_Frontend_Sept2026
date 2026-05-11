import React, { useMemo, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { Menu, Search, SquareArrowOutUpRight } from "lucide-react";
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
        {user?.allowAIChatbot ? (
          <div className="flex gap-2 items-center">
            <div className="min-w-full md:min-w-[36rem] relative">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Ask me anything..."
                className="w-full bg-white border-none text-sm text-black placeholder:text-xs placeholder-gray-700 focus:outline-none p-2 pr-10 rounded-sm resize-none"
              />

              {/* Search Icon - Right Side par fixed */}
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2  border-none bg-transparent transition-colors"
              >
                <Search size={18} className="text-black w-5 h-5" />
              </button>
            </div>
            <SquareArrowOutUpRight
              onClick={() => window.open("/ask/ai-chatbot/new", "_blank")}
              className="w-5 h-5 text-white cursor-pointer"
              strokeWidth={3}
            />
          </div>
        ) : null}
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
