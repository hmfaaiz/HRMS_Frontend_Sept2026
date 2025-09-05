import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import {  useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";


const roster_patternEditSchema = Yup.object().shape({





  exitTypeId: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  list: Yup.array().of(
    Yup.object().shape({
      exitReason: Yup.string().trim()
       .max(30, "Maximum 30 characters allowed")
       .required(VALIDATION_MESSAGES.required),
      sno: Yup.number().required(VALIDATION_MESSAGES.required),
    })
  ),
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


  useEffect(() => {
   
      dispatch(fetchAllFormsMenu(526, "allExitTypeList"));

  }, [dispatch, data.Id]);




  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...data,
        
      }}
      validationSchema={roster_patternEditSchema}
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
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="exitTypeId"
                      label={
                        <span>
                          Exit Type<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data.dataIsExist}
                      onChange={(e) => {
                        setFieldValue("exitTypeId", e.value || null);
                        setFieldValue("list", []);
                      }}
                      value={
                        dashboard?.allExitTypeList?.find(
                          (option) => option?.value == values?.exitTypeId
                        ) || null
                      }
                      options={dashboard?.allExitTypeList}
                      error={errors.exitTypeId}
                      touched={touched.exitTypeId}
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
