import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import {
  chartTypes,
  dashletType,
  PeriodType,
  smallTableTheme,
  themeColor,
} from "../FormUIHelper";
import {
  Checkbox,
  Input,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as Yup from "yup";

const options = [
  {
    title: "Default View",
    key: "default",
  },
  {
    title: "Employee",
    key: "employee",
  },
  {
    title: "Leave",
    key: "leave",
  },
  {
    title: "Attendance",
    key: "attendance",
  },
  {
    title: "Payroll",
    key: "payroll",
  },
  {
    title: "Recruitment",
    key: "recruitment",
  },
  {
    title: "Separation",
    key: "separation",
  },
  {
    title: "Appraisal",
    key: "appraisal",
  },
];

const validationSchema = Yup.array().of(
  Yup.object().shape({
    isPeriodType: Yup.boolean().default(false),
    PeriodType: Yup.number().nullable(),
    days: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? undefined : value
      )
      .when(["isPeriodType", "PeriodType"], {
        is: (isPeriodType, periodType) =>
          !!isPeriodType && Number(periodType) === 0,
        then: (schema) =>
          schema
            .min(1, "Day must be at least 1")
            .max(90, "Day must be at most 90")
            .required("Day is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  })
);

const MasterEditForm = ({ initialValues, loading, dispatch }) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={true}
      onSubmit={(values) => {
        // Sanitize days: if empty when required, set to 1; also clamp to [1, 90]
        const sanitized = (values || []).map((row) => {
          if (row?.isPeriodType && Number(row?.PeriodType) === 0) {
            const numericDays = Number(row?.days);
            if (!row?.days && row?.days !== 0) {
              return { ...row, days: 1 };
            }
            if (Number.isNaN(numericDays)) {
              return { ...row, days: 1 };
            }
            if (numericDays < 1) {
              return { ...row, days: 1 };
            }
            if (numericDays > 90) {
              return { ...row, days: 90 };
            }
          }
          return row;
        });
        dispatch(actions.updateDashboardAlertConfig(sanitized));
      }}
    >
      {({ handleSubmit, values, setFieldValue, errors }) => (
        <Form className="form form-label-right">
          <fieldset disabled={loading}>
            <div className="flex justify-between items-center">
              <h6 className="font-bold mb-0 text-primary">
                Dashboard Alerts List
              </h6>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <td>Dashboard Name</td>
                      <td>Module</td>
                      <td>Dashboard Type</td>
                      <td>Graph Type</td>
                      <td>Reminder Theme</td>
                      <td>Period Type</td>
                      <td className="w-36">Days</td>
                      <td>Default View</td>
                      <td>Active</td>
                    </tr>
                  </thead>
                  <tbody>
                    {values?.length > 0 &&
                      values?.map((row, index) => (
                        <tr key={index}>
                          <td>{row?.dashlet_name || ""}</td>
                          <td>
                            {options?.find((el) => el?.key == row?.tab_key)
                              ?.title || ""}
                          </td>
                          <td>{dashletType[row?.dashlet_type] || ""}</td>
                          <td>
                            {row?.dashlet_type == "chart" ? (
                              <Field
                                name={`[${index}].graph_type`}
                                component={SearchSelect}
                                className={"form-control"}
                                onChange={(e) => {
                                  setFieldValue(
                                    `[${index}].graph_type`,
                                    e.value
                                  );
                                }}
                                isDisabled={row?.dashlet_type !== "chart"}
                                value={
                                  chartTypes?.find(
                                    (item) => item?.value === row?.graph_type
                                  ) || ""
                                }
                                options={chartTypes || []}
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {row?.dashlet_type == "small_table" ? (
                              <Field
                                name={`[${index}].theme_class`}
                                component={SearchSelect}
                                className={"form-control"}
                                onChange={(e) => {
                                  setFieldValue(
                                    `[${index}].theme_class`,
                                    e.value
                                  );
                                }}
                                isDisabled={row?.dashlet_type !== "small_table"}
                                value={
                                  smallTableTheme?.find(
                                    (item) => item?.value === row?.theme_class
                                  ) || ""
                                }
                                options={smallTableTheme || []}
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {row?.isPeriodType ? (
                              <Field
                                name={`[${index}].PeriodType`}
                                component={SearchSelect}
                                className={"form-control"}
                                onChange={(e) => {
                                  setFieldValue(
                                    `[${index}].PeriodType`,
                                    e.value
                                  );
                                  if (e?.value === 0) {
                                    setFieldValue(`[${index}].days`, 1);
                                  } else {
                                    setFieldValue(`[${index}].days`, "");
                                  }
                                }}
                                isDisabled={row?.dashlet_type === "chart"}
                                value={
                                  PeriodType?.find(
                                    (item) => item?.value === row?.PeriodType
                                  ) || ""
                                }
                                options={PeriodType || []}
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="w-36">
                            {row?.isPeriodType ? (
                              <>
                                <Field
                                  name={`[${index}].days`}
                                  disabled={values[index]?.PeriodType !== 0}
                                  component={Input}
                                  type="number"
                                  min={1}
                                  max={90}
                                  autoComplete="off"
                                  validate={(value) => {
                                    const periodEnabled =
                                      values[index]?.isPeriodType &&
                                      Number(values[index]?.PeriodType) === 0;
                                    if (!periodEnabled) return undefined;
                                    if (
                                      value === "" ||
                                      value === null ||
                                      value === undefined
                                    ) {
                                      return "Day is required";
                                    }
                                    const num = Number(value);
                                    if (Number.isNaN(num))
                                      return "Day is required";
                                    if (num < 1)
                                      return "Day must be at least 1";
                                    if (num > 90)
                                      return "Day must be at most 90";
                                    return undefined;
                                  }}
                                />
                                <ErrorMessage
                                  name={`[${index}].days`}
                                  component="div"
                                  className="invalid-feedback d-block"
                                />
                              </>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            <Checkbox
                              isSelected={values[index]?.is_fav} // or === true depending on backend
                              disabled={row?.tab_key === "appraisal"}
                              onChange={(e) => {
                                setFieldValue(
                                  `[${index}].is_fav`,
                                  e?.target?.checked ? 1 : 0
                                );
                              }}
                            />
                          </td>
                          <td>
                            <Checkbox
                              isSelected={values[index]?.isActive}
                              onChange={(e) => {
                                setFieldValue(
                                  `[${index}].isActive`,
                                  e?.target?.checked ? 1 : 0
                                );
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Submit form   */}
            <hr />
            <div className="text-right">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={loading}
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

export default MasterEditForm;
