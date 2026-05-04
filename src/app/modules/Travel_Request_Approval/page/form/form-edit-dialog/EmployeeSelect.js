import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Eye, XCircle, FileText, History } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";

export function EmployeeSelect({
  employeeId,
  setEmployeeId,
  panelMode,
  setPanelMode,
  onCancel,
  disabled = false,
  isEditMode = false,
  isViewMode = false,
  employeeEntitlement: propEmployeeEntitlement,
}) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAllFormsMenu(551, "allTransportModeList"));
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList"));
    dispatch(fetchAllFormsMenu(555, "allTravelLocationList"));
    dispatch(fetchAllFormsMenu(554, "allClassOfTravelList"));
  }, [dispatch]);
  const { dashboard, employeeEntitlement, auth } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      employeeEntitlement:
        state.t_preapproval_travel_request.employeeEntitlement,
      auth: state.auth,
    }),
    shallowEqual,
  );

  const [showEntitlementModal, setShowEntitlementModal] = React.useState(false);
  const [
    showLastTravelDetailsModal,
    setShowLastTravelDetailsModal,
  ] = React.useState(false);
  const [lastTravelData, setLastTravelData] = React.useState(null);
  const modeText = isEditMode ? "Edit" : isViewMode ? "View" : "Add";

  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
    }),
    shallowEqual,
  );

  // Get transport and hotel options from dashboard
  const transportOptions = dashboard?.allTransportModeList || [];
  const hotelOptions = dashboard?.allHotelEntitlementList || [];

  // Filter transport options based on entitlement
  const filteredTransportOptions = useMemo(() => {
    const entitlementData = propEmployeeEntitlement || employeeEntitlement;
    if (
      !entitlementData ||
      !entitlementData.modeOfTransportId ||
      !Array.isArray(entitlementData.modeOfTransportId) ||
      entitlementData.modeOfTransportId.length === 0
    ) {
      return transportOptions;
    }
    return transportOptions.filter((opt) =>
      entitlementData.modeOfTransportId.includes(String(opt.value)),
    );
  }, [transportOptions, propEmployeeEntitlement, employeeEntitlement]);

  // Filter hotel options based on entitlement
  const filteredHotelOptions = useMemo(() => {
    const entitlementData = propEmployeeEntitlement || employeeEntitlement;
    if (
      !entitlementData ||
      !entitlementData.hotelEntitlementId ||
      !Array.isArray(entitlementData.hotelEntitlementId) ||
      entitlementData.hotelEntitlementId.length === 0
    ) {
      return hotelOptions;
    }
    return hotelOptions.filter((opt) =>
      entitlementData.hotelEntitlementId.includes(String(opt.value)),
    );
  }, [hotelOptions, propEmployeeEntitlement, employeeEntitlement]);

  // Get the entitlement data to display (prefer prop, fallback to Redux)
  const displayEntitlement = propEmployeeEntitlement || employeeEntitlement;

  // Handle entitlement button click
  const handleEntitlementClick = () => {
    if (employeeId) {
      setShowEntitlementModal(true);
    }
  };

  // Handle last travel details button click
  const handleLastTravelDetailsClick = () => {
    if (employeeId) {
      dispatch(
        actions.fetchLastApprovedTravelRequest(employeeId, setLastTravelData),
      );
      setShowLastTravelDetailsModal(true);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ employeeId: employeeId }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, handleBlur }) => (
          <Form className="form form-label-right">
            <div className="grid grid-cols-12 gap-x-3 items-end">
              {/* Employee Dropdown */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <h6 className="text-primary font-bold mb-3">
                  {modeText} Travel Request (PreApproval)
                </h6>
                <SearchSelect
                  name="employeeId"
                  label={<span>Employee</span>}
                  placeholder="Select Employee"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const value =
                      !e.value || e.value === "Select" ? null : Number(e.value);
                    setFieldValue("employeeId", value);
                    setEmployeeId(value);
                    if (!value) {
                      setPanelMode(false);
                    }
                  }}
                  value={
                    allEmployees?.find(
                      (opt) => opt.value === values.employeeId,
                    ) || null
                  }
                  options={[
                    { label: "Select", value: "" },
                    ...(Array.isArray(allEmployees)
                      ? allEmployees.map((emp) => ({
                          label: emp.label,
                          value: emp.value,
                        }))
                      : []),
                  ]}
                  isSearchable={true}
                  isDisabled={disabled}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-wrap items-center gap-2 mt-4 md:mt-0 pb-[2px]">
                {/* View Details Button */}
                <button
                  type="button"
                  className={`btn ${
                    panelMode ? "btn-light" : "btn-primary"
                  } d-flex align-items-center gap-2`}
                  onClick={() => setPanelMode(!panelMode)}
                >
                  {panelMode ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      View Detail
                    </>
                  )}
                </button>

                {/* Entitlement Detail Button */}
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={handleEntitlementClick}
                  disabled={!values.employeeId}
                >
                  <FileText className="w-4 h-4" />
                  Entitlement Detail
                </button>

                {/* Last Travel Details Button - FIXED: changed to correct handler */}
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={handleLastTravelDetailsClick}
                  disabled={!values.employeeId}
                >
                  <History className="w-4 h-4" />
                  Last Travel Details
                </button>

                {/* Close/Cross Button to Exit Mode */}
                <div className="ml-auto">
                  <button
                    type="button"
                    className="bg-transparent border-0 p-0 ml-2"
                    onClick={onCancel}
                    title="Close"
                  >
                    <XCircle className="w-5 h-5 text-black cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Entitlement Details Modal */}
      <Modal
        show={showEntitlementModal}
        onHide={() => setShowEntitlementModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="text-primary font-bold m-0">Entitlements</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {displayEntitlement ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-3">
              {/* <div>
                <label className="text-xs font-medium mb-1">TA DA Approver</label>
                <div className="text-xs">
                  {displayEntitlement.resolvedPreApproverNames ||
                    displayEntitlement.preApproverNames ||
                    "N/A"}
                </div>
              </div> */}

              <div>
                <label className="text-xs font-medium mb-1">
                  Mode of Transport :{" "}
                  <span className="text-xs">
                    {displayEntitlement.ModeOfTransports?.length > 0
                      ? displayEntitlement.ModeOfTransports.map(
                          (m) => m.formName || m.name || m.label,
                        ).join(", ")
                      : filteredTransportOptions
                          .map((o) => o.label)
                          .join(", ") || "N/A"}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Hotel Entitlement :{" "}
                  <span className="text-xs">
                    {displayEntitlement.HotelEntitlements?.length > 0
                      ? displayEntitlement.HotelEntitlements.map(
                          (h) => h.formName || h.name || h.label,
                        ).join(", ")
                      : filteredHotelOptions.map((o) => o.label).join(", ") ||
                        "N/A"}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Allow Self Entitlement (Hotel) :{" "}
                  <span className="text-xs">
                    {displayEntitlement.ishotelEntitlementSelfAmountWise
                      ? "Yes"
                      : "No"}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Daily Allowance Rate :{" "}
                  <span className="text-xs">
                    Rs.{" "}
                    {(
                      displayEntitlement.dailyAllowanceAmount || 0
                    ).toLocaleString("en-US")}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Taxi Fare (per km) :{" "}
                  <span className="text-xs">
                    Rs.{" "}
                    {(displayEntitlement.taxiFareAmount || 0).toLocaleString(
                      "en-US",
                    )}
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <p>No policy details available for this employee.</p>
              <small className="text-muted">
                Please ensure the employee has a TADA policy configured.
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowEntitlementModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Last Travel Details Modal */}
      <Modal
        show={showLastTravelDetailsModal}
        onHide={() => setShowLastTravelDetailsModal(false)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="text-primary font-bold m-0">Last Travel Details</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {lastTravelData ? (
            <>
              {/* ── Line 1: Purpose of Travel label */}
              <div>
                <span className="text-sm text-black font-bold">
                  Purpose Of Travel :{" "}
                </span>
                <span className="text-sm text-black">
                  {lastTravelData.purposeOfTravel || "—"}
                </span>
              </div>

              {/* ── Travel Segments Table */}
              <div
                className="react-bootstrap-table table-responsive mb-4"
                style={{ overflowX: "auto" }}
              >
                <table className="table table-head-custom table-vertical-center table-hover">
                  <thead className="custom-table-header">
                    <tr>
                      <td style={{ minWidth: "110px" }}>From Location</td>
                      <td style={{ minWidth: "110px" }}>To Location</td>
                      <td style={{ minWidth: "100px" }}>From Date</td>
                      <td style={{ minWidth: "100px" }}>To Date</td>
                      <td style={{ minWidth: "110px" }}>Mode of Travel</td>
                      <td style={{ minWidth: "110px" }}>Class of Travel</td>
                      <td style={{ minWidth: "180px" }}>
                        Accommodation Required
                      </td>
                      <td style={{ minWidth: "130px" }}>Hotel Entitlement</td>
                      {/* <td style={{ minWidth: "170px" }}>
                        Hotel Entitlement Amount
                      </td> */}
                      <td style={{ minWidth: "120px" }}>Self Entitlement</td>
                      <td style={{ minWidth: "80px" }}>Self Amount</td>
                    </tr>
                  </thead>
                  <tbody>
                    {lastTravelData.Master &&
                    Array.isArray(lastTravelData.Master) &&
                    lastTravelData.Master.length > 0 ? (
                      lastTravelData.Master.map((seg, idx) => (
                        <tr key={idx}>
                          <td className="text-xs">
                            {dashboard?.allTravelLocationList?.find(
                              (l) =>
                                String(l.value) === String(seg.fromLocationId),
                            )?.label ||
                              seg.fromLocation ||
                              "—"}
                          </td>
                          <td className="text-xs">
                            {dashboard?.allTravelLocationList?.find(
                              (l) =>
                                String(l.value) === String(seg.toLocationId),
                            )?.label ||
                              seg.toLocation ||
                              "—"}
                          </td>
                          <td className="text-xs">
                            {seg.fromDate
                              ? new Date(seg.fromDate)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .replace(/ /g, "-")
                              : "—"}
                          </td>
                          <td className="text-xs">
                            {seg.toDate
                              ? new Date(seg.toDate)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .replace(/ /g, "-")
                              : "—"}
                          </td>
                          <td className="text-xs">
                            {dashboard?.allTransportModeList?.find(
                              (t) =>
                                String(t.value) === String(seg.modeOfTravelId),
                            )?.label ||
                              seg.ModeOfTransport?.name ||
                              "—"}
                          </td>
                          <td className="text-xs">
                            {dashboard?.allClassOfTravelList?.find(
                              (c) =>
                                String(c.value) === String(seg.classOfTravelId),
                            )?.label ||
                              seg.ClassOfTransport?.name ||
                              "—"}
                          </td>
                          <td className="text-xs text-center">
                            {seg.accomodationRequired ||
                            seg.accommodationRequired ? (
                              <span>Yes</span>
                            ) : (
                              <span>No</span>
                            )}
                          </td>
                          <td className="text-xs">
                            {dashboard?.allHotelEntitlementList?.find(
                              (h) =>
                                String(h.value) ===
                                String(seg.hotelEntitlementId),
                            )?.label ||
                              seg.HotelEntitlement?.name ||
                              "—"}
                          </td>
                          <td className="text-xs">
                            {seg.hotelEntitlementAmount != null
                              ? Number(
                                  seg.hotelEntitlementAmount,
                                ).toLocaleString("en-US")
                              : "—"}
                          </td>
                          <td className="text-xs text-center">
                            {seg.selfEntitlement ? (
                              <span>Yes</span>
                            ) : (
                              <span>No</span>
                            )}
                          </td>
                          <td className="text-xs">
                            {seg.selfAmount != null
                              ? Number(seg.selfAmount).toLocaleString("en-US")
                              : "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center text-muted py-3"
                        >
                          No travel segments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-muted py-4">
              <p className="mb-1">
                No previous travel record found for this employee.
              </p>
              <small>
                Travel history will appear here once data is available.
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowLastTravelDetailsModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
