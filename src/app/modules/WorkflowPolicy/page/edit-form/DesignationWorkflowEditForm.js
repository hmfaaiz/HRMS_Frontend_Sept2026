import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu,
  fetchAllHumanResourceRole,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { Input } from "../../../../../_metronic/_partials/controls";
import {
  VALIDATION_MESSAGES,
  WEEK_DAY_STRING,
} from "../../../../utils/constants";
import * as Yup from "yup";
import CustomApprovalWorkflowTable from "../form-table/CustomApprovalTable";
import * as action from "../../redux/formaction";
import { fetchAllCity } from "../../../Dashboard/_redux/dashboardActions";

const validationSchema = Yup.object().shape({
  workflowTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  designationId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  reportToLevel: Yup.string()
    .nullable()
    .matches(/^[0-9]$/, "reportToLevel must be a digit between 0 and 9"),
  isHODFinalAuthority: Yup.boolean(),
  isEmpFinalAuthority: Yup.boolean(),
  empFinalAuthorityId: Yup.string()
    .nullable()
    .when("isEmpFinalAuthority", {
      is: true,
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),
  isCustomApprover: Yup.boolean(),
  customApprovalList: Yup.array()
    .of(
      Yup.object().shape({
        workflowApprovalTypeId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        levelId: Yup.number()
          .nullable()
          .when("workflowApprovalTypeId", {
            is: (val) => val == "403",
            then: Yup.number().required(VALIDATION_MESSAGES.required),
            otherwise: Yup.number()
              .notRequired()
              .transform(() => undefined),
          }),
        designationId: Yup.number()
          .nullable()
          .when("workflowApprovalTypeId", {
            is: (val) => val == "404",
            then: Yup.number().required(VALIDATION_MESSAGES.required),
            otherwise: Yup.number()
              .notRequired()
              .transform(() => undefined),
          }),
        employeeId: Yup.number()
          .nullable()
          .when("workflowApprovalTypeId", {
            is: (val) => val == "405",
            then: Yup.number().required(VALIDATION_MESSAGES.required),
            otherwise: Yup.number()
              .notRequired()
              .transform(() => undefined),
          }),
        roleId: Yup.number()
          .nullable()
          .when("workflowApprovalTypeId", {
            is: (val) => val == "407",
            then: Yup.number().required(VALIDATION_MESSAGES.required),
            otherwise: Yup.number()
              .notRequired()
              .transform(() => undefined),
          }),
      })
    )
    .when("isCustomApprover", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "Add at least one")
          .required("Custom approvers are required"),
      otherwise: (schema) => schema.transform(() => undefined), // Or: schema.notRequired()
    }),
});

const DesignationWorkflowEditForm = ({
  data,
  isUserForRead,
  onHide,
  loading,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(380, "allEmployeeRequestTypeList"));
    dispatch(fetchAllActiveEmployees());
    dispatch(action.fetchRoles());
    dispatch(fetchAllCity());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(402, "allApprovalWorkflowList"));
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  const allOption = { value: "all", label: "All" };
  const options = [allOption, ...dashboard?.allDesignations];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        data?.Id
          ? {
              ...data,
              designationId:
                data?.designationId !== null ? data?.designationId : "all",
            }
          : data
      }
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        handleBlur,
        setFieldValue,
        formik,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      isDisabled={isUserForRead}
                      name="subsidiaryId"
                      label={
                        <span>
                          {" "}
                          Subsidiary
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={({ value }) => {
                        setFieldValue("subsidiaryId", value);
                      }}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (e) => e.value === values?.subsidiaryId
                        ) || null
                      }
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                      options={dashboard?.allSubsidiaryList}
                    />
                  </div>
                  {/* designation workflow set  */}
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      isDisabled={isUserForRead}
                      name="workflowTypeId"
                      label={
                        <span>
                          {" "}
                          Workflow Type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={({ value }) => {
                        setFieldValue("workflowTypeId", value);
                      }}
                      value={
                        dashboard?.allEmployeeRequestTypeList?.find(
                          (e) => e.value === values?.workflowTypeId
                        ) || null
                      }
                      error={errors.workflowTypeId}
                      touched={touched.workflowTypeId}
                      options={dashboard.allEmployeeRequestTypeList}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      isDisabled={isUserForRead}
                      name="designationId"
                      label={
                        <span>
                          Designation <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={({ value }) => {
                        setFieldValue("designationId", value);
                      }}
                      value={
                        options.find(
                          (e) => e.value === values?.designationId
                        ) || (data?.Id ? allOption : null)
                      }
                      error={errors.designationId}
                      touched={touched.designationId}
                      options={
                        dashboard?.allDesignations &&
                        Array.isArray(dashboard?.allDesignations)
                          ? [
                              { value: "all", label: "All" },
                              ...dashboard?.allDesignations,
                            ]
                          : []
                      }
                    />
                  </div>
                  {/* check for default approver workflow */}
                  {/* <div className="row col-12 col-md-12 m-0 p-0">
                    <div className="col-12 col-md-4 mt-4">
                      <input
                        name="isCustomApprover"
                        type="checkbox"
                        onChange={(e) => {
                          setFieldValue(
                            "isCustomApprover",
                            !values?.isCustomApprover
                          );
                          if (e.target.checked) {
                            setFieldValue("customApprovalList", []);
                          } else {
                            setFieldValue("reportToLevel", "");
                            setFieldValue("empFinalAuthorityId", null);
                            setFieldValue("isHODFinalAuthority", false);
                            setFieldValue("isEmpFinalAuthority", false);
                          }
                        }}
                        onBlur={handleBlur}
                        value={values.isCustomApprover}
                        checked={values.isCustomApprover === false}
                      />
                      <label className="px-2 font-weight-bold">
                        Default Approver Workflow
                      </label>
                      <ErrorMessage
                        className="form-feedBack"
                        name="isCustomApprover"
                        component="div"
                      />
                    </div>
                  </div> */}
                  {/* default approver area  */}
                  {/* <div
                    className="col-12 col-md-12 mt-3"
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <fieldset disabled={values?.isCustomApprover}>
                      <div className="col-12 col-md-4 m-0 p-0">
                        <Field
                          name="reportToLevel"
                          component={Input}
                          onChange={(e) => {
                            setFieldValue("reportToLevel", e.target.value);
                          }}
                          value={values?.reportToLevel}
                          placeholder="Report To Level"
                          label="Report To Level"
                          maxLength="2"
                          autoComplete="off"
                        />
                      </div>
                      <div className="row col-12 col-md-12 m-0 p-0">
                        <div className="col-12 col-md-12 mt-5">
                          <h4 className="px-2">Final Authority</h4>
                        </div>
                        <div className="col-12 col-md-4 mt-2">
                          <input
                            name="isEmpFinalAuthority"
                            type="checkbox"
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue("isEmpFinalAuthority", checked);
                              if (!checked) {
                                setFieldValue("empFinalAuthorityId", null);
                              }
                              if (checked) {
                                setFieldValue("isHODFinalAuthority", false); // Uncheck HOD
                              }
                            }}
                            onBlur={handleBlur}
                            value={values.isEmpFinalAuthority}
                            checked={values.isEmpFinalAuthority}
                          />
                          <label className="px-2">Employee</label>
                          <ErrorMessage
                            className="form-feedBack"
                            name="isEmpFinalAuthority"
                            component="div"
                          />
                        </div>
                        <div className="col-12 col-md-6 mt-2">
                          <input
                            name="isHODFinalAuthority"
                            type="checkbox"
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue("isHODFinalAuthority", checked);
                              setFieldValue("empFinalAuthorityId", null);
                              if (checked) {
                                setFieldValue("isEmpFinalAuthority", false);
                              }
                            }}
                            onBlur={handleBlur}
                            value={values.isHODFinalAuthority}
                            checked={values.isHODFinalAuthority}
                          />
                          <label className="px-2">
                            HOD ((will be picked from HOD setup))
                          </label>
                          <ErrorMessage
                            className="form-feedBack"
                            name="isHODFinalAuthority"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 m-0 p-0">
                        <SearchSelect
                          name="empFinalAuthorityId"
                          label={
                            <span>
                              Employee{" "}
                              {values.isEmpFinalAuthority && (
                                <span style={{ color: "red" }}>*</span>
                              )}
                            </span>
                          }
                          onChange={({ value }) => {
                            setFieldValue("empFinalAuthorityId", value);
                          }}
                          isDisabled={!values.isEmpFinalAuthority || isUserForRead}
                          value={
                            dashboard?.allEmployees?.find(
                              (e) => e.value === values?.empFinalAuthorityId
                            ) || null
                          }
                          error={errors.empFinalAuthorityId}
                          touched={touched.empFinalAuthorityId}
                          options={dashboard.allEmployees}
                        />
                      </div>
                    </fieldset>
                  </div> */}
                  {/* check for custom approver workflow  */}
                  {/* <div className="row col-12 col-md-12 m-0 p-0">
                    <div className="col-12 col-md-4 mt-4">
                      <input
                        name="isCustomApprover"
                        type="checkbox"
                        onChange={(e) => {
                          setFieldValue(
                            "isCustomApprover",
                            !values?.isCustomApprover
                          );
                          if (e.target.checked) {
                            setFieldValue("reportToLevel", "");
                            setFieldValue("empFinalAuthorityId", null);
                            setFieldValue("isHODFinalAuthority", false);
                            setFieldValue("isEmpFinalAuthority", false);
                          } else {
                            setFieldValue("customApprovalList", []);
                          }
                        }}
                        onBlur={handleBlur}
                        value={values.isCustomApprover}
                        checked={values.isCustomApprover}
                      />
                      <label className="px-2 font-weight-bold">
                        Custom Approver Workflow
                      </label>
                      <ErrorMessage
                        className="form-feedBack"
                        name="isCustomApprover"
                        component="div"
                      />
                    </div>
                  </div> */}
                  {/* custom approver workflow area  */}
                  <div
                    className="col-12 col-md-12 mt-3"
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <fieldset disabled={!values?.isCustomApprover}>
                      <CustomApprovalWorkflowTable
                        isUserForRead={isUserForRead}
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </fieldset>
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isUserForRead ? (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )}

            <> </>
            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
};

export default DesignationWorkflowEditForm;
