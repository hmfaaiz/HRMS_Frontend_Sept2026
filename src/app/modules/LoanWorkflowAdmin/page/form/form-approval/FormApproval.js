import { Field, Formik } from "formik";
import React, { useMemo, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/formAction";
import { toast } from "react-toastify";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog"; // ✅ import hook

const formValidation = Yup.object().shape({
  authorityRemarks: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required), // Always required
});

export const FormApproval = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); 
  const formikRef = useRef(null);
  const { confirm, ConfirmationComponent } = useConfirmationDialog();
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      Ids: FormUIContext?.Ids,
      setIds: FormUIContext?.setIds,
      setCurrentData: FormUIContext?.setCurrentData,
      queryParams: FormUIContext?.queryParams,
    };
  }, [FormUIContext]);

  const handleRequestSubmit = async (values, resetForm) => {
      try {
        setLoading(true);
        await dispatch(
          actions.handleLoanRequest(values, resetForm, setLoading)
        );
        formUIProps.setIds([]);
        formUIProps.setCurrentData(null);
        await dispatch(
          actions.fetchLoanWorkflow(formUIProps?.queryParams?.filter)
        );
      } catch {
        // error handled in action
      } finally {
        setLoading(false);
        setPendingAction(null);
      }
    };

    const handleActionClick = async (action, setFieldValue, values) => {
    // validate remarks for reject before showing modal
    if (action === "R" && (!values.authorityRemarks || values.authorityRemarks.trim() === "")) {
      formikRef.current?.setFieldTouched("authorityRemarks", true);
      return;
    }

    const result = await confirm(
      action === "A" ? "Approve Request" : "Reject Request",
      `Are you sure you want to ${action === "A" ? "approve" : "reject"} the selected request(s)?`,
      "Cancel",
      action === "A" ? "Approve" : "Reject",
    );

    if (!result) {
      setPendingAction(null);
      return;
    }

    setPendingAction({ action });
    setFieldValue("request_status", action);
    setTimeout(() => {
      formikRef.current?.handleSubmit();
    }, 50);
  };


  const intVal = {
    authorityRemarks: "",
    request_status: "",
  };

  return (
    <>
      <ConfirmationComponent />

      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={{ authorityRemarks: "", request_status: "" }}
        validationSchema={formValidation}
        onSubmit={(values, { resetForm }) => {
          const submitValues = { ...values, Ids: formUIProps.Ids };
          handleRequestSubmit(submitValues, resetForm);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => handleActionClick("A", setFieldValue, values)}
              disabled={!(formUIProps?.Ids?.length > 0) || loading}
              className="btn btn-success"
            >
              Approve
              {loading && pendingAction?.action === "A" && (
                <span className="ml-2 spinner spinner-white"></span>
              )}
            </button>

            <button
              type="button"
              disabled={!(formUIProps?.Ids?.length > 0) || loading}
              onClick={() => handleActionClick("R", setFieldValue, values)}
              className="btn btn-danger mx-2"
            >
              Reject
              {loading && pendingAction?.action === "R" && (
                <span className="ml-2 spinner spinner-white"></span>
              )}
            </button>

            <Form className="form form-label-right">
              <fieldset disabled={!(formUIProps?.Ids?.length > 0)}>
                <div className="from-group row">
                  <div className="col-12 col-md-12 mt-3">
                    <Field
                      name="authorityRemarks"
                      component={TextArea}
                      placeholder=""
                      onChange={(e) =>
                        setFieldValue("authorityRemarks", e.target.value)
                      }
                      onBlur={handleBlur}
                      label={
                        <span>
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
