import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormUIContext } from "../FormUIContext";
import { Formik, Form, Field } from "formik";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions"; // <-- make sure path is correct
export function FollowUp({ detailId, show, onHide }) {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const followUpSchema = Yup.object().shape({
    followUpMsg: Yup.string().trim().required("Message is required"),
  });

  const saveForm = async (values) => {
    setLoading(true);

    try {
      const payload = {
        ...values,
        detailId,
      };

      await dispatch(actions.sendFollowUpMessage(payload,onHide));

      onHide(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      
      <Formik
        initialValues={{ followUpMsg: "" }}
        validationSchema={followUpSchema}
        onSubmit={saveForm}
      >
        {({ handleSubmit }) => (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Follow Up Message</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Field
                  name="followUpMsg"
                  component={TextArea}
                  placeholder="Enter ticket message"
                  className="form-control"
                />
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="btn btn-light"
                onClick={onHide}
              >
                Cancel
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>

    </Modal>
  );
}