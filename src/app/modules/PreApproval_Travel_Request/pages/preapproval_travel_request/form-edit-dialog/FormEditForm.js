import React, { useMemo } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Checkbox,
} from "../../../../../../_metronic/_partials/controls";
import DatePicker from "react-datepicker";
import { Plus, Trash2, CirclePlus, Calendar } from "lucide-react";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

export function FormEditForm({ employeeId, employeeDetails, onCancel }) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
    }),
    shallowEqual,
  );

  const transportOptions = dashboard?.allTransportModeList || [];
  const hotelOptions = dashboard?.allHotelEntitlementList || [];
  const locationOptions = dashboard?.allLocationChildMenus || [];

  React.useEffect(() => {
    dispatch(fetchAllFormsMenu(551, "allTransportModeList"));
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList"));
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, [dispatch]);

  // Validation Schema
  const formValidation = Yup.object().shape({
    purposeOfTravel: Yup.string().required(VALIDATION_MESSAGES.required),
    projectName: Yup.string().required(VALIDATION_MESSAGES.required),
    travelType: Yup.string().required(VALIDATION_MESSAGES.required),
    dailyAllowanceRate: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(0, VALIDATION_MESSAGES.minOneValue),
    dailyAllowanceDays: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(1, VALIDATION_MESSAGES.minOneValue),
    travelSegments: Yup.array()
      .of(
        Yup.object().shape({
          fromLocation: Yup.string().required(VALIDATION_MESSAGES.required),
          toLocation: Yup.string().required(VALIDATION_MESSAGES.required),
          fromDate: Yup.date()
            .typeError(VALIDATION_MESSAGES.required)
            .required(VALIDATION_MESSAGES.required),
          toDate: Yup.date()
            .typeError(VALIDATION_MESSAGES.required)
            .required(VALIDATION_MESSAGES.required)
            .min(Yup.ref("fromDate"), VALIDATION_MESSAGES.endDateError),
          toLocation: Yup.string().required(VALIDATION_MESSAGES.required),
          modeOfTravel: Yup.string().required(VALIDATION_MESSAGES.required),
          classOfTravel: Yup.string().required(VALIDATION_MESSAGES.required),
          hotelEntitlement: Yup.string().when(
            "accommodationRequired",
            (accommodationRequired, schema) => {
              return accommodationRequired
                ? schema.required(VALIDATION_MESSAGES.required)
                : schema.nullable();
            },
          ),
          hotelEntitlementAmount: Yup.number().when(
            ["accommodationRequired", "selfEntitlement"],
            (accommodationRequired, selfEntitlement, schema) => {
              return accommodationRequired && !selfEntitlement
                ? schema
                    .required(VALIDATION_MESSAGES.required)
                    .min(0, VALIDATION_MESSAGES.minOneValue)
                : schema.nullable();
            },
          ),
          selfAmount: Yup.number().when(
            ["accommodationRequired", "selfEntitlement"],
            (accommodationRequired, selfEntitlement, schema) => {
              return accommodationRequired && selfEntitlement
                ? schema
                    .required(VALIDATION_MESSAGES.required)
                    .min(0, VALIDATION_MESSAGES.minOneValue)
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
  });

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

  const initialValues = {
    employeeId: employeeId || "",
    purposeOfTravel: "",
    projectName: "",
    travelType: "",
    dailyAllowanceRate: 0,
    dailyAllowanceDays: 0,
    dailyAllowanceAmount: 0,
    advanceRequested: false,
    advanceAmount: 0,
    advanceRemarks: "",
    taxiFareRate: 0,
    travelSegments: [
      { ...segmentTemplate },
      { ...segmentTemplate }
    ],
    travelRemarks: "",
  };

  return (
    <div className="mt-4">
      <Formik
        initialValues={initialValues}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const payload = {
            companyId: employeeDetails?.companyId,
            subsidiaryId: employeeDetails?.subsidiaryId,
            employeeId: employeeId,
            purposeOfTravel: values.purposeOfTravel,
            projectName: values.projectName,
            travelType: values.travelType,
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
            request_status: "P",
            Master: values.travelSegments.map((segment) => ({
              fromLocationId: segment.fromLocation,
              toLocationId: segment.toLocation,
              fromDate: segment.fromDate,
              toDate: segment.toDate,
              modeOfTravelId: segment.modeOfTravel,
              classOfTravelId: segment.classOfTravel,
              accommodationRequired: segment.accommodationRequired,
              isSelf: segment.selfEntitlement,
              hotelEntitlementId: segment.hotelEntitlement,
              hotelAmount: segment.hotelEntitlementAmount,
              selfAmount: segment.selfAmount,
            })),
          };

          const disableLoading = () => console.log("Loading disabled");
          const onHide = () => console.log("Form hidden");

          console.log("PAYLOAD:", payload);

          dispatch(
            actions.createPreApprovalTravelRequest(
              payload,
              disableLoading,
              onHide,
            ),
          );
        }}
      >
        {({ values, setFieldValue, errors, touched }) => {
          // Auto-calculation logic for Daily Allowance (Days and Amount)
          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            const firstSegment = values.travelSegments[0];
            const lastSegment =
              values.travelSegments[values.travelSegments.length - 1];

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
          }, [values.travelSegments, values.dailyAllowanceDays, setFieldValue]);

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

          return (
            <Form className="form form-label-right">
              {/* Travel Details Heading and Header Fields */}
              <div className="mb-6">
                <h4 className="text-primary font-bold mb-3">Travel details</h4>
                <div className="grid grid-cols-12 gap-x-3 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold">
                      Purpose of Travel <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="purposeOfTravel"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      placeholder="Purpose of Travel"
                    />
                    {errors.purposeOfTravel && touched.purposeOfTravel && (
                      <div className="form-feedBack">
                        {errors.purposeOfTravel}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold">
                      Project Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="projectName"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      placeholder="Project Name"
                    />
                    {errors.projectName && touched.projectName && (
                      <div className="form-feedBack">{errors.projectName}</div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold">
                      Travel Type <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      name="travelType"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                    >
                      <option value="">Select</option>
                      <option value="Official">Official</option>
                      <option value="Training">Training</option>
                      <option value="Personal">Personal</option>
                    </Field>
                    {errors.travelType && touched.travelType && (
                      <div className="form-feedBack">{errors.travelType}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Travel Segments (FieldArray) */}
              <div className="w-full">
                <FieldArray name="travelSegments">
                  {() => (
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
                                <span className="text-danger">*</span>
                              </td>
                              <td style={{ minWidth: "60px" }}>
                                Accommodation Required
                              </td>

                              {/* Dynamic Accommodation Headers */}
                              <td style={{ minWidth: "150px" }}>
                                Hotel Entitlement
                              </td>
                              <td style={{ minWidth: "100px" }}>
                                Hotel Entitlement Amount
                              </td>
                              <td style={{ minWidth: "80px" }}>
                                Self Entitlement
                              </td>
                              <td style={{ minWidth: "100px" }}>Self Amount</td>
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
                                      <option key={opt.value} value={opt.value}>
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
                                      <option key={opt.value} value={opt.value}>
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
                                      // Scalable Logic: current toDate is the next row's fromDate
                                      if (
                                        index <
                                        values.travelSegments.length - 1
                                      ) {
                                        setFieldValue(
                                          `travelSegments.${index +
                                            1}.fromDate`,
                                          val,
                                        );
                                      }
                                    }}
                                    dateFormat="dd-MMM-yyyy"
                                    name={`travelSegments.${index}.toDate`}
                                    autoComplete="off"
                                    placeholderText="Select Date"
                                    popperClassName="z-[9999]"
                                    popperPlacement="bottom"
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
                                  >
                                    <option value="">Select</option>
                                    {transportOptions.map((opt) => (
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
                                  >
                                    <option value="">Select</option>
                                    {transportOptions.map((opt) => (
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
                                      segment.selfEntitlement
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
                                      segment.selfEntitlement
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
                                    {hotelOptions.map((opt) => (
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
                                <td
                                  style={{
                                    opacity:
                                      !segment.accommodationRequired ||
                                      !segment.hotelEntitlement ||
                                      segment.selfEntitlement
                                        ? 0.4
                                        : 1,
                                  }}
                                >
                                  <Field
                                    name={`travelSegments.${index}.hotelEntitlementAmount`}
                                    className="form-control"
                                    type="number"
                                    placeholder="0"
                                    disabled={
                                      !segment.accommodationRequired ||
                                      !segment.hotelEntitlement ||
                                      segment.selfEntitlement
                                    }
                                    value={
                                      !segment.accommodationRequired ||
                                      !segment.hotelEntitlement ||
                                      segment.selfEntitlement
                                        ? ""
                                        : segment.hotelEntitlementAmount
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
                                </td>
                                <td className="text-center align-middle">
                                  <div
                                    className="flex justify-center items-center h-full"
                                    style={{
                                      opacity:
                                        !segment.accommodationRequired ||
                                        segment.hotelEntitlement
                                          ? 0.4
                                          : 1,
                                    }}
                                  >
                                    <Checkbox
                                      disabled={
                                        !segment.accommodationRequired ||
                                        !!segment.hotelEntitlement
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
                                      segment.hotelEntitlement
                                        ? 0.4
                                        : 1,
                                  }}
                                >
                                  <Field
                                    name={`travelSegments.${index}.selfAmount`}
                                    className="form-control"
                                    type="number"
                                    placeholder="0"
                                    disabled={
                                      !segment.accommodationRequired ||
                                      !segment.selfEntitlement ||
                                      !!segment.hotelEntitlement
                                    }
                                    value={
                                      !segment.accommodationRequired ||
                                      !segment.selfEntitlement ||
                                      !!segment.hotelEntitlement
                                        ? ""
                                        : segment.selfAmount
                                    }
                                  />
                                  {errors.travelSegments?.[index]?.selfAmount &&
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
                <div className="grid grid-cols-6 md:grid-cols-12 gap-x-3 gap-y-3">
                  {/* Daily Allowance */}
                  <div className="col-span-3">
                    <h6 className="font-bold  text-primary text-sm">
                      Daily Allowance
                    </h6>
                    <div className="grid grid-cols-3 gap-x-2">
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Rate <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          name="dailyAllowanceRate"
                          className="form-control text-sm"
                          style={{ backgroundColor: "#eefbff" }}
                          placeholder="0"
                          min="0"
                        />
                        {errors.dailyAllowanceRate &&
                          touched.dailyAllowanceRate && (
                            <div className="form-feedBack text-xs mt-1">
                              {errors.dailyAllowanceRate}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Day <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          name="dailyAllowanceDays"
                          className="form-control text-sm bg-light"
                          style={{ backgroundColor: "#eefbff" }}
                          placeholder="0"
                          min="0"
                          disabled={true}
                        />
                        {errors.dailyAllowanceDays &&
                          touched.dailyAllowanceDays && (
                            <div className="form-feedBack text-xs mt-1">
                              {errors.dailyAllowanceDays}
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Amount
                        </label>
                        <Field
                          type="number"
                          name="dailyAllowanceAmount"
                          className="form-control text-sm bg-light"
                          placeholder="0"
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Taxi Fare */}
                  <div className="col-span-2 md:col-span-1">
                    <h6 className="font-bold mb-3 text-primary text-sm">
                      Taxi Fare per KM
                    </h6>
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        Rate
                      </label>
                      <Field
                        type="number"
                        name="taxiFareRate"
                        className="form-control text-sm"
                        placeholder="0"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks (Full Width below) */}
                <div className="grid grid-cols-6 md:grid-cols-12 gap-x-3 mt-4">
                  {/* Advance Request */}
                  <div className="col-span-2">
                    <h6 className="font-bold mb-3 text-primary text-sm">
                      Advance Request
                    </h6>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div className="flex items-center">
                        <span className="text-xs font-semibold mr-2">
                          Advance required
                        </span>
                        <Checkbox
                          isSelected={values.advanceRequested}
                          onChange={(e) =>
                            setFieldValue("advanceRequested", e.target.checked)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Amount{" "}
                          {values.advanceRequested && (
                            <span className="text-danger">*</span>
                          )}
                        </label>
                        <Field
                          type="number"
                          name="advanceAmount"
                          className="form-control text-sm"
                          style={{ backgroundColor: "#eefbff" }}
                          placeholder="0"
                          min="0"
                          disabled={!values.advanceRequested}
                        />
                        {errors.advanceAmount && touched.advanceAmount && (
                          <div className="form-feedBack text-xs mt-1">
                            {errors.advanceAmount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remarks (Full Width below) */}
                <div className="grid grid-cols-12 gap-x-3 mt-4">
                  <div className="col-span-6">
                    <label className="text-xs font-semibold">
                      Advance Request Remarks{" "}
                      {values.advanceRequested && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <Field
                      as="textarea"
                      name="advanceRemarks"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      rows="3"
                      placeholder="Enter advance remarks..."
                      disabled={!values.advanceRequested}
                    />
                    {errors.advanceRemarks && touched.advanceRemarks && (
                      <div className="form-feedBack text-xs mt-1">
                        {errors.advanceRemarks}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-3 mt-4">
                  <div className="col-span-6">
                    <label className="text-xs font-semibold">
                      Travel Request Remarks <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="travelRemarks"
                      className="form-control"
                      style={{ backgroundColor: "#eefbff" }}
                      rows="3"
                      placeholder="Enter travel remarks..."
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm font-bold px-8"
                >
                  Save
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
