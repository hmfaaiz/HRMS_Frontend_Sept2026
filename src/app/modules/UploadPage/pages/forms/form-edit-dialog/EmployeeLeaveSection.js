import React, { useRef, useState } from "react";
import { Accordion, Button, Card, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { KeyboardArrowDown } from "@material-ui/icons";
import * as actions from "../../../_redux/formActions";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { Download, Info } from "lucide-react";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";

//Validation for Form
const formValidation = Yup.object().shape({
  file: Yup.mixed().required(VALIDATION_MESSAGES.required)
});

export function EmployeeLeaveSection({ downloadExcel, dispatch  , setHelp}) {
  const [loading, setLoading] = useState(false);
  //This ref is to get reference of file field. It will be used to clear field when reseting form
  const inputFile = useRef(null);

  const onClick = (e) => {
    e.preventDefault();
    downloadExcel(document, 'employee_leave', 'Employee_Leave_Template')
  }

  return (
    // <>
    //   <Formik
    //     enableReinitialize={true}
    //     initialValues={{ file: null }}
    //     validationSchema={formValidation}
    //     onSubmit={(values, { resetForm }) => {
    //       if (values.file) {
    //         const formData = new FormData()
    //         formData.append('file', values.file)
    //         setLoading(true)

    //         const clearForm = () => {
    //           resetForm();
    //           if (inputFile?.current) {
    //             inputFile.current.value = "";
    //           }
    //         }

    //         dispatch(actions.saveLeaveData(formData, setLoading, clearForm))
    //       }
    //     }}
    //   >
    //     {({
    //       handleSubmit,
    //       errors,
    //       values,
    //       handleBlur,
    //       handleChange,
    //       setFieldValue,
    //       handleReset
    //     }) => (
    //       <Accordion defaultActiveKey="">
    //         <Card>
    //           <Card.Header>
    //             <div className='accordion-header-btn'>
    //               <Accordion.Toggle as={Button} eventKey="0">
    //                 Data Upload - Employee Leave Balance
    //                 <KeyboardArrowDown />
    //               </Accordion.Toggle>
    //             </div>
    //           </Card.Header>
    //           <Accordion.Collapse eventKey="0">
    //             <Card.Body>

    //               {/* Form Start */}
    //               <Form className="form form-label-right">
    //                 <fieldset>

    //                   <div className="from-group row">
    //                     <div className="col-12 col-md-4 mt-3">
    //                     </div>

    //                     <div className="col-12 col-md-4 mt-3" style={{ textAlign: "center", textDecoration: 'underline' }}>
    //                       <a><span onClick={onClick}>Download - Employee Leave Balance Template</span></a>
    //                     </div>

    //                     <div className="col-12 col-md-4 mt-3">
    //                     </div>
    //                   </div>

    //                   {/* File Field Start */}
    //                   <hr />
    //                   <input
    //                     name="file"
    //                     type="file"
    //                     className={errors?.file && !values.file ? 'form-control is-invalid' : 'form-control'}
    //                     accept=".xlsx,.xls"
    //                     ref={inputFile}
    //                     onChange={(event) => {
    //                       // Update Formik's value
    //                       const file = event.currentTarget.files[0];
    //                       setFieldValue("file", file);
    //                     }}
    //                   />
    //                   {
    //                     errors.file && !values.file && <CustomErrorLabel touched={true} error={errors.file} />
    //                   }
    //                   <hr />
    //                   {/* File Field End */}

    //                   <button
    //                     type="submit"
    //                     disabled={loading}
    //                     className="btn btn-primary btn-elevate"
    //                   >
    //                     Save
    //                     {loading && (
    //                       <span className="ml-3 mr-3 spinner spinner-white"></span>
    //                     )}
    //                   </button>

    //                 </fieldset>
    //               </Form>
    //               {/* Form End */}
    //             </Card.Body>
    //           </Accordion.Collapse>
    //         </Card>
    //       </Accordion>
    //     )}
    //   </Formik>
    // </>
        <Formik
          enableReinitialize={true}
          initialValues={{ file: null }}
          validationSchema={formValidation}
          onSubmit={(values, { resetForm }) => {
            if (values.file) {
              const formData = new FormData();
              formData.append("file", values.file);
              setLoading(true);
    
              const clearForm = () => {
                resetForm();
                if (inputFile?.current) {
                  inputFile.current.value = "";
                }
              };
    
              dispatch(
                actions.saveLeaveData(formData, setLoading, clearForm)
              );
            }
          }}
        >
          {({ errors, values, setFieldValue }) => (
            <div className="px-3 py-2 rounded-lg bg-white overflow-y-auto">
              <div className="flex justify-between">
                <h6 className="font-bold mb-0 text-primary my-2">
                  Employee Leave Balance <OverlayTrigger
                overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
              >
                <a
                  title=""
                  className=""
                  onClick={() => setHelp("employee_leave")}
                >
                  <Info className="w-4 h-4 text-black cursor-pointer mb-1 ml-1" />
                </a>
              </OverlayTrigger>
                </h6>
                <button className="btn bg-tsecondary" onClick={onClick}>
                  Template{" "}
                  <Download className="w-3 h-3 mb-1 text-black cursor-pointer" />
                </button>
              </div>
              <Form className="form form-label-right">
                <fieldset className="space-y-2 mt-2">
                  <div>
                    <FileUpload
                      label={"Upload"}
                      name="file"
                      id={"leave"}
                      onChange={(event) => {
                        // Update Formik's value
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}
                      isEdit={loading}
                      fileName={values?.file?.name}
                      inputFile={inputFile}
                      accept=".xlsx,.xls"
                      error={errors}
                    />
                  </div>
    
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-elevate"
                  >
                    Save
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </fieldset>
              </Form>
            </div>
          )}
        </Formik>
  );
}
