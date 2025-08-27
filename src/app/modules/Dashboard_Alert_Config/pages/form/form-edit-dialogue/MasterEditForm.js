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

const validationSchema = Yup.array().of(
  Yup.object().shape({
    days: Yup.number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : Number(originalValue)
      )
      .nullable()
      .when(["isPeriodType", "PeriodType"], {
        is: (isPeriodType, PeriodType) => isPeriodType === true,
        then: Yup.number().when("PeriodType", {
          is: 0,
          then: (schema) =>
            schema
              .required("Days is required")
              .min(0, "Days must be at least 0"),
          otherwise: (schema) =>
            schema
              .required("Days is required")
              .min(1, "Days must be at least 1"),
        }),
        otherwise: (schema) => schema.notRequired().nullable(),
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
        dispatch(actions.updateDashboardAlertConfig(values));
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
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
                      <td>Dashboard Type</td>
                      <td>Graph Type</td>
                      <td>Small Table Theme</td>
                      <td>Period Type</td>
                      <td>Days</td>
                      <td>Default View</td>
                      <td>Active</td>
                    </tr>
                  </thead>
                  <tbody>
                    {values?.length > 0 &&
                      values?.map((row, index) => (
                        <tr key={index}>
                          <td>{row?.dashlet_name || ""}</td>
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
                                    setFieldValue(`[${index}].days`, 10);
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
                          <td>
                            {row?.isPeriodType ? (
                              <>
                                <Field
                                  name={`[${index}].days`}
                                  disabled={values[index]?.PeriodType !== 0}
                                  component={Input}
                                  type="number"
                                  min="1"
                                  autoComplete="off"
                                  onChange={(e) => {
                                    if (
                                      e.target.value.trim() === "" ||
                                      e.target.value.trim() === "0"
                                    ) {
                                      setFieldValue(`[${index}].days`, 1);
                                    } else {
                                      setFieldValue(
                                        `[${index}].days`,
                                        e.target.value
                                      );
                                    }
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
