import { Field, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { initialFilter } from "../../FormUIHelper";

const formValidation = Yup.object().shape({
  authorityRemarks: Yup.string().required(VALIDATION_MESSAGES.required),
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
    };
  });

  const { user } = useSelector((state) => {
    return {
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const handleRequestSubmit = async (values, resetForm) => {
    try {
      setLoading(true);
      await dispatch(actions.handleLeaveRequest(values, resetForm));
      setLoading(false);
      formUIProps.setIds([]);
      formUIProps.setLeaveData(null);
      await dispatch(
        actions.fetchLeaveApprovalApplication(
          initialFilter,
          user?.employeeIdMapping
        )
      );
    } catch (err) {
      setLoading(false);
    }
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
          handleRequestSubmit({ ...values, Ids: formUIProps.Ids }, resetForm);
          // resetForm({ values: intVal });
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <button
                type="button"
                onClick={() => {
                  setFieldValue("request_status", "A");
                  handleSubmit();
                }}
                disabled={!(formUIProps?.Ids?.length > 0) || loading}
                className="btn btn-success btn-elevate"
              >
                Approve Request
              </button>
              <button
                type="button"
                disabled={!(formUIProps?.Ids?.length > 0) || loading}
                onClick={() => {
                  setFieldValue("request_status", "R");
                  handleSubmit();
                }}
                className="btn btn-danger btn-elevate mx-2"
              >
                Reject Request
              </button>
              <Form className="form form-label-right">
                <fieldset
                  disabled={formUIProps?.Ids?.length > 0 ? false : true}
                >
                  <div className="from-group row">
                    <div className="col-12 col-md-8 mt-3">
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
            </Modal.Body>
          </>
        )}
      </Formik>
    </>
  );
};
