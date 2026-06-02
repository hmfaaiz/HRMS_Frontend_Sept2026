import { Field, Formik } from "formik";
import React, { useMemo, useState, useRef } from "react";
import { Form, Modal } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { initialFilter } from "../../FormUIHelper";
import { toast } from "react-toastify";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog";

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
      setQueryParams: FormUIContext?.setQueryParams, 
    };
  }, [FormUIContext]);

  const { user } = useSelector((state) => {
    return {
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const handleRequestSubmit = async (values, resetForm) => {
    try {
      setLoading(true);
      await dispatch(
        actions.handleAttendanceRequest(values, resetForm, setLoading)
      );
      
      formUIProps.setIds([]);
      formUIProps.setCurrentData(null);
      
      resetForm();
      
      await dispatch(
        actions.fetchAttendanceApprovalApplication(
          formUIProps?.queryParams?.filter || initialFilter,
          user?.employeeIdMapping
        )
      );
    } catch (error) {
      console.error("Error handling request:", error);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleActionClick = async (action, setFieldValue, values) => {
    // validate remarks for reject before showing modal
    if (
      action === "R" &&
      (!values.authorityRemarks || values.authorityRemarks.trim() === "")
    ) {
      formikRef.current?.setFieldTouched("authorityRemarks", true);
      toast.error("Remarks are required for rejection");
      return;
    }

    const result = await confirm(
      action === "A" ? "Approve Request" : "Reject Request",
      `Are you sure you want to ${
        action === "A" ? "approve" : "reject"
      } the selected request(s)?`,
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