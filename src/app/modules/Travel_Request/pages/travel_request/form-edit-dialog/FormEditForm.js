/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  fetchTadaConfigByEmployeeId,
  getEmployeeAuthorities,
} from "../../../_redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { Checkbox } from "../../../../../../_metronic/_partials/controls";
import DatePicker from "react-datepicker";
import {
  Plus,
  Trash2,
  CirclePlus,
  Calendar,
  FileText,
  History,
  X,
  XCircle,
  Eye,
} from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { NumericFormat } from "react-number-format";
import { Label } from "@material-ui/icons";
// import { Toast } from "react-bootstrap";
import { toast } from "react-toastify";

export function FormEditForm({
  employeeId,
  employeeDetails,
  onCancel,
  saveForm,
  onHide,
  disableLoading,
  user,
  isReadOnly,
  isViewMode = false,
  isEditMode = false,
}) {
  const dispatch = useDispatch();
  const {
    dashboard,
    employeeEntitlement,
    actionsLoading,
    empAuthorityList,
    isPolicyExists,
  } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      employeeEntitlement: state.travel_request.employeeEntitlement,
      actionsLoading: state.travel_request.actionsLoading,
      empAuthorityList: state.travel_request.empAuthorityList,
      isPolicyExists: state.travel_request.isPolicyExists,
      auth: state.auth,
    }),
    shallowEqual,
  );

  const [showEntitlementModal, setShowEntitlementModal] = React.useState(false);

  const modeText = isEditMode ? "Edit" : isViewMode ? "View" : "Add";

  const transportOptions = dashboard?.allTransportModeList || [];
  const hotelOptions = dashboard?.allHotelEntitlementList || [];
  const locationOptions = dashboard?.allTravelLocationList || [];
  const travelTypeOptions = dashboard?.allTravelTypeList || [];
  const travelClassOptions = dashboard?.allClassOfTravelList || [];

  React.useEffect(() => {
    dispatch(fetchAllFormsMenu(551, "allTransportModeList"));
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList"));
    dispatch(fetchAllFormsMenu(555, "allTravelLocationList"));
    dispatch(fetchAllFormsMenu(553, "allTravelTypeList"));
    dispatch(fetchAllFormsMenu(554, "allClassOfTravelList"));
  }, [dispatch]);

  const effectiveEmployeeId = employeeId || user?.employeeId || user?.Id;

  React.useEffect(() => {
    if (effectiveEmployeeId) {
      dispatch(fetchTadaConfigByEmployeeId(effectiveEmployeeId, isReadOnly));
      dispatch(getEmployeeAuthorities(effectiveEmployeeId));
    }
  }, [effectiveEmployeeId, dispatch]);

  const handleEntitlementClick = () => {
    if (effectiveEmployeeId) {
      setShowEntitlementModal(true);
    }
  };

  // Validation Schema
  const formValidation = Yup.object().shape({
    purposeOfTravel: Yup.string().required(VALIDATION_MESSAGES.required),
    // projectName: Yup.string().required(VALIDATION_MESSAGES.required),
    travelTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
    dailyAllowanceRate: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(0, VALIDATION_MESSAGES.minOneValue)
      .test("limit-check", VALIDATION_MESSAGES.amountExceedLimit, function(
        value,
      ) {
        const limit = employeeEntitlement?.dailyAllowanceAmount || 0;
        if (limit > 0 && value > limit) {
          return false;
        }
        return true;
      }),
    dailyAllowanceDays: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(1, VALIDATION_MESSAGES.minOneValue),
    travelSegments: Yup.array()
      .of(
        Yup.object().shape({
          fromLocation: Yup.string().required(VALIDATION_MESSAGES.required),
          toLocation: Yup.string()
            .required(VALIDATION_MESSAGES.required)
            .test(
              "different-locations",
              "From and To locations cannot be the same",
              function(value) {
                const { fromLocation } = this.parent;
                if (!value || !fromLocation) return true; // Skip if either is empty
                return value !== fromLocation;
              },
            ),
          fromDate: Yup.date()
            .typeError(VALIDATION_MESSAGES.required)
            .required(VALIDATION_MESSAGES.required),
          toDate: Yup.date()
            .typeError(VALIDATION_MESSAGES.required)
            .required(VALIDATION_MESSAGES.required)
            .min(Yup.ref("fromDate"), VALIDATION_MESSAGES.endDateError),
          modeOfTravel: Yup.string().required(VALIDATION_MESSAGES.required),
          classOfTravel: Yup.string().nullable(),
          hotelEntitlement: Yup.string().when(
            ["accommodationRequired", "selfEntitlement"],
            (accommodationRequired, selfEntitlement, schema) => {
              return accommodationRequired && !selfEntitlement
                ? schema.required(VALIDATION_MESSAGES.required)
                : schema.nullable();
            },
          ),
          // hotelEntitlementAmount: Yup.number().when(
          //   ["accommodationRequired", "selfEntitlement"],
          //   (accommodationRequired, selfEntitlement, schema) => {
          //     return accommodationRequired && !selfEntitlement
          //       ? schema
          //           .required(VALIDATION_MESSAGES.required)
          //           .min(0, VALIDATION_MESSAGES.minOneValue)
          //       : schema.nullable();
          //   },
          // ),
          selfAmount: Yup.number().when(
            ["accommodationRequired", "selfEntitlement"],
            (accommodationRequired, selfEntitlement, schema) => {
              return accommodationRequired && selfEntitlement
                ? schema
                    .required(VALIDATION_MESSAGES.required)
                    .min(0, VALIDATION_MESSAGES.minOneValue)
                    .test(
                      "self-amount-limit",
                      VALIDATION_MESSAGES.amountExceedLimit,
                      function(value) {
                        const limit =
                          employeeEntitlement?.hotelEntitlementSelfAmount || 0;
                        if (limit > 0 && value > limit) {
                          return false;
                        }
                        return true;
                      },
                    )
                : schema.nullable();
            },
          ),
        }),
      )
      .min(1, "At least one travel segment is required"),
    advanceAmount: Yup.number().when(
      "advanceRequested",
      (advanceRequested, schema) => {
        return advanceRequested
          ? schema
              .required(VALIDATION_MESSAGES.required)
              .min(0, VALIDATION_MESSAGES.minOneValue)
          : schema.nullable();
      },
    ),
    advanceRemarks: Yup.string().when(
      "advanceRequested",
      (advanceRequested, schema) => {
        return advanceRequested
          ? schema.required(VALIDATION_MESSAGES.required)
          : schema.nullable();
      },
    ),
    travelRemarks: Yup.string().nullable(),
    taxiFareRate: Yup.number().nullable(),
  });

  // Combined Template logic for create/edit
  const initialValues = useMemo(() => {
    if (user && (user.Id || user.id)) {
      return {
        ...user,
        projectName: user.projectName || "General",
        advanceRequested: user.advanceRequired,
        dailyAllowanceDays: Math.floor(user.dailyAllowanceDay || 0),
        travelSegments:
          user.Master?.map((m) => ({
            fromLocation: m.fromLocationId,
            toLocation: m.toLocationId,
            fromDate: m.fromDate ? new Date(m.fromDate) : null,
            toDate: m.toDate ? new Date(m.toDate) : null,
            modeOfTravel: m.modeOfTravelId,
            classOfTravel: m.classOfTravelId,
            accommodationRequired: m.accomodationRequired,
            hotelEntitlement: m.hotelEntitlementId,
            hotelEntitlementAmount: m.hotelEntitlementAmount,
            selfEntitlement: m.selfEntitlement,
            selfAmount: m.selfAmount,
          })) || [],
        travelRemarks: user.travelRequestRemarks || "",
      };
    }

    const segmentTemplate = {
      fromLocation: "",
      toLocation: "",
      fromDate: null,
      toDate: null,
      modeOfTravel: "",
      classOfTravel: "",
      accommodationRequired: false,
      hotelEntitlement: "",
      hotelEntitlementAmount: 0,
      selfEntitlement: false,
      selfAmount: 0,
    };

    return {
      employeeId: employeeId || "",
      purposeOfTravel: "",
      projectName: "General",
      travelTypeId: "",
      dailyAllowanceRate: 0,
      dailyAllowanceDays: 0,
      dailyAllowanceAmount: 0,
      advanceRequested: false,
      advanceAmount: 0,
      advanceRemarks: "",
      taxiFareRate: 0,
      travelSegments: [{ ...segmentTemplate }, { ...segmentTemplate }],
      travelRemarks: "",
    };
  }, [user, employeeId]);

  return (
    <div className="mt-4">
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const payload = {
            id: user?.Id || user?.id,
            companyId: employeeDetails?.companyId || user?.companyId,
            subsidiaryId: employeeDetails?.subsidiaryId || user?.subsidiaryId,
            employeeId: employeeId || user?.employeeId,
            purposeOfTravel: values.purposeOfTravel,
            projectName: values.projectName || "General",
            travelTypeId: values.travelTypeId,
            dailyAllowanceRate: values.dailyAllowanceRate,
            dailyAllowanceDay: values.dailyAllowanceDays,
            dailyAllowanceAmount: values.dailyAllowanceAmount,
            advanceRequired: values.advanceRequested,
            advanceAmount: values.advanceRequested ? values.advanceAmount : 0,
            advanceRemarks: values.advanceRequested
              ? values.advanceRemarks
              : "",
            travelRemarks: values.travelRemarks,
            taxiFareRate: values.taxiFareRate,
            request_status: values.request_status || "P",
            Master: values.travelSegments.map((segment) => {
              const formatLocalDate = (dateObj) => {
                if (!dateObj) return null;
                const d = new Date(dateObj);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                  2,
                  "0",
                )}-${String(d.getDate()).padStart(2, "0")}`;
              };
              return {
                fromLocationId: segment.fromLocation,
                toLocationId: segment.toLocation,
                fromDate: formatLocalDate(segment.fromDate),
                toDate: formatLocalDate(segment.toDate),
                modeOfTravelId: segment.modeOfTravel,
                classOfTravelId: segment.classOfTravel,
                accommodationRequired: segment.accommodationRequired,
                isSelf: segment.selfEntitlement,
                hotelEntitlementId: segment.hotelEntitlement,
                hotelAmount: segment.hotelEntitlementAmount || 0,
                selfAmount: segment.selfAmount,
              };
            }),
            authortiesList: empAuthorityList,
          };

          if (!empAuthorityList || empAuthorityList.length === 0) {
            toast.error(
              isPolicyExists
                ? "No workflow authorities found for this employee. Cannot submit."
                : "Workflow policy does not exist for this employee. Cannot submit.",
              { position: "top-right", autoClose: 5000 },
            );
            return;
          }

          if (saveForm) {
            saveForm(payload);
          } else {
            console.error("saveForm prop missing in FormEditForm");
          }
        }}
      >
        {({
          isSubmitting,
          values,
          setFieldValue,
          setFieldTouched,
          errors,
          touched,
          submitForm,
        }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const prevSegmentsRef = React.useRef(values.travelSegments);

          // Auto-calculation logic for Daily Allowance (Days and Amount)
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            const firstOld = prevSegmentsRef.current?.[0];
            const lastOld =
              prevSegmentsRef.current?.[prevSegmentsRef.current.length - 1];

            const firstSegment = values.travelSegments[0];
            const lastSegment =
              values.travelSegments[values.travelSegments.length - 1];

            const datesChanged =
              firstOld?.fromDate !== firstSegment?.fromDate ||
              lastOld?.toDate !== lastSegment?.toDate;

            prevSegmentsRef.current = values.travelSegments;

            // Only overwrite if the user actively changed the boundary dates in the calendar
            if (!datesChanged) return;

            if (firstSegment?.fromDate && lastSegment?.toDate) {
              const start = new Date(firstSegment.fromDate);
              const end = new Date(lastSegment.toDate);

              // Ensure we only have date part for accurate calculation
              start.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);

              const diffTime = end.getTime() - start.getTime();
              const diffDays = Math.max(
                0,
                Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1,
              );

              if (values.dailyAllowanceDays !== diffDays) {
                setFieldValue("dailyAllowanceDays", diffDays);
              }
            } else {
              if (values.dailyAllowanceDays !== 0) {
                setFieldValue("dailyAllowanceDays", 0);
              }
            }
          }, [values.travelSegments, setFieldValue]);

          // Round-Trip Synchronizer: Ensures last row destination = first row origin
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            const length = values.travelSegments.length;
            if (length > 1) {
              const origin = values.travelSegments[0]?.fromLocation;
              const lastDestination =
                values.travelSegments[length - 1]?.toLocation;

              if (origin && lastDestination !== origin) {
                setFieldValue(
                  `travelSegments.${length - 1}.toLocation`,
                  origin,
                );
              }
            }
          }, [values.travelSegments, setFieldValue]);

          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            const amount =
              values.dailyAllowanceRate * values.dailyAllowanceDays;
            setFieldValue("dailyAllowanceAmount", amount);
          }, [
            values.dailyAllowanceRate,
            values.dailyAllowanceDays,
            setFieldValue,
          ]);

          React.useEffect(() => {
            if (employeeEntitlement) {
              if (
                employeeEntitlement.dailyAllowanceAmount &&
                !(user?.Id || user?.id)
              ) {
                setFieldValue(
                  "dailyAllowanceRate",
                  employeeEntitlement.dailyAllowanceAmount,
                );
              }
              if (employeeEntitlement.taxiFareAmount) {
                setFieldValue(
                  "taxiFareRate",
                  employeeEntitlement.taxiFareAmount,
                );
              }
            }
          }, [employeeEntitlement, user?.Id, user?.id, setFieldValue]);

          const filteredTransportOptions = useMemo(() => {
            if (
              !employeeEntitlement ||
              !employeeEntitlement.modeOfTransportId ||
              !Array.isArray(employeeEntitlement.modeOfTransportId) ||
              employeeEntitlement.modeOfTransportId.length === 0
            )
              return transportOptions;
            return transportOptions.filter((opt) =>
              employeeEntitlement.modeOfTransportId.includes(String(opt.value)),
            );
          }, [transportOptions, employeeEntitlement]);

          const filteredHotelOptions = useMemo(() => {
            if (
              !employeeEntitlement ||
              !employeeEntitlement.hotelEntitlementId ||
              !Array.isArray(employeeEntitlement.hotelEntitlementId) ||
              employeeEntitlement.hotelEntitlementId.length === 0
            )
              return hotelOptions;
            return hotelOptions.filter((opt) =>
              employeeEntitlement.hotelEntitlementId.includes(
                String(opt.value),
              ),
            );
          }, [hotelOptions, employeeEntitlement]);

          const isPolicyDefined = !!employeeEntitlement && !isReadOnly;
          const hasEntitlement = !!employeeEntitlement;
          const isFormDisabled = !isPolicyDefined || !!isReadOnly;

          return (
            <Form className="form form-label-right">
              {/* Travel Details Heading and Header Fields */}
              <div className="mb-6">
                <h6 className="text-primary font-bold mb-3">
                  {modeText} Travel Request
                </h6>
                {/* No Tada Policy Warning */}
                {!hasEntitlement && actionsLoading === false && !isReadOnly && (
                  <div className=" text-danger py-1 rounded relative text-xs font-normal">
                    <span className="block sm:inline ">
                      Policy is not defined for selected employee
                    </span>
                  </div>
                )}

                {/* Workflow policy warnings */}
                {empAuthorityList &&
                empAuthorityList?.length === 0 &&
                !isPolicyExists ? (
                  <div className=" text-danger py-1 rounded relative text-xs font-normal">
                    <span>
                      Designation workflow policy does not exist for this
                      employee.
                    </span>
                  </div>
                ) : (
                  empAuthorityList &&
                  empAuthorityList?.length === 0 &&
                  isPolicyExists && (
                    <div className=" text-danger py-1 rounded relative text-xs font-normal">
                      <span>
                        Workflow Policy is defined but there are no Workflow
                        Authorities as per the policy.
                      </span>
                    </div>
                  )
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-between">
                    <h6 className="text-primary font-bold m-0 text-end">
                      Travel Details
                    </h6>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm flex items-center gap-2 ml-4"
                      onClick={handleEntitlementClick}
                      disabled={!effectiveEmployeeId}
                    >
                      <FileText className="w-4 h-4" />
                      Entitlement Detail
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Close (Cross) Button */}
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
                <div className="grid grid-cols-12 gap-x-3 mb-4">
                  <div className="col-span-2">
                    <label>
                      Travel Type <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      name="travelTypeId"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      disabled={!isPolicyDefined}
                    >
                      <option value="">Select</option>
                      {travelTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Field>
                    {errors.travelTypeId && touched.travelTypeId && (
                      <div className="form-feedBack">{errors.travelTypeId}</div>
                    )}
                  </div>
                  <div className="col-span-6">
                    <label>
                      Purpose of Travel <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="purposeOfTravel"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      placeholder="Purpose of Travel"
                      disabled={!isPolicyDefined}
                    />
                    {errors.purposeOfTravel && touched.purposeOfTravel && (
                      <div className="form-feedBack">
                        {errors.purposeOfTravel}
                      </div>
                    )}
                  </div>
                  {/* <div className="col-span-2">
                    <label>
                      Project Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="projectName"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      placeholder="Project Name"
                      disabled={!isPolicyDefined}
                    />
                    {errors.projectName && touched.projectName && (
                      <div className="form-feedBack">{errors.projectName}</div>
                    )}
                  </div> */}
                </div>
              </div>

              {/* Travel Segments (FieldArray) */}
              <div className="w-full">
                <FieldArray name="travelSegments">
                  {(arrayHelpers) => (
                    <>
                      {errors.travelSegments &&
                        typeof errors.travelSegments === "string" && (
                          <div className="form-feedBack mb-2">
                            {errors.travelSegments}
                          </div>
                        )}
                      {!isReadOnly && (
                        <div className="flex justify-end items-center mb-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!isPolicyDefined}
                            onClick={() => {
                              const segments = [...values.travelSegments];
                              const lastIndex = segments.length - 1;
                              const originLocation =
                                segments[0]?.fromLocation || "";

                              // 1. Clear the toLocation of the previous last row
                              // so the user can select an intermediate destination
                              setFieldValue(
                                `travelSegments.${lastIndex}.toLocation`,
                                "",
                              );

                              // 2. Add new row with current chaining logic:
                              // fromLocation = cleared to allow user to pick next leg
                              // toLocation = origin (forcing round trip to be the end)
                              arrayHelpers.push({
                                fromLocation: "",
                                toLocation: originLocation,
                                fromDate: null,
                                toDate: null,
                                modeOfTravel: segments[0]?.modeOfTravel || "",
                                classOfTravel: "",
                                accommodationRequired: false,
                                hotelEntitlement: "",
                                hotelEntitlementAmount: 0,
                                selfEntitlement: false,
                                selfAmount: 0,
                              });
                            }}
                          >
                            <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                            Add
                          </button>
                        </div>
                      )}
                      <div
                        className="react-bootstrap-table table-responsive"
                        style={{ overflowX: "auto" }}
                      >
                        <table className="table table-head-custom table-vertical-center table-hover">
                          <thead className="custom-table-header">
                            <tr>
                              <td style={{ minWidth: "120px" }}>
                                From Location{" "}
                                <span className="text-danger">*</span>
                              </td>
                              <td style={{ minWidth: "120px" }}>
                                To Location{" "}
                                <span className="text-danger">*</span>
                              </td>
                              <td style={{ minWidth: "100px" }}>
                                From Date <span className="text-danger">*</span>
                              </td>
                              <td style={{ minWidth: "100px" }}>
                                To Date <span className="text-danger">*</span>
                              </td>
                              <td style={{ minWidth: "120px" }}>
                                Mode of Travel{" "}
                                <span className="text-danger">*</span>
                              </td>
                              <td style={{ minWidth: "120px" }}>
                                Class of Travel{" "}
                              </td>
                              <td style={{ minWidth: "120px" }}>
                                Accommodation Required
                              </td>

                              {/* Dynamic Accommodation Headers */}
                              <td style={{ minWidth: "150px" }}>
                                Hotel Entitlement
                              </td>
                              {/* <td style={{ minWidth: "120px" }}>
                                Hotel Entitlement Amount
                              </td> */}
                              {employeeEntitlement?.ishotelEntitlementSelfAmountWise && (
                                <>
                                  <td style={{ minWidth: "120 px" }}>
                                    Self Entitlement
                                  </td>
                                  <td style={{ minWidth: "100px" }}>
                                    Self Amount
                                    {employeeEntitlement?.hotelEntitlementSelfAmount && (
                                      <span
                                        className="text-muted font-normal block"
                                        style={{ fontSize: "10px" }}
                                      >
                                        (Limit=
                                        {
                                          employeeEntitlement.hotelEntitlementSelfAmount
                                        }
                                        )
                                      </span>
                                    )}
                                  </td>
                                </>
                              )}
                              <td style={{ minWidth: "40px" }}></td>
                            </tr>
                          </thead>
                          <tbody>
                            {values.travelSegments.map((segment, index) => (
                              <tr key={index}>
                                <td>
                                  <Field
                                    as="select"
                                    name={`travelSegments.${index}.fromLocation`}
                                    className="form-control"
                                    disabled={!isPolicyDefined}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue(
                                        `travelSegments.${index}.fromLocation`,
                                        val,
                                      );
                                      // Scalable Logic: First row fromLocation is the final return destination
                                      if (
                                        index === 0 &&
                                        values.travelSegments.length > 1
                                      ) {
                                        setFieldValue(
                                          `travelSegments.${values
                                            .travelSegments.length -
                                            1}.toLocation`,
                                          val,
                                        );
                                      }
                                    }}
                                  >
                                    <option value="">Select</option>
                                    {locationOptions.map((opt) => (
                                      <option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={
                                          opt.value == segment.toLocation
                                        }
                                      >
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.travelSegments?.[index]
                                    ?.fromLocation &&
                                    touched.travelSegments?.[index]
                                      ?.fromLocation && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {
                                          errors.travelSegments[index]
                                            .fromLocation
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <Field
                                    as="select"
                                    name={`travelSegments.${index}.toLocation`}
                                    className="form-control"
                                    disabled={
                                      !isPolicyDefined ||
                                      (values.travelSegments.length > 1 &&
                                        index ===
                                          values.travelSegments.length - 1)
                                    }
                                    style={
                                      values.travelSegments.length > 1 &&
                                      index === values.travelSegments.length - 1
                                        ? { backgroundColor: "#f3f6f9" }
                                        : {}
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue(
                                        `travelSegments.${index}.toLocation`,
                                        val,
                                      );
                                      // Scalable Logic: current toLocation is the next row's fromLocation
                                      if (
                                        index <
                                        values.travelSegments.length - 1
                                      ) {
                                        setFieldValue(
                                          `travelSegments.${index +
                                            1}.fromLocation`,
                                          val,
                                        );
                                      }
                                    }}
                                  >
                                    <option value="">Select</option>
                                    {locationOptions.map((opt) => (
                                      <option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={
                                          opt.value == segment.fromLocation
                                        }
                                      >
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.travelSegments?.[index]?.toLocation &&
                                    touched.travelSegments?.[index]
                                      ?.toLocation && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {
                                          errors.travelSegments[index]
                                            .toLocation
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    disabled={!isPolicyDefined}
                                    selected={
                                      segment.fromDate
                                        ? new Date(segment.fromDate)
                                        : null
                                    }
                                    onChange={(val) =>
                                      setFieldValue(
                                        `travelSegments.${index}.fromDate`,
                                        val,
                                      )
                                    }
                                    dateFormat="dd-MMM-yyyy"
                                    name={`travelSegments.${index}.fromDate`}
                                    autoComplete="off"
                                    placeholderText="Select Date"
                                    popperClassName="z-[9999]"
                                    popperPlacement="bottom"
                                    minDate={
                                      index > 0 &&
                                      values.travelSegments[index - 1]?.toDate
                                        ? new Date(
                                            values.travelSegments[
                                              index - 1
                                            ].toDate,
                                          )
                                        : null
                                    }
                                  />
                                  {errors.travelSegments?.[index]?.fromDate &&
                                    touched.travelSegments?.[index]
                                      ?.fromDate && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {errors.travelSegments[index].fromDate}
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    disabled={!isPolicyDefined}
                                    selected={
                                      segment.toDate
                                        ? new Date(segment.toDate)
                                        : null
                                    }
                                    onChange={(val) => {
                                      setFieldValue(
                                        `travelSegments.${index}.toDate`,
                                        val,
                                      );
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`travelSegments.${index}.toDate`}
                                    autoComplete="off"
                                    placeholderText="Select Date"
                                    popperClassName="z-[9999]"
                                    popperPlacement="bottom"
                                    minDate={
                                      segment.fromDate
                                        ? new Date(segment.fromDate)
                                        : null
                                    }
                                  />
                                  {errors.travelSegments?.[index]?.toDate &&
                                    touched.travelSegments?.[index]?.toDate && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {errors.travelSegments[index].toDate}
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <Field
                                    as="select"
                                    name={`travelSegments.${index}.modeOfTravel`}
                                    className="form-control"
                                    disabled={!isPolicyDefined}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue(
                                        `travelSegments.${index}.modeOfTravel`,
                                        val,
                                      );
                                      if (
                                        index === 0 &&
                                        values.travelSegments.length > 1
                                      ) {
                                        for (
                                          let i = 1;
                                          i < values.travelSegments.length;
                                          i++
                                        ) {
                                          setFieldValue(
                                            `travelSegments.${i}.modeOfTravel`,
                                            val,
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    <option value="">Select</option>
                                    {filteredTransportOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.travelSegments?.[index]
                                    ?.modeOfTravel &&
                                    touched.travelSegments?.[index]
                                      ?.modeOfTravel && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {
                                          errors.travelSegments[index]
                                            .modeOfTravel
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <Field
                                    as="select"
                                    name={`travelSegments.${index}.classOfTravel`}
                                    className="form-control"
                                    disabled={!isPolicyDefined}
                                  >
                                    <option value="">Select</option>
                                    {travelClassOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.travelSegments?.[index]
                                    ?.classOfTravel &&
                                    touched.travelSegments?.[index]
                                      ?.classOfTravel && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {
                                          errors.travelSegments[index]
                                            .classOfTravel
                                        }
                                      </div>
                                    )}
                                </td>
                                <td className="text-center align-middle">
                                  <div className="flex justify-center items-center h-full">
                                    <Checkbox
                                      disabled={
                                        !isPolicyDefined ||
                                        (values.travelSegments.length > 1 &&
                                          index ===
                                            values.travelSegments.length - 1)
                                      }
                                      isSelected={segment.accommodationRequired}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFieldValue(
                                          `travelSegments.${index}.accommodationRequired`,
                                          checked,
                                        );
                                        if (!checked) {
                                          setFieldValue(
                                            `travelSegments.${index}.hotelEntitlement`,
                                            "",
                                          );
                                          setFieldValue(
                                            `travelSegments.${index}.hotelEntitlementAmount`,
                                            0,
                                          );
                                          setFieldValue(
                                            `travelSegments.${index}.selfEntitlement`,
                                            false,
                                          );
                                          setFieldValue(
                                            `travelSegments.${index}.selfAmount`,
                                            0,
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </td>

                                {/* Conditional Fields per row */}
                                <td
                                  style={{
                                    opacity:
                                      !segment.accommodationRequired ||
                                      segment.selfEntitlement ||
                                      (values.travelSegments.length > 1 &&
                                        index ===
                                          values.travelSegments.length - 1)
                                        ? 0.4
                                        : 1,
                                  }}
                                >
                                  <Field
                                    as="select"
                                    name={`travelSegments.${index}.hotelEntitlement`}
                                    className="form-control"
                                    disabled={
                                      !segment.accommodationRequired ||
                                      segment.selfEntitlement ||
                                      !isPolicyDefined ||
                                      (values.travelSegments.length > 1 &&
                                        index ===
                                          values.travelSegments.length - 1)
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue(
                                        `travelSegments.${index}.hotelEntitlement`,
                                        val,
                                      );
                                      if (val) {
                                        setFieldValue(
                                          `travelSegments.${index}.selfEntitlement`,
                                          false,
                                        );
                                        setFieldValue(
                                          `travelSegments.${index}.selfAmount`,
                                          0,
                                        );
                                      }
                                    }}
                                  >
                                    <option value="">Select</option>
                                    {filteredHotelOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.travelSegments?.[index]
                                    ?.hotelEntitlement &&
                                    touched.travelSegments?.[index]
                                      ?.hotelEntitlement && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {
                                          errors.travelSegments[index]
                                            .hotelEntitlement
                                        }
                                      </div>
                                    )}
                                </td>
                                {/* <td
                                  style={{
                                    opacity:
                                      !segment.accommodationRequired ||
                                      !segment.hotelEntitlement ||
                                      segment.selfEntitlement ||
                                      (values.travelSegments.length > 1 &&
                                        index ===
                                          values.travelSegments.length - 1)
                                        ? 0.4
                                        : 1,
                                  }}
                                >
                                  <NumericFormat
                                    name={`travelSegments.${index}.hotelEntitlementAmount`}
                                    className="form-control"
                                    placeholder="0"
                                    thousandSeparator
                                    allowNegative={false}
                                    isAllowed={({ value }) => value.length <= 9}
                                    disabled={
                                      !segment.accommodationRequired ||
                                      !segment.hotelEntitlement ||
                                      segment.selfEntitlement ||
                                      !isPolicyDefined ||
                                      (values.travelSegments.length > 1 &&
                                        index ===
                                          values.travelSegments.length - 1)
                                    }
                                    value={
                                      !segment.accommodationRequired ||
                                      !segment.hotelEntitlement ||
                                      segment.selfEntitlement
                                        ? ""
                                        : segment.hotelEntitlementAmount
                                    }
                                    onValueChange={(valuesObj) => {
                                      setFieldValue(
                                        `travelSegments.${index}.hotelEntitlementAmount`,
                                        valuesObj.value,
                                      );
                                    }}
                                    onBlur={() =>
                                      setFieldTouched(
                                        `travelSegments.${index}.hotelEntitlementAmount`,
                                        true,
                                      )
                                    }
                                  />
                                  {errors.travelSegments?.[index]
                                    ?.hotelEntitlementAmount &&
                                    touched.travelSegments?.[index]
                                      ?.hotelEntitlementAmount && (
                                      <div className="form-feedBack text-xs mt-1">
                                        {
                                          errors.travelSegments[index]
                                            .hotelEntitlementAmount
                                        }
                                      </div>
                                    )}
                                </td> */}
                                {employeeEntitlement?.ishotelEntitlementSelfAmountWise && (
                                  <>
                                    <td className="text-center align-middle">
                                      <div
                                        className="flex justify-center items-center h-full"
                                        style={{
                                          opacity:
                                            !segment.accommodationRequired ||
                                            segment.hotelEntitlement ||
                                            (values.travelSegments.length > 1 &&
                                              index ===
                                                values.travelSegments.length -
                                                  1)
                                              ? 0.4
                                              : 1,
                                        }}
                                      >
                                        <Checkbox
                                          disabled={
                                            !segment.accommodationRequired ||
                                            !!segment.hotelEntitlement ||
                                            !isPolicyDefined ||
                                            !employeeEntitlement?.ishotelEntitlementSelfAmountWise ||
                                            (values.travelSegments.length > 1 &&
                                              index ===
                                                values.travelSegments.length -
                                                  1)
                                          }
                                          isSelected={segment.selfEntitlement}
                                          onChange={(e) => {
                                            const checked = e.target.checked;
                                            setFieldValue(
                                              `travelSegments.${index}.selfEntitlement`,
                                              checked,
                                            );
                                            if (checked) {
                                              setFieldValue(
                                                `travelSegments.${index}.hotelEntitlement`,
                                                "",
                                              );
                                              setFieldValue(
                                                `travelSegments.${index}.hotelEntitlementAmount`,
                                                0,
                                              );
                                            } else {
                                              setFieldValue(
                                                `travelSegments.${index}.selfAmount`,
                                                0,
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        opacity:
                                          !segment.accommodationRequired ||
                                          !segment.selfEntitlement ||
                                          segment.hotelEntitlement ||
                                          (values.travelSegments.length > 1 &&
                                            index ===
                                              values.travelSegments.length - 1)
                                            ? 0.4
                                            : 1,
                                      }}
                                    >
                                      <NumericFormat
                                        name={`travelSegments.${index}.selfAmount`}
                                        className="form-control"
                                        placeholder="0"
                                        thousandSeparator
                                        allowNegative={false}
                                        isAllowed={({ value }) =>
                                          value.length <= 8
                                        }
                                        disabled={
                                          !segment.accommodationRequired ||
                                          !segment.selfEntitlement ||
                                          !!segment.hotelEntitlement ||
                                          !isPolicyDefined ||
                                          (values.travelSegments.length > 1 &&
                                            index ===
                                              values.travelSegments.length - 1)
                                        }
                                        value={
                                          !segment.accommodationRequired ||
                                          !segment.selfEntitlement ||
                                          !!segment.hotelEntitlement
                                            ? ""
                                            : segment.selfAmount
                                        }
                                        onValueChange={(valuesObj) => {
                                          setFieldValue(
                                            `travelSegments.${index}.selfAmount`,
                                            valuesObj.value,
                                          );
                                        }}
                                        onBlur={() =>
                                          setFieldTouched(
                                            `travelSegments.${index}.selfAmount`,
                                            true,
                                          )
                                        }
                                      />
                                      {errors.travelSegments?.[index]
                                        ?.selfAmount &&
                                        touched.travelSegments?.[index]
                                          ?.selfAmount && (
                                          <div className="form-feedBack text-xs mt-1">
                                            {
                                              errors.travelSegments[index]
                                                .selfAmount
                                            }
                                          </div>
                                        )}
                                    </td>
                                  </>
                                )}
                                <td className="text-center align-middle">
                                  {!isReadOnly && index >= 2 && (
                                    <button
                                      type="button"
                                      className="bg-transparent border-0 p-0"
                                      disabled={!isPolicyDefined}
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Daily Allowance, Taxi Fare, and Advance Request Section */}
              <div className="border-t pt-4">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-20 items-start">
                  {/* Daily Allowance */}
                  <div className="max-w-[500px] w-full">
                    <h6 className="font-bold text-primary mb-2">
                      Daily Allowance
                    </h6>
                    <div className="grid grid-cols-3 gap-x-2">
                      <div>
                        <label className=" mb-1 flex items-center gap-1">
                          Rate <span className="text-danger">*</span>
                          {employeeEntitlement?.dailyAllowanceAmount && (
                            <span className="text-muted font-normal ml-1">
                              (Limit ={" "}
                              {employeeEntitlement.dailyAllowanceAmount})
                            </span>
                          )}
                        </label>
                        <NumericFormat
                          name="dailyAllowanceRate"
                          className="form-control text-sm bg-light"
                          placeholder="0"
                          thousandSeparator
                          allowNegative={false}
                          isAllowed={({ value }) => value.length <= 6}
                          disabled={true}
                          value={values.dailyAllowanceRate}
                          onValueChange={(valuesObj) => {
                            setFieldValue(
                              "dailyAllowanceRate",
                              valuesObj.value,
                            );
                          }}
                        />
                        {errors.dailyAllowanceRate &&
                          touched.dailyAllowanceRate && (
                            <div className="form-feedBack text-xs mt-1">
                              {errors.dailyAllowanceRate}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="block mb-1">
                          Days <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          name="dailyAllowanceDays"
                          className="form-control text-sm bg-light"
                          placeholder="0"
                          min="0"
                          disabled={true}
                          onInput={(e) => {
                            e.target.value = e.target.value.slice(0, 3);
                          }}
                        />
                        {errors.dailyAllowanceDays &&
                          touched.dailyAllowanceDays && (
                            <div className="form-feedBack text-xs mt-1">
                              {errors.dailyAllowanceDays}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="block mb-1">Amount</label>
                        <NumericFormat
                          name="dailyAllowanceAmount"
                          className="form-control text-sm bg-light"
                          placeholder="0"
                          thousandSeparator
                          allowNegative={false}
                          disabled={true}
                          value={values.dailyAllowanceAmount}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Taxi Fare */}
                  <div className="max-w-36">
                    <h6 className="font-bold text-primary mb-2">
                      Taxi Fare per KM
                    </h6>
                    <div>
                      <label className="block mb-1">Rate</label>
                      <NumericFormat
                        name="taxiFareRate"
                        className="form-control text-sm"
                        placeholder="0"
                        thousandSeparator
                        allowNegative={false}
                        disabled={true}
                        value={values.taxiFareRate}
                      />
                    </div>
                  </div>
                </div>

                {/* Advance Request Section */}
                <div className="mt-4">
                  <h6 className="font-bold text-primary mb-2">
                    Advance Request
                  </h6>
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex items-center lg:pt-8">
                      <Checkbox
                        disabled={isFormDisabled}
                        isSelected={values.advanceRequested}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFieldValue("advanceRequested", checked);
                          if (!checked) {
                            setFieldValue("advanceAmount", 0);
                            setFieldValue("advanceRemarks", "");
                          }
                        }}
                      />
                      <label className="ml-2 mb-0">Advance Required</label>
                    </div>

                    <div className="max-w-32 w-full">
                      <label className="block mb-1">
                        Amount{" "}
                        {values.advanceRequested && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      <NumericFormat
                        name="advanceAmount"
                        className="form-control text-sm"
                        style={{ backgroundColor: "#eefbff" }}
                        placeholder="0"
                        thousandSeparator
                        allowNegative={false}
                        isAllowed={({ value }) => value.length <= 9}
                        disabled={isFormDisabled || !values.advanceRequested}
                        value={values.advanceAmount}
                        onValueChange={(valuesObj) => {
                          setFieldValue("advanceAmount", valuesObj.value);
                        }}
                        onBlur={() => setFieldTouched("advanceAmount", true)}
                      />
                      {errors.advanceAmount && touched.advanceAmount && (
                        <div className="form-feedBack text-xs mt-1">
                          {errors.advanceAmount}
                        </div>
                      )}
                    </div>

                    <div className="max-w-[500px] w-full">
                      <label className="block mb-1">
                        Advance Request Remarks{" "}
                        {values.advanceRequested && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      <Field
                        as="textarea"
                        name="advanceRemarks"
                        className="form-control"
                        style={{ backgroundColor: "#eefbff", height: "38px" }}
                        rows="1"
                        placeholder="Enter advance remarks..."
                        maxLength={500}
                        disabled={isFormDisabled || !values.advanceRequested}
                      />
                      {errors.advanceRemarks && touched.advanceRemarks && (
                        <div className="form-feedBack text-xs mt-1">
                          {errors.advanceRemarks}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-3 mt-4">
                  <div className="col-span-6">
                    <label>Remarks</label>
                    <Field
                      as="textarea"
                      name="travelRemarks"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      rows="3"
                      placeholder="Enter travel remarks..."
                      maxLength={500}
                      disabled={!isPolicyDefined}
                    />
                    {errors.travelRemarks && touched.travelRemarks && (
                      <div className="form-feedBack text-xs mt-1">
                        {errors.travelRemarks}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-4 border-t pt-4 flex justify-end gap-x-3">
                <button
                  type="button"
                  className="btn btn-light btn-sm font-bold px-6"
                  onClick={onCancel}
                >
                  {isReadOnly ? "Close" : "Cancel"}
                </button>
                {!isReadOnly && hasEntitlement && (
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm font-bold px-8"
                    disabled={isFormDisabled}
                  >
                    Save
                  </button>
                )}
              </div>
            </Form>
          );
        }}
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
          {employeeEntitlement ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-3">
              <div>
                <label className="text-xs font-medium mb-1">
                  Mode of Transport :{" "}
                  <span className="text-xs">
                    {employeeEntitlement.ModeOfTransports?.length > 0
                      ? employeeEntitlement.ModeOfTransports.map(
                          (m) => m.formName || m.name || m.label,
                        ).join(", ")
                      : transportOptions
                          .filter((opt) =>
                            employeeEntitlement.modeOfTransportId?.includes(
                              String(opt.value),
                            ),
                          )
                          .map((o) => o.label)
                          .join(", ") || "N/A"}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Hotel Entitlement :{" "}
                  <span className="text-xs">
                    {employeeEntitlement.HotelEntitlements?.length > 0
                      ? employeeEntitlement.HotelEntitlements.map(
                          (h) => h.formName || h.name || h.label,
                        ).join(", ")
                      : hotelOptions
                          .filter((opt) =>
                            employeeEntitlement.hotelEntitlementId?.includes(
                              String(opt.value),
                            ),
                          )
                          .map((o) => o.label)
                          .join(", ") || "N/A"}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Allow Self Entitlement :{" "}
                  <span className="text-xs">
                    {employeeEntitlement.ishotelEntitlementSelfAmountWise
                      ? "Yes"
                      : "No"}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Self Amount :{" "}
                  <span className="text-xs">
                    Rs.{" "}
                    {(
                      employeeEntitlement.hotelEntitlementSelfAmount || 0
                    ).toLocaleString("en-US")}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Daily Allowance Rate :{" "}
                  <span className="text-xs">
                    Rs.{" "}
                    {(
                      employeeEntitlement.dailyAllowanceAmount || 0
                    ).toLocaleString("en-US")}
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1">
                  Taxi Fare (per km) :{" "}
                  <span className="text-xs">
                    Rs.{" "}
                    {(employeeEntitlement.taxiFareAmount || 0).toLocaleString(
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
    </div>
  );
}
