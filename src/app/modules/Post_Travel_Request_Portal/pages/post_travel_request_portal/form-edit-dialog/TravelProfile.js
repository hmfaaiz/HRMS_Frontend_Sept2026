import React, { useMemo } from "react";
import { Modal, Accordion, Card } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
} from "../../../../../../_metronic/_helpers";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";

export default function TravelProfile({
  employeeId,
  travelRequestId,
  show,
  onHide,
}) {
  const dispatch = useDispatch();
  const { approvedEmployeeList, dashboard } = useSelector(
    (state) => ({
      approvedEmployeeList:
        state.post_travel_request_portal?.approvedEmployeeList ||
        state.post_approval_travel_request?.approvedEmployeeList,
      dashboard: state.dashboard,
    }),
    shallowEqual,
  );

  React.useEffect(() => {
    if (show) {
      if (!dashboard?.allTravelLocationList?.length) {
        dispatch(fetchAllFormsMenu(555, "allTravelLocationList"));
      }
      if (!dashboard?.allTransportModeList?.length) {
        dispatch(fetchAllFormsMenu(551, "allTransportModeList"));
      }
      if (!dashboard?.allHotelEntitlementList?.length) {
        dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList"));
      }
      if (!dashboard?.allClassOfTravelList?.length) {
        dispatch(fetchAllFormsMenu(554, "allClassOfTravelList"));
      }
    }
  }, [show, dispatch, dashboard]);

  const travelData = useMemo(() => {
    if (!employeeId || !travelRequestId) return null;
    const emp = approvedEmployeeList?.find((e) => e.Id === employeeId);
    const item = emp?.list?.find((t) => t.Id === travelRequestId);
    return item?._fullRecord || item;
  }, [employeeId, travelRequestId, approvedEmployeeList]);

  const firstSeg = travelData?.Master?.[0];
  const lastSeg = travelData?.Master?.[travelData?.Master?.length - 1];

  const travelDays = useMemo(() => {
    if (!firstSeg?.fromDate || !lastSeg?.toDate) return "—";
    try {
      const from = new Date(firstSeg.fromDate);
      const to = new Date(lastSeg.toDate);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return "—";
      return Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return "—";
    }
  }, [firstSeg, lastSeg]);

  const formatDate = (val) => {
    try {
      return val ? format(new Date(val), "dd-MMM-yyyy") : "—";
    } catch {
      return "—";
    }
  };

  const getLabel = (list, id) =>
    list?.find((l) => String(l.value) === String(id))?.label || "—";

  // Master segments table columns
  const segmentColumns = [
    {
      dataField: "fromLocationId",
      text: "From Location",
      style: { minWidth: "130px" },
      formatter: (cell) => getLabel(dashboard?.allTravelLocationList, cell),
    },
    {
      dataField: "toLocationId",
      text: "To Location",
      style: { minWidth: "130px" },
      formatter: (cell) => getLabel(dashboard?.allTravelLocationList, cell),
    },
    {
      dataField: "fromDate",
      text: "From Date",
      style: { minWidth: "110px" },
      formatter: (cell) => formatDate(cell),
    },
    {
      dataField: "toDate",
      text: "To Date",
      style: { minWidth: "110px" },
      formatter: (cell) => formatDate(cell),
    },
    {
      dataField: "modeOfTravelId",
      text: "Mode of Travel",
      style: { minWidth: "130px" },
      formatter: (cell) => getLabel(dashboard?.allTransportModeList, cell),
    },
    {
      dataField: "classOfTravelId",
      text: "Class of Travel",
      style: { minWidth: "130px" },
      formatter: (cell) => getLabel(dashboard?.allClassOfTravelList, cell),
    },
    {
      dataField: "accomodationRequired",
      text: "Accommodation",
      style: { minWidth: "120px" },
      formatter: (cell) => (cell ? "Required" : "Not Required"),
    },
    {
      dataField: "hotelEntitlementId",
      text: "Hotel Entitlement",
      style: { minWidth: "140px" },
      formatter: (cell, row) =>
        row.accomodationRequired
          ? getLabel(dashboard?.allHotelEntitlementList, cell)
          : "—",
    },
  ];

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="travel-profile-modal"
      dialogClassName="modal-90vw"
    >
      <Modal.Header closeButton>
        <Modal.Title id="travel-profile-modal">
          <h5 className="font-bold mb-0 text-black">Travel Detail</h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!travelData ? (
          <div className="text-center text-muted py-4">
            No travel data found.
          </div>
        ) : (
          <>
            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-12 gap-x-3 mb-4 text-sm text-black">
              {/* Travel Information */}
              <div className="col-span-12 bg-tsecondary p-2 rounded-lg">
                <div className="grid grid-cols-12 gap-x-3">
                  {/* Travel Information */}
                  <div className="col-span-12 md:col-span-6">
                    <h6 className="font-bold text-primary mb-1">
                      Travel Information
                    </h6>
                    <div className="grid grid-cols-2 gap-y-0.5">
                      <div className="font-medium">Purpose of Travel:</div>
                      <div>{travelData.purposeOfTravel || "—"}</div>

                      <div className="font-medium">Travel Type:</div>
                      <div>{travelData.TravelType?.formName || "—"}</div>

                      <div className="font-medium">From Date:</div>
                      <div>{formatDate(firstSeg?.fromDate)}</div>

                      <div className="font-medium">To Date:</div>
                      <div>{formatDate(lastSeg?.toDate)}</div>

                      <div className="font-medium">Travel Days:</div>
                      <div>{travelDays}</div>

                      <div className="font-medium">Status:</div>
                      <div>
                        {travelData.request_status === "A" ? (
                          <span className="text-approved font-bold">
                            Approved
                          </span>
                        ) : travelData.request_status === "P" ? (
                          <span className="text-pending font-bold">
                            Pending
                          </span>
                        ) : travelData.request_status === "R" ? (
                          <span className="text-rejected font-bold">
                            Rejected
                          </span>
                        ) : (
                          travelData.request_status || "—"
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="col-span-12 md:col-span-6">
                    <h6 className="font-bold text-primary mb-1">
                      Financial Details
                    </h6>
                    <div className="grid grid-cols-2 gap-y-0.5">
                      {travelData.dailyAllowanceRate && (
                        <>
                          <div className="font-medium">
                            Daily Allowance Rate:
                          </div>
                          <div>
                            {Number(
                              travelData.dailyAllowanceRate,
                            ).toLocaleString()}
                          </div>
                        </>
                      )}

                      {travelData.dailyAllowanceAmount && (
                        <>
                          <div className="font-medium">Total DA Amount:</div>
                          <div>
                            {Number(
                              travelData.dailyAllowanceAmount,
                            ).toLocaleString()}
                          </div>
                        </>
                      )}

                      {travelData.taxiFareRate && (
                        <>
                          <div className="font-medium">Taxi Fare per KM:</div>
                          <div>
                            {Number(travelData.taxiFareRate).toLocaleString()}
                          </div>
                        </>
                      )}

                      <div className="font-medium">Advance Required:</div>
                      <div>{travelData.advanceRequired ? "Yes" : "No"}</div>

                      {travelData.advanceRequired && travelData.advanceAmount && (
                        <>
                          <div className="font-medium">Advance Amount:</div>
                          <div>
                            {Number(travelData.advanceAmount).toLocaleString()}
                          </div>
                        </>
                      )}

                      {travelData.advanceRemarks && (
                        <>
                          <div className="font-medium">Advance Remarks:</div>
                          <div>{travelData.advanceRemarks}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              {/* <div className="col-span-8 bg-tsecondary p-2 rounded-lg">
               
              </div> */}

              {/* Remarks */}
              {/* {(travelData.travelRequestRemarks || travelData.claimRemarks) && (
                <div className="col-span-12 md:col-span-4 bg-tsecondary p-3 rounded-lg">
                  <h6 className="font-bold text-primary mb-2">Remarks</h6>
                  <div>{travelData.travelRequestRemarks || travelData.claimRemarks}</div>
                </div>
              )} */}
            </div>

            {/* ── Travel Segments Table ── */}
            <div className="mt-2">
              <h6 className="font-bold text-primary mb-2">Travel Segments</h6>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                keyField="Id"
                data={travelData?.Master || []}
                columns={segmentColumns}
                noDataIndication={() => (
                  <div className="text-center py-3 text-muted">
                    No travel segments found
                  </div>
                )}
              >
                <PleaseWaitMessage entities={travelData?.Master || []} />
                <NoRecordsFoundMessage entities={travelData?.Master || []} />
              </BootstrapTable>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
