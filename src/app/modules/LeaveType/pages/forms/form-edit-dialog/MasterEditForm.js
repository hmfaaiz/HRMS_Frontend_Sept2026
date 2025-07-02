import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

//Validation for Form
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.array()
  .of(Yup.string().required(VALIDATION_MESSAGES.required))
  .required(VALIDATION_MESSAGES.required)
  .min(1, "At least one subsidiary ID is required"),
  type: Yup.number().required(VALIDATION_MESSAGES.required),
  name: Yup.string().trim().required(VALIDATION_MESSAGES.required),
  code: Yup.string().required(VALIDATION_MESSAGES.required).matches(/^[A-Za-z]{1,3}$/, 'Code must contain only letters (A-Z)'),
});

export function MasterEditForm({
  dropdownData,
  submitForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  allSubsidiaryList
}) {

  const dropdown = (data) => {
    return [{ value: "", label: "--Select--" }, ...data].map((el) => {
      return (<>
        <option value={el.value}>{el.label}</option>
      </>)
    })
  }

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map(item => [item.value, item]));
  }, [allSubsidiaryList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          submitForm(values)
        }}
      >
        {({
          handleSubmit,
          errors,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          touched
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
                  <div className="from-group row">

                    <div className="col-12 col-md-4 mt-3">
                      Subsidiary
                      <div style={{ backgroundColor: "#ffffff", height: "170px", padding: "10px", overflow: "scroll" }}>

                        <div className="multi-select">
                          <div className="dropdown-label"></div>
                          <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
                            {allSubsidiaryList.map((option) => (
                              <div key={option.value} className="dropdown-option">
                                <input style={{ width: "25px" }}
                                  name="subsidiaryId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(values?.subsidiaryId?.includes(option?.value?.toString()))}
                                  onChange={handleChange}
                                />
                                {option.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="from-group row">

                    
                    <div className="col-12 col-md-6 mt-3">
                      <Field
                        name="code"
                        component={Input}
                        maxLength="3"
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <span>
                            {" "}
                            Code<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.code}
                        autoComplete="off"
                      />
                    </div>

                    
                    <div className="col-12 col-md-6 mt-3">
                      <Field
                        name="name"
                        component={Input}
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <span>
                            {" "}
                            Name<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.name}
                        autoComplete="off"
                      />
                    </div>


             

                  </div>

                    <div className="from-group row">
                         <div className="col-12 col-md-6 mt-3">
                      <Field
                        name="type"
                        component={Select}
                        className={errors.type && !values.type ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue('type', e.target.value)
                        }}
                        label={
                          <span>
                            {" "}
                            Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.type}
                        autoComplete="off"
                        children={dropdown(dropdownData)}
                      />
                      {
                        errors.type && !values.type && <CustomErrorLabel touched={true} error={errors.type} />
                      }
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
                  disabled={loading}
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
    </>
  );
}
