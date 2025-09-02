import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllSubCenter,
  fetchAllSubsidiaryData,
  getLatestBookingNo,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { amountLimitDynamic } from "../../../../../utils/common";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const bankEditSchema = Yup.object().shape({
  Name: Yup.string()
    // .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters allowed')
    // .matches(/^[A-Za-z\s.-]+$/, 'Name must only contain letters.')
    .trim()
    .required(VALIDATION_MESSAGES.required),
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});
export function BankEditForm({
  saveBank,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch]);

  useEffect(() => {
    const subsidiaryId = defSubsidiary?.value
      ? defSubsidiary.value
      : user.subsidiaryId;

    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
        dashboard.allSubsidiaryList.filter((item) => {
          return item.value === subsidiaryId;
        })
    );
  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={bankEditSchema}
        onSubmit={(values) => {
          console.log("bank values", values);
          enableLoading();
          saveBank(values);
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          formik,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          setDefualtSubsidiaryList(e);
                        }}
                        // value={defSubsidiary || null}
                         value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        options={dashboard.allSubsidiaryList}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <Field
                        name="Name"
                        MaxLength={40}
                        component={Input}
                        placeholder="Bank Name"
                        label={
                          <span>
                            {" "}
                            Bank Name<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            50
                          ); // Limit to 50 digits
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isUserForRead ? (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-primary btn-elevate"
                >
                  OK
                </button>
              )}

              <> </>
              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
