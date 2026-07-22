import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllEmployeesWithNoPermissionData,
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";
import { fetchAllApprovedResignedEmp } from "../../../../Dashboard/_redux/dashboardActions";
import { fetchDesignationWiseGoalSetupByEmp } from "../../../_redux/redux-Actions";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { Eye, XCircle } from "lucide-react";
import OnboardChecklistForm from "./OnboardChecklistForm";

const employeeEditSchema = Yup.object().shape({
  employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
  patternList: Yup.array().of(  // Changed from "list" to "patternList"
    Yup.object().shape({
      departmentId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
      designationId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
      approverEmployeeId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
      isClearanceProvided: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
      sno: Yup.number().required(VALIDATION_MESSAGES.required),
      clearanceDate: Yup.date()
        .nullable()
        .when("isClearanceProvided", {
          is: 1,
          then: (schema) => schema.required(VALIDATION_MESSAGES.required),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
    })
  ),
  onboardChecklist: Yup.array(), // Add validation if needed
});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
  setPanelMode,
  panelMode
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [clearanceDate, setClearanceDate] = useState();

  const { entities } = useSelector(
    (state) => state.exit_clearance,
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchAllApprovedResignedEmp("approvedResignedEmpList"));
  }, [dispatch]);

  useEffect(() => {
    if (data?.employeeId && dashboard?.approvedResignedEmpList?.length > 0) {
      const selected = dashboard.approvedResignedEmpList.find(
        (option) => Number(option?.value) === Number(data?.employeeId)
      );
      setClearanceDate(selected || null);
    }
  }, [dashboard?.approvedResignedEmpList, data?.employeeId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...data,
        // patternList: data.patternList || data.list?.map(item => ({
        //   ...item,
        //   isClearanceProvided: item.isClearanceProvided ?? 0
        // })) || [],
        patternList: (data.patternList || data.list || []).map(item => ({
          ...item,
          isClearanceProvided: item.isClearanceProvided ?? 0,
        })) || [],
        onboardChecklist: (data.onboardChecklist || (data.list?.filter(item => item.returnableAssets === true) || [])).map(item => ({
          ...item,
          returnDate: item.assetReturnDate || "",
          remarks: item.assetReturnRemarks || ""
        }))
      }}
      validationSchema={employeeEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        console.log("ok1111",
          values.patternList.map(item => ({
            isClearanceProvided: item.isClearanceProvided,
            type: typeof item.isClearanceProvided
          }))
        ),
        <>

          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                <div className="grid md:grid-cols-9 gap-x-3 gap-y-1">
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
                        setFieldValue("patternList", []);  // Changed from "list" to "patternList"
                        setFieldValue("onboardChecklist", []);  // Also clear onboardChecklist
                        if (e.value) {
                          dispatch(
                            fetchDesignationWiseGoalSetupByEmp({
                              employeeId: e.value,
                              designationId: e.designationId
                            })
                          );
                        }
                      }}
                      value={
                        dashboard?.approvedResignedEmpList?.find(
                          (option) => option?.value == values?.employeeId
                        ) || null
                      }
                      options={
                        dashboard?.approvedResignedEmpList?.map((opt) => ({
                          ...opt,
                          isDisabled: entities?.some((ent) => ent.employeeId === opt.value),
                        })) || []
                      }
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

                <div>
                  <OnboardChecklistForm
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isdataForRead={isdataForRead}
                    isApproved={values.isApproved}
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

            {!isdataForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={!values?.patternList?.length}
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}

            {(!isdataForRead && data?.dataIsExist) && (
              <button
                type="button"
                className="btn btn-primary btn-elevate"
                disabled={isdataForRead || values.patternList?.some(item => item?.isClearanceProvided == 0)}
                onClick={() => {
                  setFieldValue("isApproved", 1);
                  handleSubmit();
                }}
              >
                Finalize
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