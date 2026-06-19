import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import {
  fetchAllSubsidiaryData,
  fetchAllCountry,
  fetchAllCity,
  fetchAllFormsMenu,
  fetchAllEmployeeShifts,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { fetchDataFromEmployeeProfileById } from "../../../_redux/redux-Actions";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
// Schema is built inside the component (see useMemo below) so it can
// access `entities`, `employeeId`, and the record id being edited.

const TRANSFER_TYPE_OPTIONS = [
  { label: "Temporary Transfer", value: 1 },
  { label: "Permanent Transfer", value: 0 },
];

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
  employeeId,
  panelMode,
}) {
  const dispatch = useDispatch();
  const { dashboard, employee_transfer } = useSelector((state) => state);
  const entities = employee_transfer?.entities || [];
  const [currentEmployeeData, setCurrentEmployeeData] = React.useState(null);

  useEffect(() => {
    // Only fetch live profile in create mode (no saved record)
    if (employeeId && !formData?.Id) {
      dispatch(fetchDataFromEmployeeProfileById(employeeId)).then((res) => {
        if (res?.data) {
          setCurrentEmployeeData(res.data);
        }
      });
    } else if (!formData?.Id) {
      setCurrentEmployeeData(null);
    }
  }, [employeeId, dispatch, formData?.Id]);

  // In view/edit mode: show from* joins saved on the transfer record.
  // In create mode: show the live employee profile fetch.
  const displayCurrentData = formData?.Id
    ? {
      subsidiary: formData.fromSubsidiary,
      department: formData.fromDepartment,
      location: formData.fromLocation,
      region: formData.fromRegion,
      city: formData.fromCity,
      country: formData.fromCountry,
      team: formData.fromTeam,
      defaultShift: formData.fromDefaultShift,
    }
    : currentEmployeeData;

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllCountry());
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(fetchAllEmployeeShifts("allJobShiftList"));
    dispatch(fetchAllFormsMenu(86, "allRegionChildMenus"));
    dispatch(fetchAllFormsMenu(174, "allTeamsChildMenus"));
  }, [dispatch]);

  const fetchDepartment = (subsidiaryId) => {
    if (subsidiaryId) {
      dispatch(fetchAllDept(subsidiaryId));
    } else {
      dispatch(fetchAllDept());
    }
  };

  const fetchCity = (countryId) => {
    if (countryId) {
      dispatch(fetchAllCity(countryId));
    } else {
      dispatch(fetchAllCity());
    }
  };

  useEffect(() => {
    fetchDepartment(currentEmployeeData?.subsidiaryId);
    fetchCity(currentEmployeeData?.countryId);
  }, [
    currentEmployeeData?.subsidiaryId,
    currentEmployeeData?.countryId,
    dispatch
  ]);

  // ── Overlap-aware validation schema ─────────────────────────────────────
  const EmployeeTransferEditSchema = useMemo(() => {
    // Helper: check if two inclusive date ranges overlap
    const rangesOverlap = (startA, endA, startB, endB) =>
      startA <= endB && endA >= startB;

    return Yup.object().shape({
      transferType: Yup.number().required(VALIDATION_MESSAGES.required),

      transferDateFrom: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required)
        .test(
          "no-overlap",
          "This date range overlaps with an existing transfer for this employee.",
          function (fromDate) {
            const { transferDateTo, transferType } = this.parent;
            if (!fromDate || !employeeId || !entities || entities.length === 0)
              return true;

            // Permanent = single day (start only), Temporary = full range
            const newStart = new Date(fromDate);
            const newEnd =
              transferType === 1 && transferDateTo
                ? new Date(transferDateTo)
                : new Date(fromDate); // permanent: end = start (single day)

            const hasOverlap = entities.some((record) => {
              // Skip the record currently being edited
              if (formData?.Id && record.Id === formData.Id) return false;
              // Only compare transfers for the same employee
              if (String(record.employeeId) !== String(employeeId)) return false;

              try {
                const existStart = new Date(record.transferFromDate);
                // Existing permanent = single day; existing temporary = full range
                const existEnd = record.transferToDate
                  ? new Date(record.transferToDate)
                  : new Date(record.transferFromDate);
                return rangesOverlap(newStart, newEnd, existStart, existEnd);
              } catch {
                return false;
              }
            });

            return !hasOverlap;
          }
        ),

      transferDateTo: Yup.date()
        .nullable()
        .test(
          "is-required-if-temporary",
          VALIDATION_MESSAGES.required,
          function (value) {
            if (this.parent.transferType === 1) {
              return !!value;
            }
            return true;
          }
        ),

      reasonForTransfer: Yup.string().required(VALIDATION_MESSAGES.required),
      additionalRemarks: Yup.string(),
      transferToSubsidiary: Yup.string().required(VALIDATION_MESSAGES.required),
      transferToDepartment: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      transferToLocation: Yup.string().required(VALIDATION_MESSAGES.required),
      transferToRegion: Yup.string().optional(),
      transferToCity: Yup.string().nullable().optional(),
      transferToCountry: Yup.number().nullable().optional(),
      transferToTeam: Yup.string().optional(),
      transferToDefaultShift: Yup.string().required(VALIDATION_MESSAGES.required),
    });
  }, [entities, employeeId, formData?.Id]);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        transferType: formData?.transferType !== undefined && formData?.transferType !== null ? (formData.transferType ? 1 : 0) : "",
        transferDateFrom: formData?.transferFromDate || null,
        transferDateTo: formData?.transferToDate || null,
        reasonForTransfer: formData?.transferReason || "",
        additionalRemarks: formData?.AdditionalRemarks || "",
        transferToSubsidiary: formData?.toSubsidiaryId || currentEmployeeData?.subsidiaryId || "",
        transferToDepartment: formData?.toDepartmentId || currentEmployeeData?.departmentId || null,
        transferToLocation: formData?.toLocationId || currentEmployeeData?.locationId || "",
        transferToRegion: formData?.toRegionId || currentEmployeeData?.regionId || "",
        transferToCity: formData?.toCityId || currentEmployeeData?.cityId || null,
        transferToCountry: formData?.toCountryId || currentEmployeeData?.countryId || null,
        transferToTeam: formData?.toTeamId || currentEmployeeData?.teamId || "",
        transferToDefaultShift: formData?.toDefaultShiftId || currentEmployeeData?.defaultShiftId || "",
      }}
      validationSchema={EmployeeTransferEditSchema}
      onSubmit={(values) => {
        enableLoading();

        const payload = {
          employeeId: employeeId,
          companyId: currentEmployeeData?.companyId,
          transferType: values.transferType === 1,
          transferFromDate: values.transferDateFrom,
          transferToDate: values.transferType === 1 ? values.transferDateTo : null,
          transferReason: values.reasonForTransfer,
          AdditionalRemarks: values.additionalRemarks,

          fromSubsidiaryId: currentEmployeeData?.subsidiaryId,
          fromDepartmentId: currentEmployeeData?.departmentId,
          fromLocationId: currentEmployeeData?.locationId,
          fromRegionId: currentEmployeeData?.regionId || null,
          fromCityId: currentEmployeeData?.cityId || null,
          fromCountryId: currentEmployeeData?.countryId || null,
          fromTeamId: currentEmployeeData?.teamId || null,
          fromDefaultShiftId: currentEmployeeData?.defaultShiftId,

          toSubsidiaryId: values.transferToSubsidiary,
          toDepartmentId: values.transferToDepartment,
          toLocationId: values.transferToLocation,
          toRegionId: values.transferToRegion || null,
          toCityId: values.transferToCity || null,
          toCountryId: values.transferToCountry || null,
          toTeamId: values.transferToTeam || null,
          toDefaultShiftId: values.transferToDefaultShift,
        };

        if (formData?.Id) {
          payload.Id = formData.Id;
        }

        saveForm(payload);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead || (!employeeId && !formData?.Id)}>

                {/* ═══════════════════════════════════
                    EMPLOYEE DETAILS (Panel Mode)
                ═══════════════════════════════════ */}
                <EmployeeProfile employeeId={employeeId} panelMode={panelMode} />


                {/* ═══════════════════════════════════
                    TRANSFER DETAILS
                ═══════════════════════════════════ */}
                <h6 className="font-bold mb-0 text-primary my-2">
                  Transfer Details
                </h6>
                <hr className="mt-1 mb-3" />

                {/* Row 1: Transfer Type | Date From | Date To */}
                <div className="grid md:grid-cols-8 gap-x-3 gap-y-3 mb-3">
                  {/* Transfer Type */}
                  <div>
                    <SearchSelect
                      name="transferType"
                      label={
                        <span>
                          Transfer Type
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      placeholder="Select..."
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        const val = e?.value !== undefined && e?.value !== null ? e.value : null;
                        setFieldValue("transferType", val);
                        // Clear To Date when switching to Permanent
                        if (val === 0) {
                          setFieldValue("transferDateTo", null);
                        }
                      }}
                      value={
                        TRANSFER_TYPE_OPTIONS.find(
                          (o) => o.value === values.transferType
                        ) || null
                      }
                      options={TRANSFER_TYPE_OPTIONS}
                      error={errors.transferType}
                      touched={touched.transferType}
                    />
                  </div>

                  <div>
                    <label>
                      From Date
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      className="form-control"
                      component={DatePickerField}
                      selected={
                        values.transferDateFrom
                          ? new Date(values.transferDateFrom)
                          : null
                      }
                      onChange={(date) =>
                        setFieldValue(
                          "transferDateFrom",
                          formatDates(date, "yyyy-MM-dd")
                        )
                      }
                      dateFormat="dd-MMM-yyyy"
                      name="transferDateFrom"
                      autoComplete="off"
                    />
                  </div>

                  {/* Transfer Date To */}
                  {values.transferType === 1 && (
                    <div>
                      <label>
                        To Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        component={DatePickerField}
                        selected={
                          values.transferDateTo
                            ? new Date(values.transferDateTo)
                            : null
                        }
                        onChange={(date) =>
                          setFieldValue(
                            "transferDateTo",
                            formatDates(date, "yyyy-MM-dd")
                          )
                        }
                        dateFormat="dd-MMM-yyyy"
                        name="transferDateTo"
                        autoComplete="off"
                        minDate={
                          values.transferDateFrom
                            ? new Date(values.transferDateFrom)
                            : undefined
                        }
                  
                      />
                    </div>
                  )}
                </div>



                {/* Row 2: Reason | Remarks */}
                <div className="grid md:grid-cols-2 gap-x-3 gap-y-3 mb-3">
                  <div>
                    <label>
                      Reason for Transfer
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="reasonForTransfer"
                      as="textarea"
                      className={`form-control ${touched.reasonForTransfer && errors.reasonForTransfer ? "is-invalid" : ""}`}
                      placeholder="Enter reason"
                      rows={3}
                      style={{ resize: "none" }}
                    />
                    {touched.reasonForTransfer && errors.reasonForTransfer && (
                      <div className="invalid-feedback d-block">
                        {errors.reasonForTransfer}
                      </div>
                    )}
                  </div>

                  <div>
                    <label>Additional Remarks</label>
                    <Field
                      name="additionalRemarks"
                      as="textarea"
                      className="form-control"
                      placeholder="Enter remarks"
                      rows={3}
                      style={{ resize: "none" }}
                    />
                  </div>
                </div>

                {/* ═══════════════════════════════════
                    TRANSFER TO
                ═══════════════════════════════════ */}
                <h6 className="font-bold mb-0 text-primary my-2 mt-4">
                  Transfer To
                </h6>
                <hr className="mt-1 mb-2" />

                {/* Sub-header row */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-2">
                  <span className="text-black" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                    From
                  </span>
                  <span className="text-black" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                    To
                  </span>
                </div>

                {/* ── Subsidiary ── */}
                {/* <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Subsidiary:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.subsidiary?.name || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Subsidiary:<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToSubsidiary"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("transferToSubsidiary", e.value || null);
                          setFieldValue("transferToDepartment", null);
                          setFieldValue("transferToDefaultShift", null);
                          fetchDepartment(e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (o) => String(o.value) === String(values.transferToSubsidiary)
                          ) || (values.transferToSubsidiary && currentEmployeeData?.subsidiaryId == values.transferToSubsidiary ? { label: currentEmployeeData?.subsidiary?.name, value: currentEmployeeData?.subsidiaryId } : (values.transferToSubsidiary && formData?.toSubsidiaryId == values.transferToSubsidiary && formData?.toSubsidiary ? { label: formData?.toSubsidiary?.name, value: formData?.toSubsidiaryId } : null))
                        }
                        options={dashboard?.allSubsidiaryList || []}
                        error={errors.transferToSubsidiary}
                        touched={touched.transferToSubsidiary}
                      />
                    </div>
                  </div>
                </div> */}

                {/* ── Department ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Department:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.department?.deptName || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Department:<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToDepartment"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) =>
                          setFieldValue(
                            "transferToDepartment",
                            e.value || null
                          )
                        }
                        value={
                          dashboard?.allDept?.find(
                            (o) => String(o.value) === String(values.transferToDepartment)
                          ) || (values.transferToDepartment && currentEmployeeData?.departmentId == values.transferToDepartment ? { label: currentEmployeeData?.department?.deptName, value: currentEmployeeData?.departmentId } : (values.transferToDepartment && formData?.toDepartmentId == values.transferToDepartment && formData?.toDepartment ? { label: formData?.toDepartment?.deptName, value: formData?.toDepartmentId } : null))
                        }
                        options={dashboard?.allDept || []}
                        error={errors.transferToDepartment}
                        touched={touched.transferToDepartment}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Location ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Location:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.location?.formName || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Location:<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToLocation"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) =>
                          setFieldValue("transferToLocation", e.value || null)
                        }
                        value={
                          dashboard?.allLocationChildMenus?.find(
                            (o) => String(o.value) === String(values.transferToLocation)
                          ) || (values.transferToLocation && currentEmployeeData?.locationId == values.transferToLocation ? { label: currentEmployeeData?.location?.formName, value: currentEmployeeData?.locationId } : (values.transferToLocation && formData?.toLocationId == values.transferToLocation && formData?.toLocation ? { label: formData?.toLocation?.formName, value: formData?.toLocationId } : null))
                        }
                        options={dashboard?.allLocationChildMenus || []}
                        error={errors.transferToLocation}
                        touched={touched.transferToLocation}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Region ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Region:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.region?.formName || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Region:
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToRegion"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) =>
                          setFieldValue("transferToRegion", e.value || null)
                        }
                        value={
                          dashboard?.allRegionChildMenus?.find(
                            (o) => String(o.value) === String(values.transferToRegion)
                          ) || (values.transferToRegion && currentEmployeeData?.regionId == values.transferToRegion ? { label: currentEmployeeData?.region?.formName, value: currentEmployeeData?.regionId } : (values.transferToRegion && formData?.toRegionId == values.transferToRegion && formData?.toRegion ? { label: formData?.toRegion?.formName, value: formData?.toRegionId } : null))
                        }
                        options={dashboard?.allRegionChildMenus || []}
                        error={errors.transferToRegion}
                        touched={touched.transferToRegion}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Country ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Country:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.country?.countryName || displayCurrentData?.country?.name || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Country:
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToCountry"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("transferToCountry", e.value || null);
                          setFieldValue("transferToCity", null);
                          fetchCity(e.value || null);
                        }}
                        value={
                          dashboard?.allCountry?.find(
                            (o) => String(o.value) === String(values.transferToCountry)
                          ) || (values.transferToCountry && currentEmployeeData?.countryId == values.transferToCountry ? { label: currentEmployeeData?.country?.countryName || currentEmployeeData?.country?.name, value: currentEmployeeData?.countryId } : (values.transferToCountry && formData?.toCountryId == values.transferToCountry && formData?.toCountry ? { label: formData?.toCountry?.countryName || formData?.toCountry?.name, value: formData?.toCountryId } : null))
                        }
                        options={dashboard?.allCountry || []}
                        error={errors.transferToCountry}
                        touched={touched.transferToCountry}
                      />
                    </div>
                  </div>
                </div>

                {/* ── City ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>City:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.city?.cityName || displayCurrentData?.city?.name || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      City:
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToCity"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) => {
                          setFieldValue("transferToCity", e.value || null);
                        }}
                        value={
                          dashboard?.allCity?.find(
                            (o) => String(o.value) === String(values.transferToCity)
                          ) || (values.transferToCity && currentEmployeeData?.cityId == values.transferToCity ? { label: currentEmployeeData?.city?.cityName || currentEmployeeData?.city?.name, value: currentEmployeeData?.cityId } : (values.transferToCity && formData?.toCityId == values.transferToCity && formData?.toCity ? { label: formData?.toCity?.cityName || formData?.toCity?.name, value: formData?.toCityId } : null))
                        }
                        options={dashboard?.allCity || []}
                        error={errors.transferToCity}
                        touched={touched.transferToCity}
                      />
                    </div>
                  </div>
                </div>



                {/* ── Team ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Team:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.team?.formName || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Team:
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToTeam"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) =>
                          setFieldValue("transferToTeam", e.value || null)
                        }
                        value={
                          dashboard?.allTeamsChildMenus?.find(
                            (o) => String(o.value) === String(values.transferToTeam)
                          ) || (values.transferToTeam && currentEmployeeData?.teamId == values.transferToTeam ? { label: currentEmployeeData?.team?.formName, value: currentEmployeeData?.teamId } : (values.transferToTeam && formData?.toTeamId == values.transferToTeam && formData?.toTeam ? { label: formData?.toTeam?.formName, value: formData?.toTeamId } : null))
                        }
                        options={dashboard?.allTeamsChildMenus || []}
                        error={errors.transferToTeam}
                        touched={touched.transferToTeam}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Default Shift ── */}
                <div className="grid md:grid-cols-3 gap-x-6 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "110px", flexShrink: 0 }}>Default Shift:</label>
                    <p className="text-sm font-bold mb-0">
                      {displayCurrentData?.defaultShift?.name || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "110px", flexShrink: 0 }}>
                      Default Shift:<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="flex-1">
                      <SearchSelect
                        name="transferToDefaultShift"
                        placeholder="Select..."
                        isDisabled={isdataForRead}
                        onChange={(e) =>
                          setFieldValue(
                            "transferToDefaultShift",
                            e.value || null
                          )
                        }
                        value={
                          dashboard?.allJobShiftList?.find(
                            (o) => String(o.value) === String(values.transferToDefaultShift)
                          ) || (values.transferToDefaultShift && currentEmployeeData?.defaultShiftId == values.transferToDefaultShift ? { label: currentEmployeeData?.defaultShift?.name, value: currentEmployeeData?.defaultShiftId } : (values.transferToDefaultShift && formData?.toDefaultShiftId == values.transferToDefaultShift && formData?.toDefaultShift ? { label: formData?.toDefaultShift?.name, value: formData?.toDefaultShiftId } : null))
                        }
                        options={
                          values.transferToSubsidiary
                            ? dashboard?.allJobShiftList?.filter(
                              (shift) => String(shift.subsidiaryId) === String(values.transferToSubsidiary)
                            ) || []
                            : dashboard?.allJobShiftList || []
                        }
                        error={errors.transferToDefaultShift}
                        touched={touched.transferToDefaultShift}
                      />
                    </div>
                  </div>
                </div>


              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light btn-elevate"
              disabled={actionsLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={actionsLoading || isdataForRead}
            >
              {loading ? (
                <span>
                  Save
                  <span className="ml-3 spinner spinner-white" />
                </span>
              ) : (
                "Save"
              )}
            </button>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
