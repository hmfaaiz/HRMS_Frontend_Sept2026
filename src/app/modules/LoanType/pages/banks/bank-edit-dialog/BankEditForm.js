import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  getLatestTableId,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { amountLimit } from "../../../../../utils/common";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.string().required("Required*"),

  name: Yup.string().required("Required*"),
  // .matches(/^[A-Za-z\s]+$/, 'Name must only contain letters.'),

  // linkedAttendance: Yup.string()
  //   .required("Required*"),
  // loan: Yup.string()
  //   .required("Required*"),
  // mapped: Yup.string()
  //   .accountId("Required*"),
  accountId: Yup.string()
    .matches(
      /^\d+(\.\d+)?$/,
      "Must be a valid number (digits with optional decimal)"
    )
    .required("Required*"),
});
export function BankEditForm({
  saveLoanType,
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
  userForEdit,
  id,
}) {
  const { dashboard } = useSelector((state) => state);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defDeductionCode = null, setDefDeductionCode] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);

  const [defCode = null, setDefaultCode] = useState(null);
  //=========== END
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllFormsMenu(45, "allAccountList")); // For All Grade Codes
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch]);

  useEffect(() => {
    const employeeId = defEmployee?.value ? defEmployee.value : user.employeeId;

    setEmployeeDefault(
      dashboard.allEmployees &&
        dashboard.allEmployees.filter((item) => {
          return item.value === employeeId;
        })
    );
  }, [user?.employeeId, dashboard.employeeId]);

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

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.user,
    };
  }, shallowEqual);

  const fetchData = async (setValue) => {
    // if (subsidiaryId) {
    // dispatch(getLatestTableId("t_loan_type_setup", "Id", " subsidiaryId = " + subsidiaryId, setValue));
    if (!id) {
      dispatch(
        getLatestTableId(
          "t_loan_type_setup",
          "Code",
          "companyId=" + currentUser.companyId,
          setValue
        )
      );
    }
  };

  useEffect(() => {
    fetchData(setDefaultCode);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          saveLoanType({ ...values, code: defCode ? defCode : user.code });
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
                  <div className="grid grid-cols-3 lg:grid-cols-12 gap-x-3 gap-y-1">
                    {/* <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={<span> Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead || userForEdit}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          setDefualtSubsidiaryList(e);
                          fetchData(e.value, setDefaultCode)
                          //handlePaymenModeChanged(e)
                        }}

                        value={(defSubsidiary || null)}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        options={dashboard.allSubsidiaryList}
                      />
                    </div> */}

                    <div className="col-span-3 text-black mt-1">
                      <label>Subsidiary</label>
                      <div className="overflow-auto">
                        <div className="multi-select">
                          <div
                            className="p-0 m-0 "
                            style={{
                              fontSize: "10.2px",
                              // fontWeight: "bold",
                              // padding: "2px",
                            }}
                          >
                            {dashboard?.allSubsidiaryList?.map((option) => (
                              <div
                                key={option.value}
                                className="flex justify-start items-center"
                              >
                                <input
                                  className="p-0 m-0 mr-1 "
                                  name="subsidiaryId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(
                                    values?.subsidiaryId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />
                                {option.label}
                              </div>
                            ))}
                            {errors.subsidiaryId && touched.subsidiaryId && (
                              <div className="invalid-text">
                                {errors.subsidiaryId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  <div className="col-span-9 grid grid-cols-3 gap-x-3 gap-y-1">
                    {
                      <div>
                        <Field
                          name="code"
                          disabled
                          component={Input}
                          maxLength={6}
                          placeholder="Enter Code"
                          value={defCode || values.code}
                          label={
                            <span>
                              {" "}
                              Code<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                    }
                    {
                      <div>
                        <Field
                          name="name"
                          maxLength={50}
                          component={Input}
                          placeholder="Enter Loan Type"
                          autoComplete="off"
                          label={
                            <span>
                              {" "}
                              Name<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                        />
                      </div>
                    }

                    {/* <div >
                        <Select
                          label={<span> Linked With Attendance<span style={{ color: 'red' }}>*</span></span>}
                          name="linkedAttendance"
                          value={values.linkedAttendance}
                          // onChange={handleLinkedAttendanceChange}
                          onChange={(e) => {
                           
                            setFieldValue("linkedAttendance", e.target.value);
                            // if (e.target.value === "true") {
                            //   setFieldValue("loan", false);
                            // }

                          }}
                          onBlur={handleBlur}
                          style={{ display: "block" }}
                        >
                          <option value="-1" label="Select" />
                          <option value="true" label="Yes" />
                          <option value="false" label="No" />


                        </Select>
                        {errors.linkedAttendance && touched.linkedAttendance && (
                          <div className="invalid-text">{errors.linkedAttendance}</div>
                        )}
                      </div> */}

                    <div>
                      <SearchSelect
                        name="accountId"
                        label={
                          <span>
                            Account<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("accountId", e.value || null);
                        }}
                        value={
                          dashboard.allAccountList.find(
                            (option) => option.value == values.accountId
                          ) || null
                        }
                        // options={dashboard.allAccountList}
                        options={dashboard.allAccountList.map((option) => ({
                          label: `${option.mergeLabel}`, // Adding the value to the label
                          value: option.value,
                        }))}
                        error={errors.accountId}
                        touched={touched.accountId}
                      />
                    </div>
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
