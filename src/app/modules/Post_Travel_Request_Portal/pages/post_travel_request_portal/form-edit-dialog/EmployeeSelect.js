import React, { useMemo, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Eye, XCircle, History } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import TravelProfile from "./TravelProfile";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";

export function EmployeeSelect({
  employeeId,
  setEmployeeId,
  travelRequestId,
  setTravelRequestId,
  onCancel,
  panelMode,
  setPanelMode,
  disabled,
  isEditMode,
  isViewMode,
}) {
  const dispatch = useDispatch();
  const [showTravelModal, setShowTravelModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(fetchAllFormsMenu(551, "allTransportModeList"));
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList"));
    dispatch(fetchAllFormsMenu(554, "allClassOfTravelList"));
  }, [dispatch]);

  const { approvedEmployeeList, entities } = useSelector(
    (state) => ({
      approvedEmployeeList:
        state.post_travel_request_portal?.approvedEmployeeList ||
        state.post_approval_travel_request?.approvedEmployeeList,
      entities:
        state.post_travel_request_portal?.entities ||
        state.post_approval_travel_request?.entities,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (
      (isEditMode || isViewMode) &&
      employeeId &&
      travelRequestId &&
      approvedEmployeeList
    ) {
      const emp = approvedEmployeeList.find((e) => e.Id === employeeId);
      const item = emp?.list?.find((l) => l.Id === travelRequestId);
      if (item) {
        dispatch(actions.setSelectedTravelRequest(item._fullRecord || item));
      }
    }
  }, [
    isEditMode,
    isViewMode,
    employeeId,
    travelRequestId,
    approvedEmployeeList,
    dispatch,
  ]);

  // Auto-select the logged-in user (since API only returns the logged-in user in Portal)
  useEffect(() => {
    if (
      !employeeId &&
      approvedEmployeeList &&
      approvedEmployeeList.length > 0 &&
      !isEditMode &&
      !isViewMode
    ) {
      const firstEmp = approvedEmployeeList[0];
      if (firstEmp) {
        handleEmployeeChange(firstEmp.Id);
      }
    }
  }, [employeeId, approvedEmployeeList, isEditMode, isViewMode]);

  const usedTravelRequestIds = useMemo(() => {
    if (!entities || !Array.isArray(entities)) return new Set();
    return new Set(
      entities
        .filter((record) => {
          if (
            (isEditMode || isViewMode) &&
            record.preApprovalTravelRequestId === travelRequestId
          )
            return false;
          return true;
        })
        .map((record) => record.preApprovalTravelRequestId),
    );
  }, [entities, isEditMode, isViewMode, travelRequestId]);

  const employeeOptions = useMemo(
    () => [
      { label: "Select", value: "" },
      ...(approvedEmployeeList || []).map((emp) => ({
        label: emp.employeeCode
          ? `${emp.employeeCode} - ${emp.label}`
          : emp.label,
        value: emp.Id,
      })),
    ],
    [approvedEmployeeList],
  );

  const travelReferenceOptions = useMemo(() => {
    if (!employeeId) return [{ label: "Select", value: "" }];
    const emp = approvedEmployeeList?.find((e) => e.Id === employeeId);
    if (!emp || !emp.list) return [{ label: "Select", value: "" }];
    return [
      { label: "Select", value: "" },
      ...emp.list
        .filter((item) => !usedTravelRequestIds.has(item.Id))
        .map((item) => ({ label: item.label, value: item.Id })),
    ];
  }, [approvedEmployeeList, employeeId, usedTravelRequestIds]);

  const handleEmployeeChange = (val) => {
    setEmployeeId(val || null);
    setTravelRequestId(null);
    setPanelMode(false);
    setShowTravelModal(false);
    dispatch(actions.clearSelectedTravelRequest());
  };

  const handleTravelReferenceChange = (val) => {
    setTravelRequestId(val || null);
    setShowTravelModal(false);
    if (val && approvedEmployeeList) {
      const emp = approvedEmployeeList.find((e) => e.Id === employeeId);
      const item = emp?.list?.find((l) => l.Id === val);
      if (item) {
        dispatch(actions.setSelectedTravelRequest(item._fullRecord || item));
      }
    } else {
      dispatch(actions.clearSelectedTravelRequest());
    }
  };

  return (
    <>
      {/* Travel Detail Modal */}
      <TravelProfile
        show={showTravelModal}
        onHide={() => setShowTravelModal(false)}
        employeeId={employeeId}
        travelRequestId={travelRequestId}
      />

      <Formik
        enableReinitialize
        initialValues={{
          employeeId: employeeId || "",
          travelRequestId: travelRequestId || "",
        }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <Form className="form form-label-right">
            <h6 className="text-primary font-bold mb-3">
              Travel Reference
            </h6>

            {/* Employee + View Detail is commented out for portal users as it is locked to the logged-in user
            <div className="grid grid-cols-12 gap-x-3 items-end mb-4">
              <div className="col-span-12 md:col-span-2">
                <label className="block mb-1">Employee</label>
                <SearchSelect
                  name="employeeId"
                  placeholder="Select Employee"
                  value={
                    employeeOptions.find(
                      (o) => o.value === values.employeeId,
                    ) || null
                  }
                  options={employeeOptions}
                  isSearchable
                  isDisabled={disabled}
                  onChange={(e) => {
                    const val =
                      !e.value || e.value === "Select" ? null : Number(e.value);
                    setFieldValue("employeeId", val);
                    setFieldValue("travelRequestId", "");
                    handleEmployeeChange(val);
                  }}
                />
              </div>

              <div className="col-span-12 md:col-span-2 flex items-end pb-px">
                <button
                  type="button"
                  className={`btn ${
                    panelMode ? "btn-light" : "btn-primary"
                  } d-flex align-items-center gap-2`}
                  disabled={!employeeId}
                  onClick={() => setPanelMode(!panelMode)}
                >
                  {panelMode ? (
                    <>
                      <XCircle className="w-4 h-4" /> Cancel
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> View Detail
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <EmployeeProfile employeeId={employeeId} panelMode={panelMode} />
            </div>
            */}

            {/* Travel Reference + Travel Detail Modal Button */}
            <div className="grid grid-cols-12 gap-x-3 items-end">
              <div className="col-span-12 md:col-span-2">
                <label className="block mb-1">Travel Reference</label>
                <SearchSelect
                  name="travelRequestId"
                  placeholder="Pre-Approval Form (Date - Purpose)"
                  value={
                    travelReferenceOptions.find(
                      (o) => o.value === values.travelRequestId,
                    ) || null
                  }
                  options={travelReferenceOptions}
                  isSearchable
                  isDisabled={!values.employeeId || disabled}
                  onChange={(e) => {
                    const val =
                      !e.value || e.value === "Select" ? null : Number(e.value);
                    setFieldValue("travelRequestId", val);
                    handleTravelReferenceChange(val);
                  }}
                />
              </div>

              <div className="col-span-12 md:col-span-2 flex items-end pb-px">
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  disabled={!travelRequestId}
                  onClick={() => setShowTravelModal(true)}
                >
                  <History className="w-4 h-4" /> Travel Detail
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
