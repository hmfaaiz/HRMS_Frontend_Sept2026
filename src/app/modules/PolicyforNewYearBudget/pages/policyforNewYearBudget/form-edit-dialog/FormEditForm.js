import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllDepartmentBySubsidiaryIds } from "../../../../Dashboard/_redux/dashboardActions";

// percentage: Yup.string().required("Required*"),
const policy_for_new_year_budgetEditSchema = Yup.object().shape({

  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),


  exceed_strength_upto: Yup.number().required(VALIDATION_MESSAGES.required),
  exceed_amounth_upto: Yup.number().required(VALIDATION_MESSAGES.required),

  departmentId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [start_date, setStart_date] = useState();
  const [end_date, setEnd_date] = useState();
  const [diffInDate, setDiffInDate] = useState();
  useEffect(() => {
    if (!formData?.Id) {
  
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
       dispatch(fetchAllDepartmentBySubsidiaryIds([formData?.subsidiaryId] || [0]));
    }
  }, [dispatch, formData?.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.policy_for_new_year_budget,
      userAccess: state?.auth?.userAccess["policy_for_new_year_budget"],
    };
  }, shallowEqual);


  const defaultSubsidiary = dashboard?.allSubsidiaryList?.find(
    (item) => item.isDefault
  );
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        subsidiaryId: defaultSubsidiary?.value || null
      }}
      validationSchema={policy_for_new_year_budgetEditSchema}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,
        
        };

        saveForm(payload);
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
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">
                     
                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                            dispatch(fetchAllDepartmentBySubsidiaryIds( [e.value] || [0]));
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          dispatch(fetchAllDepartmentBySubsidiaryIds( [e.value] || [0]));
                        }}
                      />
                    </div>

                  </div>
            

                  <div className="col-span-1">
                    <SearchSelect
                      name="departmentId"
                      label={
                        <span>
                          Department<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("departmentId", e.value || null);
                      }}
                      value={
                        dashboard?.departmentBySubIdsList?.find(
                          (option) => option.value === values.departmentId
                        ) || null
                      }
                      options={dashboard?.departmentBySubIdsList}
                 
                      error={errors.departmentId}
                      touched={touched.departmentId}
                    />
                  </div>


                  <div className="col-span-1">
                    <label>
                      <span>
                        Exceed Strength Upto<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="exceed_strength_upto"
                      component={Input}
             
                      type="number"
                
                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      <span>
                       Exceed Amount Upto<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="exceed_amounth_upto"
                      component={Input}
                  
                    
                      type="number"
                 
                    />
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
}
