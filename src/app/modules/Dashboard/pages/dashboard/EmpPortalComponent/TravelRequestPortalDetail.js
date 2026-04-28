import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";

export function TravelRequestPortalDetail() {
  const UserAccess = useSelector(
    (state) => state?.auth?.userAccess,
    shallowEqual,
  );

  const isTravelRequest = useMemo(() => {
    if (!UserAccess) return null;
    // Broadest possible search for any resource matching Travel Request
    return Object.values(UserAccess)
      .flat()
      .find(
        (el) =>
          (el?.componentName === "ReadAllTravelRequest" ||
            el?.slug === "read-all-travel-request" ||
            el?.name === "Travel Request") &&
          (el?.portalType == 2 || el?.portalType == "2"),
      );
  }, [UserAccess]);

  const isTravelApproval = useMemo(() => {
    if (!UserAccess) return null;
    return Object.values(UserAccess)
      .flat()
      .find(
        (el) =>
          (el?.componentName === "ReadTravelRequestApproval" ||
            el?.slug === "read-all-travel-request-approval" ||
            el?.name === "Travel Request Approval") &&
          (el?.portalType == 2 || el?.portalType == "2"),
      );
  }, [UserAccess]);
  return (
    <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
      <h6 className="font-bold mb-0 text-primary my-2">Travel</h6>
      {isTravelRequest ? (
        <div className="font-size-xs text-black font-bold">
          <p className="m-0 underline">
            <a href="/travel_request/read-all-travel-request">Travel Request</a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0"> Request</p>
      )}
      {/* {isTravelApproval ? (
        <div className="font-size-xs text-black font-bold">
          <p className="m-0 underline">
            <a href="/travel_request_approval/read-all-travel-request-approval">
              Travel Approval
            </a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0">Travel Approval</p>
      )} */}
    </div>
  );
}
