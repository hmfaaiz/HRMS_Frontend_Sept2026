import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormUIContext } from "../FormUIContext";
import { Formik, Form, Field } from "formik";
import { TextArea } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions"; // <-- make sure path is correct

export function FollowUp({ detailId, show, onHide }) {
  
  console.log("followup1111",detailId,show, onHide)

  const followUpSchema = Yup.object().shape({
    followUpMsg: Yup.string()
      .trim()
      .required("Message is required"),
  });

  const [loading, setLoading] = useState(false);

  const usersUIContext = useFormUIContext();
 
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!detailId) {
  //     onHide();
  //   }
  // }, [detailId, onHide]);


  const saveForm = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      detailId,
    };

    try {
      await dispatch(actions.sendFollowUpMessage(payload, onHide));
       onHide();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show} 
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Formik
        initialValues={{
          followUpMsg: "",
        }}
        validationSchema={followUpSchema}
        onSubmit={saveForm}
      >
        {({ handleSubmit }) => (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Follow Up
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form className="form form-label-right">
                <fieldset>
                  <div className="grid grid-cols-4 gap-x-3 gap-y-10">
                    <div className="col-span-8">
                      <Field
                        name="followUpMsg"
                        component={TextArea}
                        placeholder="Enter ticket message"
                        className="form-control"
                        label={<span>Message <span style={{ color: "red" }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                  </div>

             
                </fieldset>
              </Form>
            </Modal.Body>

            <Modal.Footer>
                   <button
                    type="submit"
                    className="btn btn-primary btn-elevate mt-4"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light"
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