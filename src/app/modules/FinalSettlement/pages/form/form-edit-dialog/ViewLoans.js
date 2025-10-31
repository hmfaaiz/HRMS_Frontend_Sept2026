
import React, {  useState } from 'react';

import '../../../../../utils/common-modules/form.css';
import { Field, FieldArray } from 'formik';
import { SearchSelect } from '../../../../../../_metronic/_helpers/SearchSelect';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
const ViewLoans = ({ employeeId, panelMode,values,errors  }) => {
  const [data, setdata] = useState({});

  const { dashboard } = useSelector((state) => state);

  return (
    <>
      {panelMode && (
               <FieldArray name="loan_list">
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
                                {values?.loan_list?.map((row, index) => (
                                  <tr key={index}>
                                    {/* Row Starts */}



                                    <td>




                                      <SearchSelect
                                        name={`loan_list[${index}].loan_typeId`}
                                        isDisabled={true}

                                        value={
                                          dashboard?.allLoanTypeList
                                            ?.filter((option) => option.value === values.loan_list[index].loan_typeId)
                                            ?.map((option) => ({
                                              label: option.label, //  label will be displayed
                                              value: option.value,
                                            }))[0] || null
                                        }

                                        onChange={(selectedOption) => {
                                          const selectedValue = selectedOption ? selectedOption.value : "";
                                          setFieldValue(`loan_list[${index}].loan_typeId`, selectedValue);
                                        }}

                                        options={
                                          dashboard?.allLoanTypeList?.map((option) => ({
                                            label: option.label, // show only this field as label
                                            value: option.value,     // keep value for Formik binding
                                          })) || []
                                        }

                                      />



                                      {/* Error message */}
                                      {errors?.loan_list?.[index]?.loan_typeId && touched?.loan_list?.[index]?.loan_typeId && (
                                        <div className="invalid-feedback">
                                          {errors.loan_list[index].loan_typeId}
                                        </div>
                                      )}
                                    </td>

                                    <td>
                                      <Field

                                        name={`loan_list[${index}].loan_paid`}
                                        className={
                                          errors.loan_list?.[index]?.loan_paid && touched.loan_list?.[index]?.loan_paid
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`loan_list[${index}].loan_paid`, value);
                                        }}
                                        value={row?.loan_paid || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.loan_list?.[index]?.loan_paid && touched?.loan_list?.[index]?.loan_paid && (
                                        <div className="invalid-feedback">
                                          {errors.loan_list[index].loan_paid}
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <Field

                                        name={`loan_list[${index}].loan_outstanding`}
                                        className={
                                          errors.loan_list?.[index]?.loan_outstanding && touched.loan_list?.[index]?.loan_outstanding
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        disabled
                                        onChange={(e) => {
                                          const value = e.target.value === "Select" ? "" : e.target.value;
                                          setFieldValue(`loan_list[${index}].loan_outstanding`, value);
                                        }}
                                        value={row?.loan_outstanding || ""}
                                      >


                                      </Field>

                                      {/* Error message */}
                                      {errors?.loan_list?.[index]?.loan_outstanding && touched?.loan_list?.[index]?.loan_outstanding && (
                                        <div className="invalid-feedback">
                                          {errors.loan_list[index].loan_outstanding}
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
