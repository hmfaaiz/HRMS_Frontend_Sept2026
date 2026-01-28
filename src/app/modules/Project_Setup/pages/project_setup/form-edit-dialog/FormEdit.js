import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Input,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import {
  getLatestTableId,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { fetchAllActiveCustomers } from "../../../../Dashboard/_redux/dashboardActions";

/* ---------------- VALIDATION ---------------- */

const formSchema = Yup.object().shape({
  projectName: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Za-z\s.-]+$/, "Name must only contain letters."),
  projectInitial: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Za-z\s.-]+$/, "Name must only contain letters.")
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .max(5, "Should not be greater than 5"),
  projectTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  projectOwnerEmpId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  accessEmpIds: Yup.array()
    .nullable()
    .optional(),
  customerId: Yup.string()
    .nullable()
    .optional(),
});

/* ---------------- COMPONENT ---------------- */

export function FormEditForm({
  saveForm,
  dataForEdit,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const [defCode, setDefCode] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);

  /* -------- FETCH MASTER DATA -------- */

  useEffect(() => {
    dispatch(fetchAllFormsMenu("547", "allProjectType"));
    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(
        getLatestTableId(
          "t_project_setup", // table name
          "projectCode", // column name
          "1 = 1", // filter
          setDefCode,
        ),
      );
    }
  }, [dispatch, id]);

  /* ---------------- FORM ---------------- */

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...dataForEdit,
        projectCode: id ? dataForEdit?.projectCode : defCode || "",
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        setFieldTouched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
                  {/* Project CODE */}
                  <div>
                    <Field
                      name="projectCode"
                      component={Input}
                      disabled
                      label={
                        <span>
                          Project Code <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>

                  {/* Project NAME */}
                  <div>
                    <Field
                      name="projectName"
                      component={Input}
                      label={
                        <span>
                          Project Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>
                  {/* Project Initials */}
                  <div>
                    <Field
                      name="projectInitial"
                      component={Input}
                      label={
                        <span>
                          Project Initials{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        let val = String(e.target.value).toLocaleUpperCase();
                        setFieldValue("projectInitial", val);
                      }}
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <SearchSelect
                      name="projectTypeId"
                      label={
                        <span>
                          Project Type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={dashboard?.allProjectType?.find(
                        (el) => el?.value === values?.projectTypeId,
                      )}
                      options={dashboard.allProjectType || []}
                      error={errors.projectTypeId}
                      touched={touched.projectTypeId}
                      onChange={(e) => {
                        setFieldValue("projectTypeId", e.value);
                      }}
                    />
                  </div>

                  {/* Project Owner */}
                  <div>
                    <SearchSelect
                      name="projectOwnerEmpId"
                      label={
                        <span>
                          Project Owner <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={dashboard?.allEmployees?.find(
                        (el) => el?.value === values?.projectOwnerEmpId,
                      )}
                      options={dashboard.allEmployees || []}
                      error={errors.projectOwnerEmpId}
                      touched={touched.projectOwnerEmpId}
                      onChange={(e) => {
                        setFieldValue("projectOwnerEmpId", e.value);
                      }}
                    />
                  </div>
                  {/* Project Access to Emp */}
                  <div>
                    <MultiSelect
                      label={<span>Project Access to Employees</span>}
                      options={
                        dashboard?.allEmployees?.map((e) => ({
                          ...e,
                          isDisabled: e?.value == values?.projectOwnerEmpId,
                        })) || []
                      }
                      value={dashboard?.allEmployees?.filter((el) =>
                        values?.accessEmpIds?.includes(String(el.value)),
                      )}
                      onChange={(e) => {
                        setFieldTouched("accessEmpIds", true);
                        if (Array?.isArray(e)) {
                          setFieldValue("accessEmpIds", [
                            ...e?.map((el) => String(el?.value)),
                          ]);
                        }
                      }}
                      error={errors?.accessEmpIds}
                      touched={touched?.accessEmpIds}
                      disabled={isUserForRead || !values?.projectOwnerEmpId}
                    />
                  </div>

                  {/* Project */}
                  <div>
                    <SearchSelect
                      name="customerId"
                      label={<span>Customer</span>}
                      value={dashboard?.allCustomers?.find(
                        (el) => el?.value === values?.customerId,
                      )}
                      options={dashboard.allCustomers || []}
                      error={errors.customerId}
                      touched={touched.customerId}
                      onChange={(e) => {
                        setFieldValue("customerId", e.value);
                      }}
                    />
                  </div>

                  {/* Start & Due Date are Mandatory for Ticket Creation */}
                  <div>
                    <Checkbox
                      children={
                        "Start & Due Date are Mandatory for Ticket Creation"
                      }
                      isSelected={values?.datesMandatory}
                      onChange={(e) =>
                        setFieldValue("datesMandatory", e?.target?.checked)
                      }
                      disabled={isUserForRead}
                    />
                  </div>
                </div>
              </fieldset>
              <div className="d-flex justify-end mt-2">
                <button
                  type="button"
                  disabled={false}
                  onClick={() => setViewDetail(!viewDetail)}
                  className="btn bg-tsecondary"
                >
                  View Employees Access
                </button>
              </div>
              <AccessEmpTable
                accessEmpIds={values?.accessEmpIds}
                projectOwnerEmpId={values?.projectOwnerEmpId}
                viewDetail={viewDetail}
                allEmployees={dashboard?.allEmployees}
              />
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={onHide} className="btn btn-light">
              {isUserForRead ? "OK" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Save
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}

const AccessEmpTable = ({
  accessEmpIds,
  projectOwnerEmpId,
  allEmployees,
  viewDetail,
}) => {
  return (
    <>
      {(accessEmpIds?.length || projectOwnerEmpId) &&
        allEmployees?.length > 0 &&
        viewDetail && (
          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <td>Employee</td>
                    <td>Department</td>
                    <td>Designation</td>
                    <td>Role</td>
                  </tr>
                </thead>
                <tbody>
                  {projectOwnerEmpId && (
                    <tr>
                      <td>
                        {
                          allEmployees?.find(
                            (el) => el?.value == projectOwnerEmpId,
                          )?.label
                        }
                      </td>
                      <td>
                        {
                          allEmployees?.find(
                            (el) => el?.value == projectOwnerEmpId,
                          )?.department
                        }
                      </td>
                      <td>
                        {
                          allEmployees?.find(
                            (el) => el?.value == projectOwnerEmpId,
                          )?.designation
                        }
                      </td>
                      <td>Owner</td>
                    </tr>
                  )}
                  {accessEmpIds?.length > 0 &&
                    accessEmpIds?.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {allEmployees?.find((el) => el?.value == row)?.label}
                        </td>
                        <td>
                          {
                            allEmployees?.find((el) => el?.value == row)
                              ?.department
                          }
                        </td>
                        <td>
                          {
                            allEmployees?.find((el) => el?.value == row)
                              ?.designation
                          }
                        </td>
                        <td>Member</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </>
  );
};
