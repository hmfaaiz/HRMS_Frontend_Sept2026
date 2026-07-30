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
const employee_docEditSchema = Yup.object().shape({


  empAttachment: Yup.mixed()
    .required(VALIDATION_MESSAGES.required)
    .test("fileSize", "File size must be less than 0.5 MB", (value) => {
      if (typeof value === "string") return true;
      return value && value.size <= 0.5 * 1024 * 1024;
    }),

  docName: Yup.string()
    .trim()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


  docDesc: Yup.string()
    .trim()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading, setId,setReadMode
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
      currentState: state.employee_doc,
      userAccess: state?.auth?.userAccess["employee_doc"],
    };
  }, shallowEqual);


  const activeOptions = [
    { value: false, label: "Inactive" },
    { value: true, label: "Active" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      validationSchema={employee_docEditSchema}
      onSubmit={(values, { resetForm }) => {
        enableLoading();
        const clearForm = () => {
      
          resetForm();
          if (inputFile?.current) {
            inputFile.current.value = "";
          }
        };
        saveForm(values,clearForm);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange, handleReset }) => (
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
                          Employee Attachment<span style={{ color: "red" }}>*</span>
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
                        setFieldValue("empAttachment", file);
                      }}


                    />
                    {errors.empAttachment && touched.empAttachment && (
                      <div className="invalid-feedback">{errors.empAttachment}</div>
                    )}




                    {(formData?.empAttachment || values?.empAttachment) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.empAttachment || formData?.empAttachment) === "string"
                              ? getUploadUrl(values?.empAttachment || formData?.empAttachment)
                              : URL.createObjectURL(values?.empAttachment || formData?.empAttachment)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.empAttachment || formData?.empAttachment) === "string"
                            ? getFileName(values?.empAttachment || formData?.empAttachment)
                            : (values?.empAttachment)?.name || formData?.empAttachment}
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
            {/* {!isUserForRead ? ( */}
              <button
                type="reset"
                onClick={() => {
                  setId("");
                  handleReset();
                  setReadMode(false)

                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            {/* ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )} */}

            {!isUserForRead && (
              <button
                type="button"
                onClick={() => {
                  handleSubmit();
                  // setId("");
                  // handleReset();

                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
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
}
