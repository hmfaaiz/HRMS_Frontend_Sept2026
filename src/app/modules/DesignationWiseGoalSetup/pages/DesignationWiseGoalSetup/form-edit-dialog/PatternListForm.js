import { Field, FieldArray } from "formik";
import React, { useEffect, useMemo } from "react";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { amountLimitDynamic } from "../../../../../utils/common";
import { CirclePlus, Trash2 } from "lucide-react";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Checkbox } from "../../../../../../_metronic/_partials/controls";
function PatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  dropdownData,
  isdataForRead,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(543, "allAppraisalCompetencySetupList", null, true));
  }, [values.designationId]);

  useEffect(() => {
    values.list.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list, setFieldValue]);


  console.log("allAppraisalCompetencySetupList1111", dashboard.allAppraisalCompetencySetupList)
  return (
    <>
      <FieldArray name="list">
        {({ insert, remove, push }) => (
          <>
            <div className="flex justify-between items-center">

              {/* {!isdataForRead && values?.list.length < 31 && ( */}
              <button
                disabled={!values.designationId}
                type="button"
                className="btn btn-primary btn-elevate"
                onClick={() =>
                  push({
                    goalName: "",
                    goalDescription: "",
                    competencyId: "",
                    weightage: "",
                    isActive: 1,
                    sno: "",
                  })
                }
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
              {/* )} */}
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <td className="w-[5px]">S.No.</td>
                      <td className="w-[200px]">Competency</td>
                      <td className="w-[200px]">Goal Name</td>
                      <td className="w-[250px]">Goal Description</td>
                      <td className="w-[100px]">Weightage (%)</td>
                      <td className="w-[120px]">Mark Comment as Mandatory</td>
                      <td className="w-[10px]">Active</td>
                      <td className="text-right">Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {values?.list?.map((row, index) => (
                      <tr key={index}>
                        {/* Row Starts */}

                        <td>
                          <Field
                            name={`list[${index}].sno`}
                            value={index + 1}
                            type="number"
                            className="form-control"
                            style={{ width: "100px" }}

                            disabled
                          />
                          {errors.list?.[index]?.sno &&
                            touched.list?.[index]?.sno && (
                              <div className="text-danger">
                                {errors.list[index].sno}
                              </div>
                            )}
                        </td>

                        <td>


                          {/* <SearchSelect
                            name={`list[${index}].competencyId`}
                            className={
                              errors.list?.[index]?.competencyId && touched.list?.[index]?.competencyId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            value={
                              dashboard?.allAppraisalCompetencySetupList?.find(
                                (option) => option.value === values.list[index].competencyId
                              ) || null
                            }
                            // onChange={(e) => {
                            //   const value = e.target.value === "Select" ? "" : e.target.value;
                            //   setFieldValue(`list[${index}].competencyId`, value);
                            // }}
                            onChange={(selectedOption) => {
                              setFieldValue(`list[${index}].competencyId`, selectedOption ? selectedOption.value : "");
                            }}
                            options={dashboard?.allAppraisalCompetencySetupList}
                          /> */}
                          {/* <SearchSelect
                            name={`list[${index}].competencyId`}
                            value={
                              dashboard?.allAppraisalCompetencySetupList?.find(
                                (option) => option.value === values.list[index].competencyId
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              const selectedValue = selectedOption ? selectedOption.value : "";
                              const isDuplicate = values.list.some(
                                (item, i) => i !== index && item.competencyId === selectedValue
                              );
                              if (isDuplicate) {
                                alert("This competency is already selected.");
                                return;
                              }
                              setFieldValue(`list[${index}].competencyId`, selectedValue);
                            }}
                            options={dashboard?.allAppraisalCompetencySetupList}
                          /> */}


                          <SearchSelect
                            name={`list[${index}].competencyId`}
                            // value={
                            //   dashboard?.allAppraisalCompetencySetupList?.find(
                            //     (option) => option.value === values.list[index].competencyId
                            //   ) || null
                            // }

                            value={
                              dashboard?.allAppraisalCompetencySetupList
                                ?.filter((option) => option.value === values.list[index].competencyId)
                                ?.map((option) => ({
                                  label: option.onlyLabel, //  onlyLabel will be displayed
                                  value: option.value,
                                }))[0] || null
                            }

                            onChange={(selectedOption) => {
                              const selectedValue = selectedOption ? selectedOption.value : "";
                              setFieldValue(`list[${index}].competencyId`, selectedValue);
                            }}
                    
                            options={
                              dashboard?.allAppraisalCompetencySetupList?.map((option) => ({
                                  label: option.onlyLabel, // show only this field as label
                                  value: option.value,     // keep value for Formik binding
                                })) || []
                            }

                          />



                          {/* Error message */}
                          {errors?.list?.[index]?.competencyId && touched?.list?.[index]?.competencyId && (
                            <div className="invalid-feedback">
                              {errors.list[index].competencyId}
                            </div>
                          )}
                        </td>

                        <td>
                          <Field

                            name={`list[${index}].goalName`}
                            className={
                              errors.list?.[index]?.goalName && touched.list?.[index]?.goalName
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            disabled={isdataForRead}
                            onChange={(e) => {
                              const value = e.target.value === "Select" ? "" : e.target.value;
                              setFieldValue(`list[${index}].goalName`, value);
                            }}
                            value={row?.goalName || ""}
                          >


                          </Field>

                          {/* Error message */}
                          {errors?.list?.[index]?.goalName && touched?.list?.[index]?.goalName && (
                            <div className="invalid-feedback">
                              {errors.list[index].goalName}
                            </div>
                          )}
                        </td><td>
                          <Field

                            name={`list[${index}].goalDescription`}
                            className={
                              errors.list?.[index]?.goalDescription && touched.list?.[index]?.goalDescription
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            disabled={isdataForRead}
                            onChange={(e) => {
                              const value = e.target.value === "Select" ? "" : e.target.value;
                              setFieldValue(`list[${index}].goalDescription`, value);
                            }}
                            value={row?.goalDescription || ""}
                          >


                          </Field>

                          {/* Error message */}
                          {errors?.list?.[index]?.goalDescription && touched?.list?.[index]?.goalDescription && (
                            <div className="invalid-feedback">
                              {errors.list[index].goalDescription}
                            </div>
                          )}
                        </td><td>
                          <Field

                            name={`list[${index}].weightage`}
                            className={
                              errors.list?.[index]?.weightage && touched.list?.[index]?.weightage
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            disabled={isdataForRead}
                            onChange={(e) => {
                              const value = e.target.value === "Select" ? "" : e.target.value;
                              setFieldValue(`list[${index}].weightage`, value);
                            }}
                            value={row?.weightage || ""}
                          >


                          </Field>

                          {/* Error message */}
                          {errors?.list?.[index]?.weightage && touched?.list?.[index]?.weightage && (
                            <div className="invalid-feedback">
                              {errors.list[index].weightage}
                            </div>
                          )}
                        </td>



                        <td>


                          <Checkbox
                            isSelected={values.list[index].isManadatory}
                            name={`list[${index}].isManadatory`}
                            checked={!!values.list[index].isManadatory}
                            disabled={isdataForRead}
                            onChange={(e) => {
                              setFieldValue(`list[${index}].isManadatory`, e.target.checked ? 1 : 0);
                            }}
                            className={
                              errors.list?.[index]?.isManadatory && touched.list?.[index]?.isManadatory
                                ? "form-check-input is-invalid"
                                : "form-check-input"
                            }
                          />

                          {/* Error message */}
                          {errors?.list?.[index]?.isManadatory && touched?.list?.[index]?.isManadatory && (
                            <div className="invalid-feedback">
                              {errors.list[index].isManadatory}
                            </div>
                          )}
                        </td>
                        <td>


                          <Checkbox
                            isSelected={values.list[index].isActive}
                            name={`list[${index}].isActive`}
                            checked={!!values.list[index].isActive}
                            disabled={isdataForRead}
                            onChange={(e) => {
                              setFieldValue(`list[${index}].isActive`, e.target.checked ? 1 : 0);
                            }}
                            className={
                              errors.list?.[index]?.isActive && touched.list?.[index]?.isActive
                                ? "form-check-input is-invalid"
                                : "form-check-input"
                            }
                          />

                          {/* Error message */}
                          {errors?.list?.[index]?.isActive && touched?.list?.[index]?.isActive && (
                            <div className="invalid-feedback">
                              {errors.list[index].isActive}
                            </div>
                          )}
                        </td>

                        {/* Delete Button Starts */}
                        {/* {!values?.list[index]?.isPresent && ( */}
                        <td className="text-right">
                          <button
                            disabled={isdataForRead}
                            className="border-none bg-transparent"
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                          </button>
                        </td>
                        {/* )} */}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </FieldArray>
    </>
  );
}

export default PatternListForm;
