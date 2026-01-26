import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCountry,
  fetchAllCity,
  getLatestTableId,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

/* ---------------- VALIDATION ---------------- */

const customerSchema = Yup.object().shape({
  customerName: Yup.string().required(VALIDATION_MESSAGES.required).matches(
    /^[A-Za-z\s.-]+$/,
    "Name must only contain letters."
  ),
  countryId: Yup.string().required(VALIDATION_MESSAGES.required),
  cityId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  phone: Yup.string()
    .matches(/^\d+$/, "Only numeric characters are allowed")
    .min(11)
    .max(15).nullable(),
  cellNo: Yup.string()
    .matches(/^\d+$/, "Only numeric characters are allowed")
    .min(11)
    .max(15).nullable(),
  emailAddress: Yup.string().email("Invalid email").nullable(),
  contactPerson: Yup.string().matches(
    /^[A-Za-z\s.-]+$/,
    "Name must only contain letters."
  ).nullable(),
 
});

/* ---------------- COMPONENT ---------------- */

export function CustomerEditForm({
  saveCustomer,
  customer,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const [defCountry, setDefaultCountry] = useState(null);
  const [defCity, setDefaultCity] = useState(null);
  const [defCustomerCode, setDefCustomerCode] = useState(null);

  const isAddMode = !customer;

  /* -------- FETCH MASTER DATA -------- */

  useEffect(() => {
    dispatch(fetchAllCountry());
  }, [dispatch]);

  /* -------- AUTOGENERATE CUSTOMER CODE (ADD ONLY) -------- */

  useEffect(() => {
  // If id is null/undefined/empty, we are in ADD mode
  const isAddMode = !id || id === 0 || id === "";
  if (isAddMode) {
    dispatch(
      getLatestTableId(
        "t_customer_setup",  // table name
        "customerCode",      // column name
        "1 = 1",             // filter
        setDefCustomerCode
      )
    );
  }
}, [dispatch, id]);


  /* -------- SET DEFAULT COUNTRY -------- */

  useEffect(() => {
    if (customer?.countryId && dashboard.allCountry?.length) {
      const country = dashboard.allCountry.find(
        (c) => c.value === customer.countryId
      );
      if (country) {
        setDefaultCountry(country);
        dispatch(fetchAllCity(customer.countryId));
      }
    }
  }, [customer?.countryId, dashboard.allCountry, dispatch]);

  /* -------- SET DEFAULT CITY -------- */

  useEffect(() => {
    if (customer?.cityId && dashboard.allCity?.length) {
      const city = dashboard.allCity.find(
        (c) => c.value === customer.cityId
      );
      if (city) setDefaultCity(city);
    }
  }, [customer?.cityId, dashboard.allCity]);

  /* ---------------- FORM ---------------- */

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...customer,
        customerCode: customer?.customerCode || defCustomerCode || "",
      }}
      validationSchema={customerSchema}
      onSubmit={(values) => {
        enableLoading();
        saveCustomer(values);
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

                  {/* CUSTOMER CODE */}
                  <div className="col-md-4 mt-1">
                    <Field
                      name="customerCode"
                      component={Input}
                      disabled
                      label={
                        <span>
                          Customer Code <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>

                  {/* CUSTOMER NAME */}
                  <div className="col-md-4 mt-1">
                    <Field
                      name="customerName"
                      component={Input}
                      label={
      <span>
        Customer Name <span style={{ color: "red" }}>*</span>
      </span>
    }
                    />
                  </div>

                  {/* COUNTRY */}
                  <div className="col-md-4 mt-1">
                    <SearchSelect
                      name="countryId"
                      label={
      <span>
        Country <span style={{ color: "red" }}>*</span>
      </span>
    }
                      value={defCountry}
                      options={dashboard.allCountry || []}
                      error={errors.countryId}
                      touched={touched.countryId}
                      onChange={(e) => {
                        setFieldValue("countryId", e.value);
                        setDefaultCountry(e);
                        dispatch(fetchAllCity(e.value));
                        setFieldValue("cityId", null);
                        setDefaultCity(null);
                      }}
                    />
                  </div>

                  {/* CITY */}
                  <div className="col-md-4 mt-1">
                    <SearchSelect
                      name="cityId"
                      label={
      <span>
        City <span style={{ color: "red" }}>*</span>
      </span>
    }
                      value={defCity}
                      options={dashboard.allCity || []}
                      error={errors.cityId}
                      touched={touched.cityId}
                      isDisabled={!values.countryId}
                      onChange={(e) => {
                        setFieldValue("cityId", e.value);
                        setDefaultCity(e);
                      }}
                    />
                  </div>

                  {/* PHONE */}
                  <div className="col-md-4 mt-1">
                    <Field name="phone" component={Input} label="Phone " />
                  </div>

                  {/* CELL */}
                  <div className="col-md-4 mt-1">
                    <Field name="cellNo" component={Input} label="Cell No " />
                  </div>

                  {/* EMAIL */}
                  <div className="col-md-4 mt-1">
                    <Field
                      name="emailAddress"
                      component={Input}
                      label="Email "
                    />
                  </div>

                  {/* CONTACT PERSON */}
                  <div className="col-md-4 mt-1">
                    <Field
                      name="contactPerson"
                      component={Input}
                      label="Contact Person "
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="col-md-8 mt-1">
                    <Field
                      name="address"
                      component={Input}
                      label="Address "
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
