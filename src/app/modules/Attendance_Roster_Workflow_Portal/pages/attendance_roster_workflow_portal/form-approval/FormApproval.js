import { Field, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";

const formValidation = Yup.object().shape({
  authorityRemarks: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export const FormApproval = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(
    () => ({
      Ids: FormUIContext?.Ids,
      setIds: FormUIContext?.setIds,
      setCurrentData: FormUIContext?.setCurrentData,
      queryParams: FormUIContext?.queryParams,
      user: FormUIContext?.user,
    }),
    [FormUIContext],
  );

  const { user } = useSelector(
    (state) => ({ user: state?.auth?.user }),
    shallowEqual,
  );

  const handleRequestSubmit = async (values, resetForm) => {
    setLoading(true);
    await dispatch(
      actions.handleRosterWorkflowRequest(values, resetForm, setLoading),
    ).then(async () => {
      formUIProps.setIds([]);
      formUIProps.setCurrentData(null);
      await dispatch(
        actions.fetchRosterApprovalApplication(
          formUIProps?.queryParams,
          user?.employeeIdMapping,
        ),
      );
    });
  };

  const handleRejectClick = (setFieldValue, handleSubmit) => {
    setFieldValue("request_status", "R");
    handleSubmit();
  };

  return (
    <Formik
      enableReinitialize
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
            onClick={() => handleRejectClick(setFieldValue, handleSubmit)}
            className="btn btn-danger mx-2"
          >
            Reject
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
  );
};
