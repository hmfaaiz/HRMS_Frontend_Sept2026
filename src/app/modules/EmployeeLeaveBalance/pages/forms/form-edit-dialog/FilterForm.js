import React, { useMemo, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Select } from "../../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {
  fetchAllDept,
  fetchAllFiscalYearData,
  fetchAllLeaveType,
  fetchAllLeaveTypeBySubsidiary,
  fetchAllSpecialLeaveTypes,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getAllLeaveTypesBySubsidiary } from "../../../../../../_metronic/redux/dashboardCrud";
import { fetchLeaveBalances } from "../../../_redux/formActions";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { Eye, XCircle } from "lucide-react";


export function FilterForm({ filters, setfilters, dropdownData, dispatch }) {
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const [panelMode, setPanelMode] = useState(false);

  const allEmployeesMap = useMemo(() => {
    return new Map(
      dropdownData?.allEmployees?.map((item) => [item.value, item])
    );
  }, [dropdownData?.allEmployees]);

  const { dashboard } = useSelector((state) => state);
  useEffect(() => {


    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));


  }, [dispatch]);

  const setFiscalYearId = (setFieldValue) => {
    const activeYear =
      dropdownData?.allFiscalYears?.find((year) => year.isActive);

    if (activeYear) {
      setFieldValue("yearId", activeYear.value);
      setfilters((prev) => ({
        ...prev,
        yearId: activeYear.value,
      }));


    }
  }

  return (
    <>
      <Formik enableReinitialize={true} initialValues={filters}>
        {({ errors, touched, values, handleBlur, setFieldValue }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div >
                    {/* Employee Field Start */}

                    <div className="grid grid-cols-4 gap-x-3 gap-y-1">

                      <div className="">

                        <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }

                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                            setFieldValue("departmentId", null);
                            dispatch(fetchAllDept(e.value));
                            // dispatch(fetchAllLeaveTypeBySubsidiary("allLeaveTypes", e.value));
                            setfilters({
                              ...filters,
                              subsidiaryId: e.value,
                              leaveType: "",
                            });

                          }}
                          value={
                            dashboard?.allSubsidiaryList?.find(
                              (option) => option.value === values.subsidiaryId
                            ) || null
                          }
                          options={dashboard?.allSubsidiaryList}

                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                        />
                      </div>


                      <div className="">

                        <SearchSelect
                          name="departmentId"
                          label={
                            <span>
                              Department<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          // isDisabled={!values.subsidiaryId}
                          onChange={(e) => {
                            setFieldValue("departmentId", e.value || null);
                            setFieldValue("employeeId", null);
                            //  dispatch(fetchAllDept(e.value ));
                            setfilters({
                              ...filters,
                              departmentId: e.value,
                              leaveType: "",
                            });
                          }}
                          value={
                            dashboard?.allDept?.find(
                              (option) => option.value === values.departmentId
                            ) || null
                          }
                          options={dashboard?.allDept}

                          error={errors.departmentId}
                          touched={touched.departmentId}
                        />
                      </div>


                      <div>
                        <Field
                          name="employeeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          // isDisabled={!values.departmentId}
                          onChange={async (e) => {
                            const value =
                              e.value == "Select" ? "" : Number(e.value);
                            if (value) {
                              await dispatch(fetchAllSpecialLeaveTypes("allLeaveTypes", value));

                              await dispatch(
                                fetchAllFiscalYearData("allFiscalYears", value)
                              );
                          

                            

                              setFiscalYearId(setFieldValue)
                            }
                         
                            setFieldValue("employeeId", value);
                            setfilters({
                              ...filters,
                              employeeId: value,
                              leaveType: "",
                            });
                               

  await dispatch(fetchLeaveBalances(value));
                          }}
                          label={
                            <span>
                              {" "}
                              Employee<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={
                            allEmployeesMap?.get(values?.employeeId || "") || ""
                          }
                          autoComplete="off"
                          // options={dropdownData.allEmployees}
                          options={
                            values?.departmentId
                              ? dropdownData.allEmployees.filter(
                                (emp) => emp.departmentId === values.departmentId
                              )
                              : []
                          }
                        />
                        {errors.employeeId && touched.employeeId && (
                          <CustomErrorLabel
                            touched={true}
                            error={errors.employeeId}
                          />
                        )}
                      </div>

                      <div className="mt-6">
                        {panelMode ? (
                          <button
                            type="button"
                            className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                            onClick={() => setPanelMode(!panelMode)}
                          >
                            <XCircle className="w-3 h-3 text-black" />
                            Cancel
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={() => setPanelMode(!panelMode)}
                          >
                            <Eye className="w-4 h-4 text-white" />
                            View Details
                          </button>
                        )}
                      </div>

                    </div>
                    <div className="mt-2">
                      <EmployeeProfile
                        employeeId={values.employeeId}
                        panelMode={panelMode}
                      />
                    </div>





                    {/* Employee Field End */}
                    <div className="grid grid-cols-4 gap-x-3 gap-y-1">


                      {/* Leave Type Field Start */}
                      <div>
                        <Field
                          name="leaveType"
                          disabled={!values.employeeId}
                          component={Select}
                          className={
                            errors.leaveType && touched.leaveType
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder=""
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.target.value == "Select"
                                ? ""
                                : Number(e.target.value);
                            setFieldValue("leaveType", value);
                            setfilters({ ...filters, leaveType: value });
                            setFiscalYearId(setFieldValue)
                          }}
                          label={
                            <span>
                              {" "}
                              Leave Type<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values.leaveType}
                          autoComplete="off"
                          // children={CustomDropdown({
                          //   data: values.employeeId
                          //     ? dropdownData.allLeaveTypes
                          //     : [{ label: "Select", value: null }],
                          // })} 
                          children={CustomDropdown({
                            data: [
                              { label: "Select", value: null, type: 2 }, // hamesha first
                              ...(values.employeeId
                                ? dropdownData.allLeaveTypes?.filter((lt) => lt.type == 2)
                                : []),
                            ],
                          })}
                        />
                        {errors.leaveType && touched.leaveType && (
                          <CustomErrorLabel
                            touched={true}
                            error={errors.leaveType}
                          />
                        )}
                      </div>
                      {/* Leave Type Field End */}

                      {/* Year Field Start */}
                      <div>
                        <Field
                          name="yearId"
                          component={Select}
                          // disabled={!values.employeeId}
                          disabled={true}
                          className={
                            errors.yearId && touched.yearId
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder=""
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.target.value == "Select"
                                ? ""
                                : Number(e.target.value);
                            setFieldValue("yearId", value);
                            setfilters({ ...filters, yearId: value });
                          }}
                          label={
                            <span>
                              {" "}
                              Year<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values.yearId}
                          autoComplete="off"
                          // children={CustomDropdown({
                          //   data: dropdownData.allFiscalYears,
                          //   firstElement: { label: "Select", value: null },
                          // })}

                          children={CustomDropdown({
                            data: dropdownData?.allFiscalYears?.filter(year => year.isActive) || [],
                            firstElement: { label: "Select", value: null },
                          })}
                        />
                        {errors.yearId && touched.yearId && (
                          <CustomErrorLabel
                            touched={true}
                            error={errors.yearId}
                          />
                        )}
                      </div>

                    </div>
                    {/* Year Field End */}
                  </div>
                </fieldset>
              </Form>


            </Modal.Body>
          </>
        )}
      </Formik>
    </>
  );
}
