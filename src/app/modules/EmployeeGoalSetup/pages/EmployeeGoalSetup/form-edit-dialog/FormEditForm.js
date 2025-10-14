import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllEmployeesWithNoPermissionData,
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";
import { fetchAllAppraisalPeriod } from "../../../../Dashboard/_redux/dashboardActions";
import { fetchDesignationWiseGoalSetupByEmp } from "../../../_redux/redux-Actions";



const employeeEditSchema = Yup.object().shape({
  employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
  appraisalPeriodId: Yup.number().required(VALIDATION_MESSAGES.required),

  list: Yup.array()
    .of(
      Yup.object().shape({
        goalName: Yup.string()
          .trim()
          .nullable()
          .max(50, "Maximum 50 characters allowed")
          .required(VALIDATION_MESSAGES.required),

        goalDescription: Yup.string()
          .trim()
          .max(100, "Maximum 100 characters allowed")
          .nullable()
          .required(VALIDATION_MESSAGES.required),

        weightage: Yup.number()
          .typeError("Only numbers are allowed")
          .transform((value, originalValue) => {

            return originalValue === "" ? null : value;
          })
          .min(1, "Minimum is 1%")
          .max(100, "Maximum is 100%")
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        competencyId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),


        isManadatory: Yup.boolean(),
        isActive: Yup.boolean(),

        sno: Yup.number().required(VALIDATION_MESSAGES.required),
        targetDate: Yup.date().nullable().required(VALIDATION_MESSAGES.required),
      })
    )


});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [appraisalPeriod, setAppraisalPeriod] = useState()

  useEffect(() => {

    // dispatch(fetchAllFormsMenu(158, "allEmployeesWithNoPermissionList"));
    dispatch(
      fetchAllEmployeesWithNoPermissionData(
        "allEmployeesWithNoPermissionList"
      )
    );

    if (data?.employeeId) {
      dispatch(
        fetchAllAppraisalPeriod(data?.employeeId)
      );
      // console.log("setting111", data.appraisalPeriodId, dashboard?.appraisalPeriodList?.find(
      //   (option) => option?.value == data.appraisalPeriodId
      // ))

      // setAppraisalPeriod(dashboard?.appraisalPeriodList?.find(
      //   (option) => option?.value == data.appraisalPeriodId
      // ) || null)
    }


  }, [dispatch, data.employeeId]);

  const { currentState } = useSelector(
    (state) => {
      return {
        currentState: state.employee_goal_setup,

      }
    },
    shallowEqual
  );


  const { entities } = currentState;



  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...data,

      }}
      validationSchema={employeeEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          {console.log("erros111", errors)}
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="employeeId"
                      label={
                        <span>
                          Employee<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data.dataIsExist}
                      onChange={(e) => {
                        setFieldValue("employeeId", e.value || null);
                        setFieldValue("list", []);
                        dispatch(
                          fetchAllAppraisalPeriod(e.value)
                        );

                        if (e.value && values.appraisalPeriodId) {
                          dispatch(
                            fetchDesignationWiseGoalSetupByEmp({ employeeId: e.value, appraisalPeriodId: values.appraisalPeriodId })
                          );
                        }



                      }}
                      value={
                        dashboard?.allEmployeesWithNoPermissionList?.find(
                          (option) => option?.value == values?.employeeId
                        ) || null
                      }
                      options={dashboard?.allEmployeesWithNoPermissionList}


                      error={errors.employeeId}
                      touched={touched.employeeId}
                    />
                  </div>

                  <div>
                    <SearchSelect
                      name="appraisalPeriodId"
                      label={
                        <span>
                          Appraisal Period <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data.dataIsExist || !values.employeeId}
                      onChange={(e) => {
                        setFieldValue("appraisalPeriodId", e.value || null);

                        setAppraisalPeriod(dashboard?.appraisalPeriodList?.find(
                          (option) => option?.value == e?.value
                        ) || null)
                        if (values.list && values.list.length > 0) {
                          const updatedList = values.list.map((item) => ({
                            ...item,
                            targetDate: "", // or null, if you want to nullify
                          }));
                          setFieldValue("list", updatedList);
                        }

                        if (values.employeeId && e.value) {
                          dispatch(
                            fetchDesignationWiseGoalSetupByEmp({ employeeId: values.employeeId, appraisalPeriodId: e.value })
                          );
                        }

                      }}
                      value={
                        dashboard?.appraisalPeriodList?.find(
                          (option) => option?.value == values?.appraisalPeriodId
                        ) || null
                      }
                      options={dashboard?.appraisalPeriodList}


                      error={errors.appraisalPeriodId}
                      touched={touched.appraisalPeriodId}
                    />
                  </div>




                </div>
                <hr />
                <div>
                  <PatternListForm
                    values={values}

                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    // dropdownData={{
                    //   // allEmployeeShifts: dashboard?.allEmployeeShifts
                    //   allEmployeeShifts: dashboard?.allEmployeeShifts?.filter(
                    //     (shift) => shift.subsidiaryId === values.subsidiaryId
                    //   ),
                    // }}
                    isdataForRead={isdataForRead}
                    appraisalPeriod={appraisalPeriod}
                  />
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isdataForRead ? (
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

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

            {!isdataForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={!values?.list?.length}
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
}
