import React, { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getFileName, getUploadUrl } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
// percentage: Yup.string().required("Required*"),
const news_event_tickerEditSchema = Yup.object().shape({
  subsidiaryId: Yup.number().nullable(),
  // .required(VALIDATION_MESSAGES.required),

  docName: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.required), 
    
    
    docDesc: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.required),


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
  const inputFile = useRef(null);
  useEffect(() => {
    if (!formData.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch, formData.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.company_doc_portal,
      userAccess: state?.auth?.userAccess["company_doc_portal"],
    };
  }, shallowEqual);




  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      validationSchema={news_event_tickerEditSchema}
      onSubmit={(values) => {
        enableLoading();
      
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">


                  <div className=" ">
                    <div className="col-12 text-black mt-1">
                      <label>
                        Subsidiary
                      </label>

                      <div className="overflow-auto"

                      >
                        <div className="multi-select">

                          <div
                            className="p-0 m-0 "
                            style={{
                              fontSize: "10.2px",

                            }}
                          >
                            {dashboard?.allSubsidiaryList?.map((option) => (
                              <div
                                key={option?.value}
                                className="flex justify-start items-center"
                              >
                                <input className="p-0 m-0 mr-1 "
                                  // style={{ width: "25px" }}
                                  name="subsidiaryId"
                                  type="checkbox"
                                  value={option?.value}
                                  checked={Boolean(
                                    values?.subsidiaryId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />

                                {option?.label}
                              </div>
                            ))}
                            {errors.subsidiaryId &&
                              touched.subsidiaryId && (
                                <div className="invalid-text">
                                  {errors.subsidiaryId}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>


                <div className="grid grid-cols-3 gap-x-3 gap-y-1">

                  <div className="">
                    <Field
                      name="docName"
                      component={Input}
                      placeholder="Enter document name"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Document Name
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div>

                    </div>
                  </div>



                  <div className="">

                    <FileUpload
                      label={
                        <>
                          Companyr Attachment<span style={{ color: "red" }}>*</span>
                        </>
                      }
                      id="file"
                      name="file"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("compAttachment", file);
                      }}


                    />
                    {errors.compAttachment && touched.compAttachment && (
                      <div className="invalid-feedback">{errors.compAttachment}</div>
                    )}




                    {(formData?.compAttachment || values?.compAttachment) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.compAttachment || formData?.compAttachment) === "string"
                              ? getUploadUrl(values?.compAttachment || formData?.compAttachment)
                              : URL.createObjectURL(values?.compAttachment || formData?.compAttachment)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.compAttachment || formData?.compAttachment) === "string"
                            ? getFileName(values?.compAttachment || formData?.compAttachment)
                            : (values?.compAttachment)?.name || formData?.compAttachment}
                        </a>
                      </div>
                    )}

                  </div>



                </div>
                <div className="">
                  <Field
                    name="docDesc"
                    component={TextArea}
                    placeholder="Enter document description"
                    className="form-control" // Force full height
                    label={
                      <span>
                        {" "}
                        Document Description
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    autoComplete="off"
                  />
                  <div>

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
