import React, { useEffect, useMemo } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import { ATTENDANCE_TYPE } from "../../../../../utils/constants";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { formatDates } from "../../../../../utils/common";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { FileText } from "lucide-react";

//Validation for date fields
const formValidation = Yup.object().shape({
  from: Yup.date().optional(),
  to: Yup.date()
    .optional()
    .min(Yup.ref("from"), "Date to date cannot be before Date from date"),
});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

export function FormFilter({ loading, dispatch, pdfLoading }) {
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allEmployees,
    allSubsidiaryList,
    allEmployeeGradeList,
    allDept,
    allLocationChildMenus,
    allDesignations,
  } = useSelector((state) => state.dashboard);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);

  const allGradeMap = useMemo(() => {
    return new Map(allEmployeeGradeList?.map((item) => [item.value, item]));
  }, [allEmployeeGradeList]);

  const allDeptMap = useMemo(() => {
    return new Map(allDept?.map((item) => [item.value, item]));
  }, [allDept]);

  const allLocationMap = useMemo(() => {
    return new Map(allLocationChildMenus?.map((item) => [item.value, item]));
  }, [allLocationChildMenus]);

  const allDesignationsMap = useMemo(() => {
    return new Map(allDesignations?.map((item) => [item.value, item]));
  }, [allDesignations]);
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (End)

  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  //Function to update filter in queryparams when any filter is selected or updated
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  //Get Labels of Dropdown to Display in PDF
  const getLabels = (values) => {
    return {
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      employeeLabel: allEmployeesMap?.get(values.employeeId || "")?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,
      reportToLabel: allEmployeesMap?.get(values.reportTo || "")?.label,
      gradeLabel: allGradeMap?.get(values.gradeId || "")?.label,
      designationLabel: allDesignationsMap?.get(values.designationId || "")
        ?.label,
      locationLabel: allLocationMap?.get(values.locationId || "")?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      fromLabel: values?.from ? formatDates(values.from) : "",
      toLabel: values?.to ? formatDates(values.to) : "",
      attendanceTypeLabel: values?.attendanceType
        ? ATTENDANCE_TYPE.find((el) => el.value == values.attendanceType)?.label
        : "",
    };
  };

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchPdfData(newQueryParams.filter, document, labels));
  };

  useEffect(() => {
    if (allSubsidiaryList && allSubsidiaryList.length > 0) {
      dispatch(fetchAllActiveEmployeesBySubsidiary(allSubsidiaryList[0].value));
      dispatch(fetchAllDept(allSubsidiaryList[0].value));
    }
  }, [allSubsidiaryList]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialFilter.filter}
        initialValues={{
          ...initialFilter.filter,
          subsidiaryId:
            initialFilter.filter?.subsidiaryId ||
            (allSubsidiaryList && allSubsidiaryList.length > 0
              ? allSubsidiaryList[0].value
              : ""), // Set default subsidiaryId if it's not provided
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
            const formattedValues = {
                      ...values,
                      from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
                      to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
                    
                    };
          applyFilter(formattedValues);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">
                    {/* Subsidiary Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="subsidiaryId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);
                          dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                          dispatch(fetchAllDept(value));
                          setFieldValue("employeeId", "");
                          setFieldValue("departmentId", "");
                        }}
                        label={<span> Subsidiary</span>}
                        value={
                          allSubsidiaryMap?.get(values?.subsidiaryId || "") ||
                          ""
                        }
                        autoComplete="off"
                        // options={allSubsidiaryList}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allSubsidiaryList)
                            ? allSubsidiaryList
                            : []),
                        ]}
                      />
                    </div>
                    {/* Subsidiary Field End */}

                    {/* Active payroll month */}

                    {/* <div className="col-12 col-md-8 mt-3 d-flex flex-column align-items-end">

{values?.subsidiaryId ? (() => {
 const selectedSubsidiary = allSubsidiaryMap?.get(values?.subsidiaryId);
  return (
    <>
      <div>
        <b>Active Fiscal Year -</b>{" "}
        {selectedSubsidiary?.fiscalYearLabel}
      </div>
      <div>
        <b>Active Payroll Month -</b>{" "}
        {selectedSubsidiary?.payrollMonthLabel}
      </div>
    </>
  );
})() : null}
</div> */}

                    {/* Deparment Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="departmentId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("departmentId", value);
                        }}
                        label={<span> Department</span>}
                        value={
                          allDeptMap?.get(values?.departmentId || "") || ""
                        }
                        autoComplete="off"
                        // options={allDept}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allDept) ? allDept : []),
                        ]}
                      />
                    </div>
                    {/* Deparment Field End */}

                    {/* Report To Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="reportTo"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("reportTo", value);
                        }}
                        label={<span> Report To</span>}
                        value={
                          allEmployeesMap?.get(values?.reportTo || "") || ""
                        }
                        autoComplete="off"
                        // options={allEmployees}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allEmployees) ? allEmployees : []),
                        ]}
                      />
                    </div>
                    {/* Report To Field End */}

                    {/* Grade Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="gradeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("gradeId", value);
                        }}
                        label={<span> Grade</span>}
                        value={allGradeMap?.get(values?.gradeId || "") || ""}
                        autoComplete="off"
                        // options={allEmployeeGradeList}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allEmployeeGradeList)
                            ? allEmployeeGradeList
                            : []),
                        ]}
                      />
                    </div>
                    {/* Grade Field End */}

                    {/* Designation Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="designationId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("designationId", value);
                        }}
                        label={<span> Designation</span>}
                        value={
                          allDesignationsMap?.get(
                            values?.designationId || ""
                          ) || ""
                        }
                        autoComplete="off"
                        // options={allDesignations}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allDesignations)
                            ? allDesignations
                            : []),
                        ]}
                      />
                    </div>
                    {/* Designation Field End */}

                    {/* Location Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="locationId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("locationId", value);
                        }}
                        label={<span> Location</span>}
                        value={
                          allLocationMap?.get(values?.locationId || "") || ""
                        }
                        autoComplete="off"
                        // options={allLocationChildMenus}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allLocationChildMenus)
                            ? allLocationChildMenus
                            : []),
                        ]}
                      />
                    </div>
                    {/* Location Field End */}

                    {/* Attendance Type Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="attendanceType"
                        component={Select}
                        placeholder=""
                        onChange={(e) => {
                          const value =
                            e.target.value == -1 ? "" : Number(e.target.value);
                          setFieldValue("attendanceType", value);
                        }}
                        label={<span> Attendance Type</span>}
                        value={values.attendanceType}
                        autoComplete="off"
                        children={CustomDropdown({ data: ATTENDANCE_TYPE })}
                      />
                    </div>
                    {/* Attendance Type Field End */}

                    {/* Employee Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("employeeId", value);
                        }}
                        label={<span> Employee</span>}
                        value={
                          allEmployeesMap?.get(values?.employeeId || "") || ""
                        }
                        autoComplete="off"
                        // options={allEmployees}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allEmployees) ? allEmployees : []),
                        ]}
                      />
                    </div>
                    {/* Employee Field End */}

                    {/* Date from Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="from"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={<span>From</span>}
                        onChange={(date) => {
                          setFieldValue("from", date);
                          setFieldValue("to", date);
                        }}
                        autoComplete="off"
                      />
                    </div>
                    {/* Date from Field End */}

                    {/* Date to Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="to"
                        component={DatePickerField}
                        onBlur={handleBlur}
                        className="form-control"
                        dateFormat="dd-MMM-yyyy"
                        label={<span>To</span>}
                        onChange={(date) => {
                          setFieldValue("to", date);
                        }}
                        autoComplete="off"
                      />
                    </div>
                    {/* Date to Field End */}
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => {
                  applyFilter(initialFilter.filter);
                  handleReset();
                }}
                className="btn btn-light"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="btn btn-primary btn-elevate"
              >
                Filter
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
              <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="products-edit-tooltip">Export PDF</Tooltip>
                  }
                >
                  <button
                    onClick={() => {
                      getPdf(values);
                    }}
                    disabled={pdfLoading}
                    className="border-none bg-transparent"
                  >
                    <FileText className="w-4 h-4 text-black cursor-pointer" />

                    {pdfLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </OverlayTrigger>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
