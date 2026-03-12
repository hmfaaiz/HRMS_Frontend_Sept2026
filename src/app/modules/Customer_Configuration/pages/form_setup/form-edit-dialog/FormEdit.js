import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  themeColor,
  VALIDATION_MESSAGES,
} from "../../../../../utils/constants";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllActiveCustomers } from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";

const formSchema = Yup.object().shape({
  customerId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  customerEpicTicketId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  customerTicketAssignEmpId: Yup.string().nullable(),
  color_name: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  primary_color: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  secondary_color: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

/* ---------------- COMPONENT ---------------- */
export function FormEditForm({
  saveForm,
  dataForEdit,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  /* ---------------- FORM ---------------- */

  const { createdCustomerIds, customerEpicTicket, dashboard } = useSelector(
    (state) => {
      return {
        createdCustomerIds: state.customer_config?.createdCustomerIds,
        customerEpicTicket: state.customer_config?.customerEpicTicket,
        dashboard: state.dashboard,
      };
    },
    shallowEqual,
  );

  useEffect(() => {
    if (!id) {
      dispatch(actions.createdCustomerConfigIds());
    } else {
      dispatch(actions.customerEpicTickets(id));
    }
    dispatch(fetchAllActiveCustomers());
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...dataForEdit,
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,
        };
        saveForm(payload);
      }}
    >
      {({ handleSubmit, errors, values, setFieldValue, touched, isValid }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <SearchSelect
                      name="customerId"
                      label={
                        <span>
                          Customer<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || id}
                      onChange={(e) => {
                        setFieldValue("customerId", e.value || null);
                        setFieldValue("customerEpicTicketId", null);
                        setFieldValue("customerTicketAssignEmpId", null);
                        dispatch(actions.customerEpicTickets(e?.value));
                      }}
                      value={
                        dashboard?.allCustomers?.find(
                          (option) => option?.value == values?.customerId,
                        ) || null
                      }
                      options={dashboard?.allCustomers?.map((el) => {
                        return {
                          ...el,
                          isDisabled: createdCustomerIds?.find(
                            (e) => e?.customerId == el?.value,
                          ),
                        };
                      })}
                      error={errors.customerId}
                      touched={touched.customerId}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-8 flex gap-4">
                    {themeColor.map((el, ind) => (
                      <div title={el.color_name} key={ind}>
                        <button
                          style={{ backgroundColor: el.primary_color }}
                          disabled={isUserForRead}
                          className={
                            values?.color_name === el.color_name
                              ? `w-12 h-12 rounded-md border-4 border-solid border-gray-800`
                              : `w-12 h-12 rounded-md border-none`
                          }
                          type="button"
                          onClick={() => {
                            if (!isUserForRead) {
                              setFieldValue("color_name", el.color_name);
                              setFieldValue("primary_color", el.primary_color);
                              setFieldValue(
                                "secondary_color",
                                el.secondary_color,
                              );
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <SearchSelect
                      name="customerTicketAssignEmpId"
                      label={<span>Assign Customer Ticket to Employee</span>}
                      isDisabled={isUserForRead || !values?.customerId}
                      onChange={(e) => {
                        setFieldValue(
                          "customerTicketAssignEmpId",
                          e.value || null,
                        );
                      }}
                      value={
                        dashboard?.allEmployees?.find(
                          (option) =>
                            option?.value == values?.customerTicketAssignEmpId,
                        ) || null
                      }
                      options={dashboard?.allEmployees}
                      error={errors.customerTicketAssignEmpId}
                      touched={touched.customerTicketAssignEmpId}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="customerEpicTicketId"
                      label={
                        <span className="shortlabel">
                          Customer EPIC for Bug or Ticket Creation from Customer
                          Portal <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || !values?.customerId}
                      onChange={(e) => {
                        setFieldValue("customerEpicTicketId", e.value || null);
                      }}
                      value={
                        customerEpicTicket?.find(
                          (option) =>
                            option?.value == values?.customerEpicTicketId,
                        ) || null
                      }
                      options={customerEpicTicket}
                      error={errors.customerEpicTicketId}
                      touched={touched.customerEpicTicketId}
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
                disabled={!isValid}
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Save
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
