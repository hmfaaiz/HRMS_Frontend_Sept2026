import { Field, Formik } from "formik";
import React, { useMemo, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog";

const formValidation = Yup.object().shape({
  authorityRemarks: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
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
      setLeaveData: FormUIContext?.setLeaveData,
      queryParams: FormUIContext?.queryParams,
    };
  }, [FormUIContext]);

  const { user } = useSelector((state) => {
    return {
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const handleRequestSubmit = async (values, resetForm) => {
    setLoading(true);
    await dispatch(actions.handleLeaveRequest(values, resetForm, setLoading))
      .then(async () => {
        formUIProps.setIds([]);
        formUIProps.setLeaveData(null);
        await dispatch(
          actions.fetchLeaveApprovalApplication(
            formUIProps?.queryParams?.filter
          )
        );
      })
      .catch(async () => {
        formUIProps.setIds([]);
        formUIProps.setLeaveData(null);
        await dispatch(
          actions.fetchLeaveApprovalApplication(
            formUIProps?.queryParams?.filter
          )
        );
      });
  };

  const handleActionClick = async (action, setFieldValue, values, validateForm) => {
    // First, validate the remarks field
    const errors = await validateForm();
    
    if (action === "R" && errors.authorityRemarks) {
      // Set touched to show validation error
      formikRef.current?.setFieldTouched("authorityRemarks", true);
      return; // Stop here, don't open modal
    }
    
    // For Approve action, check if remarks is required (you can decide)
    // If remarks is also required for Approve, uncomment below
    // if (action === "A" && errors.authorityRemarks) {
    //   formikRef.current?.setFieldTouched("authorityRemarks", true);
    //   return;
    // }

    // If validation passes, show confirmation modal
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
        {({ values, handleSubmit, handleBlur, setFieldValue, validateForm, errors, touched }) => (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => handleActionClick("A", setFieldValue, values, validateForm)}
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
              onClick={() => handleActionClick("R", setFieldValue, values, validateForm)}
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