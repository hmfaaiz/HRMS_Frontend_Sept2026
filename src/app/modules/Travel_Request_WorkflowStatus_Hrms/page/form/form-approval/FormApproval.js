import { Field, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/formActions";

const formValidation = Yup.object().shape({
  authorityRemarks: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export const FormApproval = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      Ids: FormUIContext?.Ids,
      setIds: FormUIContext?.setIds,
      setTravelData: FormUIContext?.setTravelData,
      queryParams: FormUIContext?.queryParams,
    };
  }, [FormUIContext]);

  const handleRequestSubmit = async (values, resetForm) => {
    setLoading(true);
    await dispatch(actions.handleTravelRequest(values, resetForm, setLoading))
      .then(async () => {
        formUIProps.setIds([]);
        formUIProps.setTravelData(null);
        await dispatch(
          actions.fetchTravelApprovalApplication(
            formUIProps?.queryParams?.filter
          )
        );
      })
      .catch(async () => {
        formUIProps.setIds([]);
        formUIProps.setTravelData(null);
        await dispatch(
          actions.fetchTravelApprovalApplication(
            formUIProps?.queryParams?.filter
          )
        );
      });
  };

  const handleRejectClick = (setFieldValue, handleSubmit) => {
    setFieldValue("request_status", "R");
    handleSubmit();
  };

  const intVal = {
    authorityRemarks: "",
    request_status: "",
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={intVal}
      validationSchema={formValidation}
      onSubmit={(values, { resetForm }) => {
        let submitValues = { ...values, Ids: formUIProps.Ids };
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
