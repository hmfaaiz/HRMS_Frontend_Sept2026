import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";  // Remove Select from here
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";  // Add this import
import { useDispatch, useSelector} from "react-redux";
import { fetchAllFormsMenu, getLatestTableId } from "../../../../../../_metronic/redux/dashboardActions";

/* ---------------- VALIDATION ---------------- */
const ticketStatusSchema = Yup.object().shape({
  statusName: Yup.string()
    .required("Status Name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
  statusTypeId: Yup.number()
    .required("Status Type is required")
    .nullable()
    .typeError("Status Type is required"),
});

/* ---------------- COMPONENT ---------------- */
export function TicketStatusEditForm({
  saveTicketStatus,
  ticketStatus,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  const [defStatusCode, setDefStatusCode] = useState(null);

  const isAddMode = !id;

  /* -------- AUTOGENERATE STATUS CODE (ADD ONLY) -------- */
  useEffect(() => {
    if (isAddMode) {
      dispatch(
        getLatestTableId(
          "t_ticket_status", // table
          "statusCode",      // column
          "1 = 1",           // filter
          setDefStatusCode  
        )
      );
    }
    dispatch(fetchAllFormsMenu(548,"allStatusType"))
  }, [dispatch, isAddMode]);


  const { dashboard, } = useSelector(
      (state) => ({
        dashboard: state.dashboard,
      }),
    );

  // Hardcoded dropdown options
  // const statusTypeOptions = [
  //   { value: 1, label: "To Do" },
  //   { value: 2, label: "In Progress" },
  //   { value: 3, label: "Done" },
  // ];

  if (isAddMode && defStatusCode === null) {
    return (
      <div className="text-center p-5">
        <div className="spinner spinner-lg spinner-success"></div>
      </div>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...ticketStatus,
        statusCode: ticketStatus?.statusCode || defStatusCode || "",
        statusTypeId: ticketStatus?.statusTypeId || null,
      }}
      validationSchema={ticketStatusSchema}
      onSubmit={(values) => {
        enableLoading();
        saveTicketStatus(values);
      }}
    >
      {({ handleSubmit, setFieldValue, values, errors, touched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="row">
                  {/* STATUS CODE */}
                  <div className="col-md-4 mt-1">
                    <Field
                      name="statusCode"
                      component={Input}
                      disabled
                      label={
                        <span>
                          Status Code <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>

                  {/* STATUS NAME */}
                  <div className="col-md-4 mt-1">
                    <Field
                      name="statusName"
                      placeholder="Enter status name"
                      component={Input}
                      label={
                        <span>
                          Status Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>

                  {/* STATUS TYPE - Switched to SearchSelect */}
                  <div className="col-md-4 mt-1">
                    <SearchSelect
                      name="statusTypeId"
                      label={
                        <span>
                          Status Type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={dashboard?.allStatusType?.find(
                        (opt) => opt.value == values.statusTypeId
                      )}  // Finds the matching object
                      options={dashboard?.allStatusType}
                      error={errors.statusTypeId}
                      touched={touched.statusTypeId}
                      onChange={(e) => {
                        setFieldValue("statusTypeId", e.value);  // Sets the numeric value
                      }}
                      placeholder="Select Status Type"
                      // isDisabled={isUserForRead}
                    />
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={onHide} className="btn btn-light">
              {isUserForRead ? "OK" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Save
                {loading && <span className="ml-3 spinner spinner-white" />}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}