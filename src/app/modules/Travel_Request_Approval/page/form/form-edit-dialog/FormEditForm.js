/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux/redux-Actions";
import { fetchTadaConfigByEmployeeId } from "../../../redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Checkbox,
} from "../../../../../../_metronic/_partials/controls";
import DatePicker from "react-datepicker";
import {
  Plus,
  Trash2,
  CirclePlus,
  CircleMinus,
  Calendar,
  FileText,
  XCircle,
} from "lucide-react";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { NumericFormat } from "react-number-format";
import { Modal, Accordion, Button, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

export function FormEditForm({
  employeeId,
  employeeDetails,
  onCancel,
  saveForm,
  onHide,
  disableLoading,
  user,
  isReadOnly,
}) {
  const dispatch = useDispatch();
  const [activeTicketKey, setActiveTicketKey] = React.useState("0");
  const [activeHotelKey, setActiveHotelKey] = React.useState(null);
  const [showEntitlementModal, setShowEntitlementModal] = React.useState(false);
  const isApprovingRef = React.useRef(false);
  const { dashboard, employeeEntitlement, auth, workflowRecord } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      employeeEntitlement: state.travel_approval?.employeeEntitlement,
      auth: state.auth,
      workflowRecord: state.travel_approval?.workflowRecord,
    }),
    shallowEqual,
  );

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

  const isRoleTravelApprover = useMemo(() => {
    const roleId = String(auth?.user?.roleId || "").trim();
    const preApprover = employeeEntitlement?.preApprover;

    if (!roleId || !preApprover) return false;

    const preApproverIds = Array.isArray(preApprover)
      ? preApprover.map((id) => String(id).trim())
      : String(preApprover)
          .split(",")
          .map((id) => id.trim());

    return preApproverIds.includes(roleId);
  }, [auth?.user?.roleId, employeeEntitlement?.preApprover]);

  const effectiveEmployeeId = employeeId || user?.employeeId;
  console.log("emp", employeeId, user?.employeeId);

  React.useEffect(() => {
    if (effectiveEmployeeId) {
      dispatch(fetchTadaConfigByEmployeeId(effectiveEmployeeId));
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
    travelRemarks: Yup.string().required(VALIDATION_MESSAGES.required),
    taxiFareRate: Yup.number().nullable(),
  });

  // Combined Template logic for create/edit
  const initialValues = useMemo(() => {
    if (user && (user.Id || user.id)) {
      const segments = user.Master || user.Masters || [];
      const journeyDetails =
        user.JourneyDetail || user.JourneyDetails || user.JourneyDetails || [];
      const hotelDetailsData =
        user.TravelHotelDetail ||
        user.TravelHotelDetails ||
        user.TravelHotelDetails ||
        [];

      const mappedSegments = segments.map((m) => ({
        childMasterId: m.childMasterId || m.Id || m.id,
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
      }));

      return {
        ...user,
        projectName: user.projectName || "General",
        advanceRequested: user.advanceRequired,
        dailyAllowanceDays: Math.floor(user.dailyAllowanceDay || 0),
        travelSegments: mappedSegments,
        addTicketInfo: user.addTicketInfo || false,
        ticketDetails: mappedSegments.map((seg) => {
          const t = journeyDetails.find(
            (jd) =>
              String(jd.childMasterId) === String(seg.childMasterId || seg.Id),
          );
          const parseStr = (v) =>
            v !== null && v !== undefined && v !== "0" && v !== 0
              ? String(v)
              : "";
          return {
            childMasterId: seg.childMasterId || seg.Id,
            fromLocation: parseStr(t?.fromLocation),
            toLocation: parseStr(t?.toLocation),
            flightName: parseStr(t?.flightName),
            description: parseStr(t?.description),
            ticketNumber: parseStr(t?.ticketNumber),
            ticketDetail: parseStr(t?.ticketdetail),
            ticketAmount: t?.ticketamount ?? "",
            isTicketEnabled: t?.isticket || false,
            noTicketReason: parseStr(t?.noTicketReason),
          };
        }),
        hotelDetails: mappedSegments.map((seg) => {
          const h = hotelDetailsData.find(
            (hd) =>
              String(hd.childMasterId) === String(seg.childMasterId || seg.Id),
          );
          const parseStr = (v) =>
            v !== null && v !== undefined && v !== "0" && v !== 0
              ? String(v)
              : "";
          return {
            childMasterId: seg.childMasterId || seg.Id,
            hotelName: parseStr(h?.hotelName),
            description: parseStr(h?.description),
            roomNumber: parseStr(h?.roomNumber),
            roomType: parseStr(h?.roomType) || parseStr(h?.roomtype),
            amount:
              h?.amount != null && h?.amount !== 0 && h?.amount !== "0"
                ? h.amount
                : "",
          };
        }),
        travelRemarks: user.travelRequestRemarks || "",
      };
    }

    const segmentTemplate = {
      childMasterId: 0,
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

    const ticketDetailTemplate = {
      fromLocation: "",
      toLocation: "",
      flightName: "",
      description: "",
      ticketNumber: "",
      ticketDetail: "",
      ticketAmount: "",
      isTicketEnabled: false,
      noTicketReason: "",
    };

    const hotelDetailTemplate = {
      childMasterId: 0,
      hotelName: "",
      description: "",
      roomNumber: "",
      roomType: "",
      amount: "",
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
      ticketDetails: [{ ...ticketDetailTemplate }],
      hotelDetails: [{ ...hotelDetailTemplate }],
      addTicketInfo: false,
      travelRemarks: "",
      request_status: "A",
    };
  }, [user, employeeId]);

  return (
    <div className="mt-4">
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={formValidation}
        onSubmit={(values) => {
          if (saveForm) {
            saveForm({ ...values, isApproving: isApprovingRef.current });
          }
          isApprovingRef.current = false; // reset after every submission
        }}
      >
        {({
          isSubmitting,
          values,
          setFieldValue,
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
              <div className="mb-6">
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
                    <label className="font-bold mb-1 opacity-70">
                      Travel Type:
                      <span className="font-normal">
                        {" "}
                        {travelTypeOptions.find(
                          (opt) =>
                            String(opt.value) === String(values.travelTypeId),
                        )?.label ||
                          values.travelType ||
                          "-"}
                      </span>
                    </label>
                  </div>
                  <div className="col-span-6">
                    <label className="font-bold mb-1 opacity-70">
                      Purpose of Travel:
                      <span className="font-normal">
                        {" "}
                        {values.purposeOfTravel || "-"}
                      </span>
                    </label>
                  </div>
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
                              <td style={{ minWidth: "60px" }}>
                                Accommodation Required
                              </td>

                              {/* Dynamic Accommodation Headers */}
                              <td style={{ minWidth: "150px" }}>
                                Hotel Entitlement
                              </td>
                              {employeeEntitlement?.ishotelEntitlementSelfAmountWise && (
                                <>
                                  <td style={{ minWidth: "80px" }}>
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
                                    disabled={true}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue(
                                        `travelSegments.${index}.fromLocation`,
                                        val,
                                      );
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
                                    disabled={true}
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
                                          // Clear corresponding hotel details row data
                                          setFieldValue(
                                            `hotelDetails.${index}.hotelName`,
                                            "",
                                          );
                                          setFieldValue(
                                            `hotelDetails.${index}.description`,
                                            "",
                                          );
                                          setFieldValue(
                                            `hotelDetails.${index}.roomNumber`,
                                            "",
                                          );
                                          setFieldValue(
                                            `hotelDetails.${index}.roomType`,
                                            "",
                                          );
                                          setFieldValue(
                                            `hotelDetails.${index}.amount`,
                                            "",
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
                                {employeeEntitlement?.ishotelEntitlementSelfAmountWise && (
                                  <td className="text-center align-middle">
                                    <div
                                      className="flex justify-center items-center h-full"
                                      style={{
                                        opacity:
                                          !segment.accommodationRequired ||
                                          segment.hotelEntitlement ||
                                          (values.travelSegments.length > 1 &&
                                            index ===
                                              values.travelSegments.length - 1)
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
                                              values.travelSegments.length - 1)
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
                                )}
                                {employeeEntitlement?.ishotelEntitlementSelfAmountWise && (
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
                                        value.length <= 9
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
                                )}
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
                <div className="flex flex-col lg:flex-row gap-8 justify-between">
                  {/* Daily Allowance */}
                  <div className="max-w-[400px]">
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
                          className="form-control text-sm"
                          style={{ backgroundColor: "#eefbff" }}
                          placeholder="0"
                          thousandSeparator
                          allowNegative={false}
                          isAllowed={({ value }) => value.length <= 6}
                          disabled={!isPolicyDefined}
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
                        <label className=" block mb-1">
                          Days <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          name="dailyAllowanceDays"
                          className="form-control text-sm"
                          style={{ backgroundColor: "#eefbff" }}
                          placeholder="0"
                          min="0"
                          disabled={!isPolicyDefined || !!isReadOnly}
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
                        <label className=" block mb-1">Amount</label>
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
                  <div className="max-w-32">
                    <h6 className="font-bold text-primary mb-2">Taxi Fare</h6>
                    <div>
                      <label className="block mb-1">Rate</label>
                      <NumericFormat
                        name="taxiFareRate"
                        className="form-control text-sm"
                        placeholder="0"
                        thousandSeparator
                        allowNegative={false}
                        isAllowed={({ value }) => value.length <= 6}
                        disabled={true}
                        value={values.taxiFareRate}
                      />
                    </div>
                  </div>

                  {/* Advance Request Section */}
                  <div className="max-w-[300px] mr-8 ">
                    <div className="flex items-center mb-2">
                      <h6 className="font-bold text-primary mr-3 mb-0">
                        Advance Request
                      </h6>
                      <div className="flex items-center">
                        <label className="ml-16 mr-2 mb-0">
                          Advance Required
                        </label>
                        <Checkbox
                          disabled={true}
                          isSelected={values.advanceRequested}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-x-3 items-end">
                      {/* Amount */}
                      <div className="col-span-2">
                        <label className=" block mb-1">
                          Amount
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
                          disabled={true}
                          value={values.advanceAmount}
                        />
                        {errors.advanceAmount && touched.advanceAmount && (
                          <div className="form-feedBack text-xs mt-1">
                            {errors.advanceAmount}
                          </div>
                        )}
                      </div>
                      {/* Advance Remarks */}
                      <div className="col-span-4">
                        <label className="font-bold mb-1 opacity-70">
                          Advance Request Remarks:
                          <span className="font-normal">
                            {" "}
                            {values.advanceRemarks || "-"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-3 mt-4 mb-8">
                  <div className="col-span-6">
                    <label className="font-bold mb-1 opacity-70">
                      Applicant Remarks:{" "}
                      <span className="font-normal">
                        {values.travelRemarks || "-"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Travel Journey details */}
                <div className="w-full">
                  <Accordion
                    activeKey={activeTicketKey}
                    onSelect={(key) => setActiveTicketKey(key)}
                  >
                    <Card>
                      <Card.Header className="d-flex justify-content-center p-0">
                        <div className="accordion-header-btn w-100 d-flex bg-tsecondary">
                          <Accordion.Toggle
                            as={Button}
                            eventKey="0"
                            className="flex justify-start text-bold w-full"
                          >
                            {activeTicketKey === "0" ? (
                              <CircleMinus className="h-4 w-4 text-black mr-1" />
                            ) : (
                              <CirclePlus className="h-4 w-4 text-black mr-1" />
                            )}
                            <span className="text-black font-bold">
                              Ticket Details
                            </span>
                          </Accordion.Toggle>
                        </div>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body className="p-3">
                          <FieldArray name="ticketDetails">
                            {(arrayHelpers) => (
                              <>
                                {errors.ticketDetails &&
                                  typeof errors.ticketDetails === "string" && (
                                    <div className="form-feedBack mb-2">
                                      {errors.ticketDetails}
                                    </div>
                                  )}

                                <div
                                  className="react-bootstrap-table table-responsive"
                                  style={{ overflowX: "auto" }}
                                >
                                  <table className="table table-head-custom table-vertical-center table-hover">
                                    <thead className="custom-table-header">
                                      <tr>
                                        <td style={{ minWidth: "150px" }}>
                                          Location
                                        </td>
                                        <td style={{ minWidth: "40px" }}></td>
                                        <td style={{ minWidth: "100px" }}>
                                          Name
                                        </td>
                                        <td style={{ minWidth: "100px" }}>
                                          Description
                                        </td>
                                        <td style={{ minWidth: "120px" }}>
                                          Ticket Number
                                        </td>
                                        <td style={{ minWidth: "120px" }}>
                                          Ticket Detail
                                        </td>
                                        <td style={{ minWidth: "80px" }}>
                                          Ticket Amount
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {values.travelSegments.map(
                                        (segment, index) => {
                                          const ticket =
                                            values.ticketDetails?.[index] || {};
                                          const fromLabel =
                                            locationOptions.find(
                                              (opt) =>
                                                String(opt.value) ===
                                                String(segment.fromLocation),
                                            )?.label || "-";
                                          const toLabel =
                                            locationOptions.find(
                                              (opt) =>
                                                String(opt.value) ===
                                                String(segment.toLocation),
                                            )?.label || "-";
                                          const isRowEnabled =
                                            ticket.isTicketEnabled || false;

                                          return (
                                            <tr key={index}>
                                              {/* Location Text */}
                                              <td className="align-middle">
                                                <span
                                                  className="font-bold opacity-70"
                                                  style={{
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {fromLabel} -&#62; {toLabel}
                                                </span>
                                              </td>
                                              {/* Enable Checkbox */}
                                              <td className="text-center align-middle">
                                                <Checkbox
                                                  isSelected={isRowEnabled}
                                                  onChange={(e) => {
                                                    const checked =
                                                      e.target.checked;
                                                    setFieldValue(
                                                      `ticketDetails.${index}.isTicketEnabled`,
                                                      checked,
                                                    );
                                                    if (!checked) {
                                                      setFieldValue(
                                                        `ticketDetails.${index}.flightName`,
                                                        "",
                                                      );
                                                      setFieldValue(
                                                        `ticketDetails.${index}.description`,
                                                        "",
                                                      );
                                                      setFieldValue(
                                                        `ticketDetails.${index}.ticketNumber`,
                                                        "",
                                                      );
                                                      setFieldValue(
                                                        `ticketDetails.${index}.ticketDetail`,
                                                        "",
                                                      );
                                                      setFieldValue(
                                                        `ticketDetails.${index}.ticketAmount`,
                                                        "",
                                                      );
                                                    }
                                                  }}
                                                  disabled={isReadOnly}
                                                />
                                              </td>
                                              {/* Flight Name */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`ticketDetails.${index}.flightName`}
                                                  className="form-control"
                                                  placeholder="Name"
                                                  maxLength={50}
                                                  disabled={
                                                    isReadOnly || !isRowEnabled
                                                  }
                                                />
                                                {errors.ticketDetails?.[index]
                                                  ?.flightName &&
                                                  touched.ticketDetails?.[index]
                                                    ?.flightName && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.ticketDetails[
                                                          index
                                                        ].flightName
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Description */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`ticketDetails.${index}.description`}
                                                  className="form-control"
                                                  placeholder="Description"
                                                  maxLength={200}
                                                  disabled={
                                                    isReadOnly || !isRowEnabled
                                                  }
                                                />
                                                {errors.ticketDetails?.[index]
                                                  ?.description &&
                                                  touched.ticketDetails?.[index]
                                                    ?.description && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.ticketDetails[
                                                          index
                                                        ].description
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Ticket Number */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`ticketDetails.${index}.ticketNumber`}
                                                  className="form-control"
                                                  placeholder="Ticket Number"
                                                  maxLength={50}
                                                  disabled={
                                                    isReadOnly || !isRowEnabled
                                                  }
                                                />
                                                {errors.ticketDetails?.[index]
                                                  ?.ticketNumber &&
                                                  touched.ticketDetails?.[index]
                                                    ?.ticketNumber && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.ticketDetails[
                                                          index
                                                        ].ticketNumber
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Ticket Detail */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`ticketDetails.${index}.ticketDetail`}
                                                  className="form-control"
                                                  placeholder="Ticket Detail"
                                                  maxLength={50}
                                                  disabled={
                                                    isReadOnly || !isRowEnabled
                                                  }
                                                />
                                                {errors.ticketDetails?.[index]
                                                  ?.ticketDetail &&
                                                  touched.ticketDetails?.[index]
                                                    ?.ticketDetail && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.ticketDetails[
                                                          index
                                                        ].ticketDetail
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Ticket Amount - numeric only */}
                                              <td>
                                                <NumericFormat
                                                  name={`ticketDetails.${index}.ticketAmount`}
                                                  className="form-control"
                                                  placeholder="0"
                                                  thousandSeparator
                                                  allowNegative={false}
                                                  isAllowed={({ value }) =>
                                                    value.length <= 8
                                                  }
                                                  disabled={
                                                    isReadOnly || !isRowEnabled
                                                  }
                                                  value={
                                                    ticket.ticketAmount ?? ""
                                                  }
                                                  onValueChange={(
                                                    valuesObj,
                                                  ) => {
                                                    setFieldValue(
                                                      `ticketDetails.${index}.ticketAmount`,
                                                      valuesObj.value,
                                                    );
                                                  }}
                                                />
                                                {errors.ticketDetails?.[index]
                                                  ?.ticketAmount &&
                                                  touched.ticketDetails?.[index]
                                                    ?.ticketAmount && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.ticketDetails[
                                                          index
                                                        ].ticketAmount
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </FieldArray>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>

                {/* Travel Hotel details */}
                <div className="w-full mt-9">
                  <Accordion
                    activeKey={activeHotelKey}
                    onSelect={(key) => setActiveHotelKey(key)}
                  >
                    <Card>
                      <Card.Header className="d-flex justify-content-center p-0">
                        <div className="accordion-header-btn w-100 d-flex bg-tsecondary">
                          <Accordion.Toggle
                            as={Button}
                            eventKey="0"
                            className="flex justify-start text-bold w-full"
                          >
                            {activeHotelKey === "0" ? (
                              <CircleMinus className="h-4 w-4 text-black mr-1" />
                            ) : (
                              <CirclePlus className="h-4 w-4 text-black mr-1" />
                            )}
                            <span className="text-black font-bold">
                              Hotel Details
                            </span>
                          </Accordion.Toggle>
                        </div>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body className="p-3">
                          <FieldArray name="hotelDetails">
                            {(arrayHelpers) => (
                              <>
                                {errors.hotelDetails &&
                                  typeof errors.hotelDetails === "string" && (
                                    <div className="form-feedBack mb-2">
                                      {errors.hotelDetails}
                                    </div>
                                  )}

                                <div
                                  className="react-bootstrap-table table-responsive"
                                  style={{ overflowX: "auto" }}
                                >
                                  <table className="table table-head-custom table-vertical-center table-hover">
                                    <thead className="custom-table-header">
                                      <tr>
                                        <td style={{ minWidth: "150px" }}>
                                          Location
                                        </td>
                                        <td style={{ minWidth: "100px" }}>
                                          Hotel Name
                                        </td>
                                        <td style={{ minWidth: "100px" }}>
                                          Room Number
                                        </td>
                                        <td style={{ minWidth: "120px" }}>
                                          Room Type
                                        </td>
                                        <td style={{ minWidth: "120px" }}>
                                          Description
                                        </td>
                                        <td style={{ minWidth: "80px" }}>
                                          Amount
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {values.travelSegments.map(
                                        (segment, index) => {
                                          if (
                                            !segment.accommodationRequired ||
                                            index ===
                                              values.travelSegments.length - 1
                                          ) {
                                            return null;
                                          }
                                          const hotel =
                                            values.hotelDetails?.[index] || {};
                                          const fromLabel =
                                            locationOptions.find(
                                              (opt) =>
                                                String(opt.value) ===
                                                String(segment.fromLocation),
                                            )?.label || "-";
                                          const toLabel =
                                            locationOptions.find(
                                              (opt) =>
                                                String(opt.value) ===
                                                String(segment.toLocation),
                                            )?.label || "-";

                                          return (
                                            <tr key={index}>
                                              {/* Location Text */}
                                              <td className="align-middle">
                                                <span
                                                  className="font-bold opacity-70"
                                                  style={{
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {toLabel}
                                                </span>
                                              </td>

                                              {/* Hotel Name */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`hotelDetails.${index}.hotelName`}
                                                  className="form-control"
                                                  placeholder="Hotel Name"
                                                  maxLength={50}
                                                  disabled={isReadOnly}
                                                />
                                                {errors.hotelDetails?.[index]
                                                  ?.hotelName &&
                                                  touched.hotelDetails?.[index]
                                                    ?.hotelName && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.hotelDetails[
                                                          index
                                                        ].hotelName
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Description */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`hotelDetails.${index}.description`}
                                                  className="form-control"
                                                  placeholder="Description"
                                                  maxLength={200}
                                                  disabled={isReadOnly}
                                                />
                                                {errors.hotelDetails?.[index]
                                                  ?.description &&
                                                  touched.hotelDetails?.[index]
                                                    ?.description && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.hotelDetails[
                                                          index
                                                        ].description
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Room Number */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`hotelDetails.${index}.roomNumber`}
                                                  className="form-control"
                                                  placeholder="Room Number"
                                                  maxLength={50}
                                                  disabled={isReadOnly}
                                                />
                                                {errors.hotelDetails?.[index]
                                                  ?.roomNumber &&
                                                  touched.hotelDetails?.[index]
                                                    ?.roomNumber && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.hotelDetails[
                                                          index
                                                        ].roomNumber
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Room Type */}
                                              <td>
                                                <Field
                                                  type="text"
                                                  name={`hotelDetails.${index}.roomType`}
                                                  className="form-control"
                                                  placeholder="Room Type"
                                                  maxLength={50}
                                                  disabled={isReadOnly}
                                                />
                                                {errors.hotelDetails?.[index]
                                                  ?.roomType &&
                                                  touched.hotelDetails?.[index]
                                                    ?.roomType && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.hotelDetails[
                                                          index
                                                        ].roomType
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                              {/* Amount - numeric only */}
                                              <td>
                                                <NumericFormat
                                                  name={`hotelDetails.${index}.amount`}
                                                  className="form-control"
                                                  placeholder="0"
                                                  thousandSeparator
                                                  allowNegative={false}
                                                  isAllowed={({ value }) =>
                                                    value.length <= 8
                                                  }
                                                  disabled={isReadOnly}
                                                  value={hotel.amount ?? ""}
                                                  onValueChange={(
                                                    valuesObj,
                                                  ) => {
                                                    setFieldValue(
                                                      `hotelDetails.${index}.amount`,
                                                      valuesObj.value,
                                                    );
                                                  }}
                                                />
                                                {errors.hotelDetails?.[index]
                                                  ?.amount &&
                                                  touched.hotelDetails?.[index]
                                                    ?.amount && (
                                                    <div className="form-feedBack text-xs mt-1">
                                                      {
                                                        errors.hotelDetails[
                                                          index
                                                        ].amount
                                                      }
                                                    </div>
                                                  )}
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </FieldArray>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
                <div className="grid grid-cols-12 gap-x-3 mt-6">
                  <div className="col-span-6">
                    <label>
                      Authority Remarks
                      {values.request_status === "R" && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <Field
                      as="textarea"
                      name="authorityRemarks"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      rows="3"
                      placeholder="Enter authority remarks here..."
                      maxLength={500}
                    />
                    {errors.authorityRemarks && touched.authorityRemarks && (
                      <div className="form-feedBack text-xs mt-1">
                        {errors.authorityRemarks}
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
                {!isReadOnly && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm font-bold px-8"
                      disabled={isReadOnly || isSubmitting}
                      onClick={() => {
                        if (!values.authorityRemarks) {
                          toast.error("Remarks are required for rejection");
                          return;
                        }
                        setFieldValue("request_status", "R");
                        setTimeout(() => submitForm(), 0);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-sm font-bold px-8"
                      disabled={isReadOnly || isSubmitting}
                      onClick={() => {
                        isApprovingRef.current = true;
                        setFieldValue("request_status", "A");
                        setTimeout(() => submitForm(), 0);
                      }}
                    >
                      Approve
                    </button>
                  </>
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
