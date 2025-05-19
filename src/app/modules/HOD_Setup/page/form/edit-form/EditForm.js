import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllDepartment,
  fetchAllRecordForEmployeelist,
} from "../../../redux/reduxaction";

const formSchema = Yup.object().shape({
  departmentId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  empId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export const EditForm = ({
  data,
  isUserForRead,
  actionsLoading,
  onHide,
  loading,
  handleSubmit,
  enableLoading,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllDepartment());
  }, []);
  const { allDept, employeeList } = useSelector(
    (state) => ({
      allDept: state?.hod_setup?.departmentList,
      employeeList: state?.hod_setup?.employeeList,
    }),
    shallowEqual
  );
  useEffect(() => {
    if (data?.departmentId !== null) {
      dispatch(fetchAllRecordForEmployeelist(data?.departmentId));
    }
  }, [data?.departmentId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={formSchema}
      onSubmit={async (values) => {
        enableLoading();
        handleSubmit(values);
      }}
    >
      {({ handleSubmit, errors, touched, setFieldValue, values }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="from-group row">
                  <div className="col-12 col-md-12 row p-0 m-0">
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="departmentId"
                        isDisabled={isUserForRead}
                        label={
                          <span>
                            Department <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("departmentId", e.value || null);
                          setFieldValue("empId", null);
                          dispatch(fetchAllRecordForEmployeelist(e.value));
                        }}
                        value={
                          allDept?.find(
                            (e) => e?.value === values?.departmentId
                          ) || data?.Id
                            ? [
                                ...allDept,
                                {
                                  value: data?.department?.deptId,
                                  label: data?.department?.deptName,
                                },
                              ]?.find((e) => e?.value === values?.departmentId)
                            : null
                        }
                        options={
                          data?.Id
                            ? [
                                ...allDept,
                                {
                                  value: data?.department?.deptId,
                                  label: data?.department?.deptName,
                                },
                              ]
                            : allDept
                        }
                        error={errors.departmentId}
                        touched={touched.departmentId}
                      />
                    </div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="empId"
                        label={
                          <span>
                            Employee <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={!values?.departmentId || isUserForRead}
                        onChange={(e) => {
                          setFieldValue("empId", e.value || null);
                        }}
                        value={
                          employeeList?.find(
                            (e) => e?.value === values?.empId
                          ) || null
                        }
                        options={employeeList}
                        error={errors.empId}
                        touched={touched.empId}
                      />
                    </div>
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
                Ok
              </button>
            )}

            <> </>
            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
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
