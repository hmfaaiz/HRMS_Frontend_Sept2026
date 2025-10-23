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
import { fetchAllAppraisalPeriod, fetchAllApprovedResignedEmp } from "../../../../Dashboard/_redux/dashboardActions";
import { fetchDesignationWiseGoalSetupByEmp } from "../../../_redux/redux-Actions";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { Eye, XCircle } from "lucide-react";



const employeeEditSchema = Yup.object().shape({
  employeeId: Yup.number().required(VALIDATION_MESSAGES.required),


  list: Yup.array()
    .of(
      Yup.object().shape({



        departmentId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        designationId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        approverEmployeeId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),

        isClearanceProvided: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),




        sno: Yup.number().required(VALIDATION_MESSAGES.required),

        clearanceDate: Yup.date()
          .nullable()
          .when("isClearanceProvided", {
            is: 1,
            then: (schema) => schema.required(VALIDATION_MESSAGES.required),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
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
  loading, setPanelMode, panelMode
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [clearanceDate, setClearanceDate] = useState()

  useEffect(() => {

      dispatch(
      fetchAllApprovedResignedEmp(
        "approvedResignedEmpList"
      )
    );




  }, [dispatch, data.employeeId]);



  useEffect(() => {
    if (data?.employeeId && dashboard?.approvedResignedEmpList?.length > 0) {
      const selected = dashboard.approvedResignedEmpList.find(
        (option) => Number(option?.value) === Number(data?.employeeId)
      );

      setClearanceDate(selected || null);
      console.log("setting111 fixed", selected);
    }
  }, [dashboard?.approvedResignedEmpList]);


  const { currentState } = useSelector(
    (state) => {
      return {
        currentState: state.exit_clearance,

      }
    },
    shallowEqual
  );


  const { entities } = currentState;


console.log('data.Id1111111,',data.dataIsExist)
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

          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                <div className="grid md:grid-cols-9 gap-x-3 gap-y-1 ">

                  <div className="col-span-3">
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
                        if (e.value) {
                          dispatch(
                            fetchDesignationWiseGoalSetupByEmp({ employeeId: e.value, designationId: e.designationId })
                          );
                        }



                      }}
                      value={
                        dashboard?.approvedResignedEmpList?.find(
                          (option) => option?.value == values?.employeeId
                        ) || null
                      }
                      options={dashboard?.approvedResignedEmpList}


                      error={errors.employeeId}
                      touched={touched.employeeId}
                    />
                  </div>
                  <div className="mt-6 col-span-1">



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

                <EmployeeProfile
                  employeeId={values.employeeId}
                  panelMode={panelMode}
                />
                <hr />
                <div>
                  <PatternListForm
                    values={values}

                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}

                    isdataForRead={isdataForRead}
                    clearanceDate={clearanceDate}
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
                Save {data.Id}
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
         {(!isdataForRead && data?.dataIsExist) && (
              <button
                type="submit"
                // onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={isdataForRead || values.list?.some(item => item?.isClearanceProvided == 0)}
               onClick={() =>{
                setFieldValue("isApproved",1)
                 handleSubmit()
                
                }
                
                
                }
             >
                Approve
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
