import React from "react";
import { useSelector, shallowEqual } from "react-redux";

export function ReimbursementDetail({ entities }) {
  const { reimbursement_claim_request, reimbursement_claim_approval } = useSelector(
    (state) => ({
      reimbursement_claim_request:
        state?.auth?.userAccess["reimbursement_claim_request"],
      reimbursement_claim_approval:
        state?.auth?.userAccess["reimbursement_claim_approval"],
    }),
    shallowEqual,
  );

  const isReimbursementRequest = reimbursement_claim_request?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimRequest" &&
      el?.portalType == 2 &&
      el?.isResourceShow,
  );

  const isReimbursementApproval = reimbursement_claim_approval?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimApproval" &&
      el?.portalType == 2 &&
      el?.isResourceShow,
  );

  return (
    <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
      <h6 className="font-bold mb-0 text-primary my-2">Reimbursement</h6>
      {isReimbursementRequest ? (
        <div className="font-size-xs text-black font-bold">
          <p className="m-0 underline">
            <a href={"/reimbursement_claim_request/read-all-reimbursement-claim-request"}>
              Reimbursement Request
            </a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0">Reimbursement Request</p>
      )}
      {isReimbursementApproval ? (
        <div className="font-size-xs text-black font-bold">
          <p className="m-0 underline">
            <a href={"/reimbursement_claim_approval/read-all-reimbursement-claim-approval"}>
              Reimbursement Approval
            </a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0">Reimbursement Approval</p>
      )}
    </div>
  );
}