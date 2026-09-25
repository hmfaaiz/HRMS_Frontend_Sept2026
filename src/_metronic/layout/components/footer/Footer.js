import React, {useMemo} from "react";
import {useHtmlClassService} from "../../_core/MetronicLayout";

export function Footer() {
  const today = new Date().getFullYear();
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      footerClasses: uiService.getClasses("footer", true),
      footerContainerClasses: uiService.getClasses("footer_container", true)
    };
  }, [uiService]);

  return (
    <div
      className={`footer bg-[#f5f5f5] py-2 d-flex z-10 flex-lg-column`}
      id="kt_footer"
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0}}
    >
      <div
        className={`${layoutProps.footerContainerClasses} d-flex flex-column flex-md-row align-items-center justify-content-end`}
      >
        <div className="text-gray-500 text-sm ml-auto">
          <span className="font-weight-bold">{today.toString()}</span> &copy;{" "}
          <a
            href="https://dynasoftcloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-hover-primary"
          >
            HRMS By Dynasoft Cloud
          </a>
        </div>
        {/* <div className="nav nav-dark order-1 order-md-2">
          <a
            href="https://edhi.org/about-us/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pr-3 pl-0"
          >
            About
          </a>
          <a
            href="https://edhi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link px-3"
          >
            Team
          </a>
          <a
            href="https://edhi.org/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pl-3 pr-0"
          >
            Contact
          </a>
        </div> */}
      </div>
    </div>
  );
}
