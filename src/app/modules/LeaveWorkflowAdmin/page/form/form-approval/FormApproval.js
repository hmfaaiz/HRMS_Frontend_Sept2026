import { Field, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { toast } from "react-toastify";

const formValidation = Yup.object().shape({
  authorityRemarks: Yup.string().when("request_status", {
    is: (val) => val === "R",
    then: Yup.string().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.string(),
  }),
});

export const FormApproval = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      Ids: FormUIContext?.Ids,
      setIds: FormUIContext?.setIds,
      setLeaveData: FormUIContext?.setLeaveData,
      queryParams: FormUIContext?.queryParams,
    };
  });

  const { user } = useSelector((state) => {
    return {
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const handleRequestSubmit = async (values, resetForm) => {
    setLoading(true);
    await dispatch(
      actions.handleLeaveRequest(values, resetForm, setLoading)
    ).then(async () => {
      formUIProps.setIds([]);
      formUIProps.setLeaveData(null);
      await dispatch(
        actions.fetchLeaveApprovalApplication(formUIProps?.queryParams?.filter)
      );
    });
  };

  const handleRejectClick = (setFieldValue, handleSubmit, values) => {
    setFieldValue("request_status", "R");

    // Check if remarks are empty when rejecting
    if (!values.authorityRemarks || values.authorityRemarks.trim() === "") {
      toast.error("Remarks are required when rejecting a request");
      return;
    }

    handleSubmit();
  };

  const intVal = {
    authorityRemarks: "",
    request_status: "",
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={intVal}
        validationSchema={formValidation}
        onSubmit={(values, { resetForm }) => {
          let submitValues = { ...values, Ids: formUIProps.Ids };
          if (
            submitValues.request_status === "A" &&
            !submitValues.authorityRemarks
          ) {
            submitValues.authorityRemarks = "Approved";
          }
          handleRequestSubmit(submitValues, resetForm);
          // resetForm({ values: intVal });
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => {
                setFieldValue("request_status", "A");
                handleSubmit();
              }}
              disabled={!(formUIProps?.Ids?.length > 0) || loading}
              className="btn btn-success"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={!(formUIProps?.Ids?.length > 0) || loading}
              onClick={() =>
                handleRejectClick(setFieldValue, handleSubmit, values)
              }
              className="btn btn-danger mx-2"
            >
              Reject
            </button>
            <Form className="form form-label-right">
              <fieldset disabled={formUIProps?.Ids?.length > 0 ? false : true}>
                <div className="from-group row">
                  <div className="col-12 col-md-12 mt-3">
                    <Field
                      name="authorityRemarks"
                      component={TextArea}
                      placeholder=""
                      onChange={(e) => {
                        setFieldValue("authorityRemarks", e.target.value);
                      }}
                      onBlur={handleBlur}
                      label={
                        <span>
                          {" "}
                          Remarks<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={values.authorityRemarks}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </fieldset>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};
