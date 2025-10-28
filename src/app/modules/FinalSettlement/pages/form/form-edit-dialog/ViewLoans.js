
import React, {  useState } from 'react';

import '../../../../../utils/common-modules/form.css';
import { FieldArray } from 'formik';
import { SearchSelect } from '../../../../../../_metronic/_helpers/SearchSelect';

const ViewLoans = ({ employeeId, panelMode,values }) => {
  const [data, setdata] = useState({});


  return (
    <>
      {panelMode && (
               <FieldArray name="earning_list">
                    {({ insert, remove, push }) => (
                      <>
                        <div className="flex justify-end items-center text-right bg-red-500 ">

                       
                        </div>
                        <div className="w-full overflow-x-auto">
                          <div className="react-bootstrap-table table-responsive">
                            <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                              <thead>
                                <tr className="custom-table-header">

                                  <td className="w-[200px]">Loan Type</td>
                                  <td className="w-[200px]">Paid Amount</td>
                                  <td className="w-[250px]">Remaining Amount</td>
                    
                              
                                </tr>
                              </thead>
                              <tbody>
                                {values?.earning_list?.map((row, index) => (
                                  <tr key={index}>
                                    {/* Row Starts */}



                                    <td>




                                      <SearchSelect
                                        name={`earning_list[${index}].earning_deduction_id`}


                                        value={
                                          dashboard?.allAppraisalCompetencySetupearning_list
                                            ?.filter((option) => option.value === values.earning_list[index].earning_deduction_id)
                                            ?.map((option) => ({
                                              label: option.onlyLabel, //  onlyLabel will be displayed
                                              value: option.value,
                                            }))[0] || null
                                        }

                                        onChange={(selectedOption) => {
                                          const selectedValue = selectedOption ? selectedOption.value : "";
                                          setFieldValue(`earning_list[${index}].earning_deduction_id`, selectedValue);
                                        }}

                                        options={
                                          dashboard?.allAppraisalCompetencySetupearning_list?.map((option) => ({
                                            label: option.onlyLabel, // show only this field as label
                                            value: option.value,     // keep value for Formik binding
                                          })) || []
                                        }

                                      />



                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.earning_deduction_id && touched?.earning_list?.[index]?.earning_deduction_id && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].earning_deduction_id}
                                        </div>
                                      )}
                                    </td>

                                    <td>
                                      <Field

                                        name={`earning_list[${index}].days_hours`}
                                        className={
                                          errors.earning_list?.[index]?.days_hours && touched.earning_list?.[index]?.days_hours
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`earning_list[${index}].days_hours`, value);
                                        }}
                                        value={row?.days_hours || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.days_hours && touched?.earning_list?.[index]?.days_hours && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].days_hours}
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <Field

                                        name={`earning_list[${index}].amount_actual`}
                                        className={
                                          errors.earning_list?.[index]?.amount_actual && touched.earning_list?.[index]?.amount_actual
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled={isdataForRead}
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`earning_list[${index}].amount_actual`, value);
                                        }}
                                        value={row?.amount_actual || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.earning_list?.[index]?.amount_actual && touched?.earning_list?.[index]?.amount_actual && (
                                        <div className="invalid-feedback">
                                          {errors.earning_list[index].amount_actual}
                                        </div>
                                      )}
                                    </td>
            

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </FieldArray>
      )}
    </>
  );
};

export default ViewLoans;
