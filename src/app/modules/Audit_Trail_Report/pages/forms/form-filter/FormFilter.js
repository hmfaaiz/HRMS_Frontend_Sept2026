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
import {
  ATTENDANCE_TYPE,
  VALIDATION_MESSAGES,
} from "../../../../../utils/constants";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { formatDates } from "../../../../../utils/common";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { FileText, Sheet } from "lucide-react";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllAuditTablesName } from "../../../../Dashboard/_redux/dashboardActions";
//Validation for date fields
const formValidation = Yup.object()
  .shape({

    from: Yup.date().nullable().optional(),
    to: Yup.date().nullable()
      .optional()
      .min(Yup.ref("from"), "'To Date' should not be less than 'From Date'."),


    // Custom test to ensure all three fields (salary_type, operator, amount) are selected together
  })


//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  const formattedValues = {
    ...values,
    from: values.from
      ? formatDates(values.from, "dd-MMM-yyyy")
      : null,
    to: values.to
      ? formatDates(values.to, "dd-MMM-yyyy")
      : null,

  };
  newQueryParams.filter = { ...formattedValues };
  return newQueryParams;
};

export function FormFilter({
  loading,
  dispatch,
  pdfLoading,
  registerExcelLoading,
}) {
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allSubsidiaryList, getAllUserList, getAllAuditTablesNameList,

  } = useSelector((state) => state.dashboard);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allUserMap = useMemo(() => {
    return new Map(getAllUserList?.map((item) => [item.value, item]));
  }, [getAllUserList]);


  const allAuditTablesNameMap = useMemo(() => {
    return new Map(getAllAuditTablesNameList?.map((item) => [item.value, item]));
  }, [getAllAuditTablesNameList]);


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

      userLabel: allUserMap?.get(values.userId || '')?.label,
      fromLabel: values?.from ? formatDates(values.from) : "",
      toLabel: values?.to ? formatDates(values.to) : "",


    };
  };

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);

    dispatch(actions.fetchPdfData(newQueryParams.filter, document, labels));
  };

  const getExcel = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateRegisterExcel(newQueryParams.filter, document, labels)
    );
  };

  const employeeStatus = [
    { value: 0, label: "In Active" },
    { value: 1, label: "Active" },
  ];
  const chnageMode = [
    { value: "0", label: "Add" },
    { value: "1", label: "Edit" },
    { value: "2", label: "Delete" },
  ];



  return (
    <>
      <Formik
        enableReinitialize={true}

        initialValues={{
          ...initialFilter.filter,
          employeeStatusId: initialFilter.filter?.employeeStatusId ?? 1
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const formattedValues = {
            ...values,
            from: values.from
              ? formatDates(values.from, "dd-MMM-yyyy")
              : null,
            to: values.to
              ? formatDates(values.to, "dd-MMM-yyyy")
              : null,

          };
          applyFilter(formattedValues);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset,
          isValid, // Destructure isValid

        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset className="">
                  <div>
                    <h6 className="font-bold mb-0 text-primary">Employee</h6>
                    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-1">




                      <div className="col-span-1">
                        <Field
                          name="employeeStatusId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          // isDisabled={values?.userId}
                          onChange={(e) => {
                            const value = e?.value === "Select" ? "" : e?.value;
                            setFieldValue("employeeStatusId", value);
                            setFieldValue("userid", null);
                          }}
                          label={<span> Employee Status</span>}
                          value={
                            (Array.isArray(employeeStatus) &&
                              employeeStatus.find((opt) => opt.value === values?.employeeStatusId)) ||
                            ""
                          }
                          autoComplete="off"
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(employeeStatus) ? employeeStatus : []),
                          ]}
                        />
                      </div>


                      <div className="col-span-1">
                        <Field
                          name="userId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e?.value === "Select" ? "" : Number(e?.value);
                            setFieldValue("userId", value);
                            dispatch(fetchAllAuditTablesName(value));
                            // setFieldValue("employeeStatusId", null);
                          }}
                          label={<span> User</span>}
                          value={allUserMap?.get(values?.userId) || ""}
                          autoComplete="off"
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(getAllUserList)
                              ? getAllUserList.filter(item => item?.deactiveflag == values?.employeeStatusId)
                              : []
                            )
                          ]}
                        />
                      </div>


                      <div className="col-span-1">
                        <Field
                          name="changeModeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e?.value === "Select" ? "" : e?.value;
                            console.log("value111", value)
                            setFieldValue("changeModeId", value);
                          }}
                          label={<span> Change Mode</span>}
                          value={
                            (Array.isArray(chnageMode) &&
                              chnageMode.find((opt) => opt.value == values?.changeModeId)) ||
                            ""
                          }
                          autoComplete="off"
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(chnageMode) ? chnageMode : []),
                          ]}
                        />
                      </div>

                      <div className="col-span-1">
                        <Field
                          name="tableName"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e?.value === "Select" ? "" : e?.value; // number hata do
                            setFieldValue("tableName", value);
                          }}
                          label={<span>Form Name</span>}

                          value={allAuditTablesNameMap?.get(values?.tableName) || ""}
                          autoComplete="off"
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(getAllAuditTablesNameList) ? getAllAuditTablesNameList : []),
                          ]}
                        />

                      </div>






                    </div>
                  </div>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-1">
                    <div>
                      <h6 className="font-bold mb-0 text-primary">
                        Date
                      </h6>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <Field
                            name="from"
                            component={DatePickerField}
                            dateFormat="dd-MMM-yyyy"
                            className="form-control"
                            label={<span> From</span>}
                            onChange={(date) => {
                              setFieldValue("from", date);
                              setFieldValue("to", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-span-1">
                          <Field
                            name="to"
                            component={DatePickerField}
                            onBlur={handleBlur}
                            className="form-control"
                            dateFormat="dd-MMM-yyyy"
                            label={<span> To</span>}
                            onChange={(date) => {
                              setFieldValue("to", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>




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
                disabled={loading || !values.from || !values.to}
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
                    disabled={pdfLoading || !values.from || !values.to}
                    className="border-none bg-transparent"
                  >
                    <FileText className="w-4 h-4 text-black cursor-pointer" />

                    {pdfLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="products-edit-tooltip">Export Excel</Tooltip>
                  }
                >
                  <button
                    onClick={() => {
                      getExcel(values);
                    }}
                    disabled={
                      registerExcelLoading
                    }
                    className="border-none bg-transparent"
                    type="button"
                  >
                    <Sheet className="w-4 h-4 text-black cursor-pointer" />
                    {registerExcelLoading && (
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
