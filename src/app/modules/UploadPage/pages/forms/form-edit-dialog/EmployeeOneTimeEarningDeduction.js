import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import * as actions from "../../../_redux/formActions";
import { Download } from "lucide-react";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";

//Validation for Form
const formValidation = Yup.object().shape({
  file: Yup.mixed().required(VALIDATION_MESSAGES.required),
});

export function EmployeeOneTimeAllowancesSection({ downloadExcel, dispatch }) {
  //This ref is to get reference of file field. It will be used to clear field when reseting form
  const inputFile = useRef(null);
  const [loading, setLoading] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    downloadExcel(
      document,
      "Onetime_Earning_Deduction_Template",
      "Onetime_Earning_Deduction_Template"
    );
  };

  return (
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
            actions.saveEmployeeOneTimeEarningDeductionData(formData, setLoading, clearForm)
          );
        }
      }}
    >
      {({ errors, values, setFieldValue }) => (
        <div className="px-3 py-2 rounded-lg bg-white overflow-y-auto">
          <div className="flex justify-between">
            <h6 className="font-bold mb-0 text-primary my-2">
              Employee Onetime Earning Deduction
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
                  id={"one_time_allowance"}
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
