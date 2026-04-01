import React from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

const formValidation = Yup.object().shape({
  remarks: Yup.string().when("status", {
    is: "Rejected",
    then: Yup.string().required("Remarks are required when rejecting"),
    otherwise: Yup.string(),
  }),
});

import { Select, TextArea } from "../../../../../../_metronic/_partials/controls";

export function ApprovalCard({ onCancel }) {
  const initialValues = {
    request_status: "",
    authorityRemarks: "",
  };

  const formValidation = Yup.object().shape({
    authorityRemarks: Yup.string().when("request_status", {
      is: "R",
      then: Yup.string().required("Remarks are required when rejecting"),
      otherwise: Yup.string(),
    }),
  });

  return (
    <div className="mt-8 mb-8 font-sans">
      <h5 className="font-bold mb-4 text-dark">Approvals</h5>
      
      <div className="border border-dark p-6 bg-white rounded-0">
        <Formik
          initialValues={initialValues}
          validationSchema={formValidation}
          onSubmit={(values) => console.log("Approval Progressed:", values)}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Form className="form form-label-right">
              <div className="row">
                {/* Status Section */}
                <div className="col-12 col-md-4">
                  <Field
                    name="request_status"
                    component={Select}
                    label={
                      <span>
                        {" "}Status<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    customFeedbackLabel=""
                    onChange={(e) => setFieldValue("request_status", e.target.value)}
                    style={{ border: "1px solid black", borderRadius: "0px" }}
                  >
                    <option value="">(Pending / Approved / Rejected)</option>
                    <option value="A">Approved</option>
                    <option value="R">Rejected</option>
                  </Field>
                </div>

                {/* Remarks Section */}
                <div className="col-12 mt-3">
                  <Field
                    name="authorityRemarks"
                    component={TextArea}
                    label={
                      <span>
                        {" "}Remarks<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    placeholder="Enter your remarks here..."
                    style={{ border: "1px solid black", borderRadius: "0px" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-x-2 mt-8">
                <button
                  type="button"
                  className="btn btn-secondary rounded-0 px-10 font-bold border-dark"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-0 px-10 font-bold border-dark"
                  onClick={() => {
                    setFieldValue("request_status", "R");
                    handleSubmit();
                  }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-success rounded-0 px-10 font-bold border-dark"
                  onClick={() => {
                    setFieldValue("request_status", "A");
                    handleSubmit();
                  }}
                >
                  Approve
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
