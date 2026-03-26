import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const ResignationRequest = ({ isDisabled }) => {
  const { Resignation } = useSelector(
    (state) => ({
      Resignation: state?.auth?.userAccess["Resignation"],
    }),
    shallowEqual
  );

  const isAccessForResignationRequest = Resignation?.find(
    (el) => el?.componentName === "ReadAllResignation"
  );

  return (
    <>
    <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
      <h6 className="font-bold mb-0 text-primary my-2">Resignation Form</h6>
      {isAccessForResignationRequest?.isResourceShow ? (
        <div className="font-size-xs text-black font-bold">
          <p className={`m-0 underline ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              isDisabled
                ? "Ask HR to allow resignation submission"
                : ""
            }
          >
            <a
              href={
                isDisabled
                  ? undefined
                  : "/employee_resignation/read-all-resignation"
              }
              onClick={(e) => {
                if (isDisabled) e.preventDefault();
              }}
              className={isDisabled ? "pointer-events-none" : ""}
            >
              Request Resignation
            </a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0">Request Resignation</p>
      )}
    </div>
    </>
  );
};
