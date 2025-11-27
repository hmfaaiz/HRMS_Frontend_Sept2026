import { Field, FieldArray } from "formik";
import React from "react";
import {
  Checkbox,
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";

const LeaveLinesTable = ({ values, setFieldValue, isEdit }) => {
  return (
    <>
      {values?.leaveLines?.length > 0 && (
        <FieldArray name="leaveLines">
          {() => {
            return (
              <div>
                <hr />
                <div className="flex justify-between items-center mb-1">
                  <h6 className="font-bold mb-0 text-primary">Leave Lines</h6>
                </div>

                <div className="w-full overflow-x-auto">
                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <thead>
                        <tr className="custom-table-header">
                          <th>Date</th>
                          <th>Duration</th>
                          <th>Half Day Time</th>
                          <th>Sandwich</th>
                        </tr>
                      </thead>

                      <tbody>
                        {values?.leaveLines?.map((row, index) => {
                          const isSandwich = row.isSandwich === true;

                          return (
                            <tr key={index}>
                              {/* ---------------- DATE ---------------- */}
                              <td>
                                <Field
                                  name={`leaveLines[${index}].date`}
                                  disabled={true}
                                  component={DatePickerField}
                                  dateFormat="dd-MMM-yyyy"
                                  autoComplete="off"
                                />
                              </td>

                              {/* ---------------- DURATION ---------------- */}
                              <td>
                                <Field name={`leaveLines[${index}].day`}>
                                  {() => (
                                    <select
                                      className="form-control"
                                      value={row.day}
                                      disabled={isSandwich || isEdit}
                                      onChange={(e) => {
                                        const dayVal = parseFloat(
                                          e.target.value
                                        );
                                        setFieldValue(
                                          `leaveLines[${index}].day`,
                                          dayVal
                                        );

                                        // If full day selected → clear halfDayType
                                        if (dayVal == 0.5) {
                                          setFieldValue(
                                            `leaveLines[${index}].halfDayType`,
                                            1
                                          );
                                        } else {
                                          setFieldValue(
                                            `leaveLines[${index}].halfDayType`,
                                            null
                                          );
                                        }
                                      }}
                                    >
                                      <option value={1}>Full Day</option>
                                      <option value={0.5}>Half Day</option>
                                    </select>
                                  )}
                                </Field>
                              </td>

                              {/* ---------------- HALF DAY TIME ---------------- */}
                              <td>
                                <Field
                                  name={`leaveLines[${index}].halfDayType`}
                                >
                                  {() => (
                                    <select
                                      className="form-control"
                                      value={row.halfDayType || ""}
                                      disabled={isSandwich || row.day != 0.5 || isEdit}
                                      onChange={(e) => {
                                        if (e?.target?.value) {
                                          setFieldValue(
                                            `leaveLines[${index}].halfDayType`,
                                            Number(e.target.value)
                                          );
                                        }
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value={1}>First Half</option>
                                      <option value={2}>Second Half</option>
                                    </select>
                                  )}
                                </Field>
                              </td>

                              {/* ---------------- SANDWICH CHECKBOX ---------------- */}
                              <td className="text-center">
                                <Field name={`leaveLines[${index}].isSandwich`}>
                                  {() => (
                                    <Checkbox
                                      isSelected={row.isSandwich}
                                      disabled={true} // user cannot toggle
                                      onChange={() => {}}
                                    ></Checkbox>
                                  )}
                                </Field>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          }}
        </FieldArray>
      )}
    </>
  );
};

export default LeaveLinesTable;
