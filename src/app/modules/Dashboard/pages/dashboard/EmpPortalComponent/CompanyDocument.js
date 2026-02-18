import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const CompanyDocument = () => {
  const { company_doc_portal ,auth} = useSelector(
    (state) => ({
      company_doc_portal: state?.auth?.userAccess.company_doc_portal,
      auth:state?.auth?.userAccess
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">
          Documents
        </h6>

        {company_doc_portal?.length > 0 ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <Link
                to={"/company_doc_portal/read-all-company-doc-portal"}
              >
                Company / My Documents{" "}
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">No Document</p>
        )}
      </div>
    </>
  );
};
