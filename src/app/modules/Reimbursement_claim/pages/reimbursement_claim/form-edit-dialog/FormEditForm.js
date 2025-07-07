import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import {
  DatePickerField,
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  amountLimit,
  formatDates,
  getDateDiffInDays,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import {
  fetchAllFormsMenu,
  fetchAllPayrollMonthYearList,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";
import { updateApprovedStatus ,fetchReimbursementClaim} from "../../../_redux/redux-Actions";

const ReimbursementSchema = Yup.object().shape({
  reimbursement_typeId: Yup.number().required(VALIDATION_MESSAGES.required),
  details: Yup.string().required(VALIDATION_MESSAGES.required),
  date: Yup.date().required(VALIDATION_MESSAGES.required),
  amount: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required),

  // file: Yup.mixed()
  //   .required("Required")
  //   .test(
  //     "fileSize",
  //     "File is too large (max 5MB)",
  //     (value) => !value || (value && value.size <= 5 * 1024 * 1024) // 5 MB limit
  //   )
  //   .required("Required"),
  pay_in_payroll_forId: Yup.number().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  setIds,
  isEdit,
  isFileReq,
  setIsFileReq,
  employeeId,disbaleLoading,formUIProps
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  // const [isActiveMonth, setIsActiveMonth] = useState(false)

  // const [isFileReq,setIsFileReq]=useState(false)
  // Fetch necessary data if not already present
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllFormsMenu(202, "allReimbursementTypeList"));
      const key = "allPayrollMonthYearList";  // The key parameter
      if (employeeId) {
        // dispatch(fetchAllPayrollMonthYearList(employeeId, key));
        dispatch(fetchAllPayrollMonthYearList({ subsidiaryId: null, employeeId: employeeId }, key));
      }

      // dispatch(fetchAllPayrollMonthYearList("allPayrollMonthYearList"));
    }
    //allPayrolGroupList
  }, [dispatch, user.Id, employeeId]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.reimbursement_claim,
      userAccess: state?.auth?.userAccess["reimbursement_claim"],
    };
  }, shallowEqual);

  const filteredOptions = dashboard?.allReimbursementTypeList.filter((option) =>
    currentState?.reimbursement_config_policies_permission?.policies?.some(
      (item) => item.reimbursement_typeId === option.value
    )
  );

  const { entities } = currentState;
  const [data, setdata] = useState({});
  useEffect(() => {
    if (employeeId) {
      getEmployeeProfileById(employeeId)
        .then((res) => {
          if (res?.data?.data) {
            setdata(res.data.data);
          }
        })
        .catch(() => {
          setdata({});
        });
    } else {
      setdata({});
    }
  }, [employeeId]);


  const calculateRemainingAmount = (reimbursementTypeId, payrollForId, policies, values) => {
    // Find the max amount allowed for the reimbursement type
    // let employee = currentState?.loan_config_details_permission?.employee;


    const maxAmount =
      policies?.find((item) => item.reimbursement_typeId === reimbursementTypeId)?.max_amount || 0;

    // Calculate the claimed amount for the selected reimbursement type and payroll

    const claimedAmount = entities
      ?.filter(
        (entity) =>
          entity.reimbursement_typeId === reimbursementTypeId &&
          entity.pay_in_payroll_forId === payrollForId 
          // && entity.approved_status == 1
      )
      ?.reduce((sum, entity) => sum + (entity.amount || 0), 0);

    // Return the remaining amount

    let finalMaxAmount = (maxAmount || 0) - (claimedAmount || 0);
    if (isEdit & values.approved_status == 1) {
      finalMaxAmount += values.amount
    }
    return finalMaxAmount;
  };

  const basisOptions = [
    { value: 0, label: "Pending" },
    { value: 1, label: "Approved" },
    { value: 2, label: "Rejected" },
  ];



 const UpdateApprovedStatus = async (Id, approved_status) => {

    if (Id && approved_status) {
      let data = {
        Id, approved_status,

      }
      await dispatch(updateApprovedStatus(data, disbaleLoading, onHide));
      await dispatch(fetchReimbursementClaim(formUIProps));
      setIds("");

    }

  }


  const{    activeFiscalYear
    } = useSelector((state) => state.dashboard);


  return (
    <Formik
      // key={user.Id || "new"}
      enableReinitialize={true}
      initialValues={user}
      validationSchema={ReimbursementSchema}
      onSubmit={(values, { resetForm }) => {
        enableLoading();


        const finalAmountLimit = calculateRemainingAmount(
          values?.reimbursement_typeId,
          values?.pay_in_payroll_forId,
          currentState?.reimbursement_config_policies_permission?.policies, values
        );
        const clearForm = () => {
          resetForm();
          if (inputFile?.current) {
            inputFile.current.value = "";
          }
        };
        saveForm(values, finalAmountLimit, isFileReq, clearForm,);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleReset,

      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isUserForRead}>
                <div className="form-group row">
                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="reimbursement_typeId"
                      label={
                        <span>
                          Reimbursement Type
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }

                      isDisabled={isEdit}
                      onChange={(e) => {
                        setFieldValue("reimbursement_typeId", e.value || null);

                        const policy = currentState?.reimbursement_config_policies_permission?.policies?.find(
                          (item) => item.reimbursement_typeId == e.value
                        );
                        setIsFileReq(
                          policy?.attachment_required && !values.file
                        );

                      }}
                      value={
                        dashboard.allReimbursementTypeList.find(
                          (option) =>
                            option.value === values.reimbursement_typeId
                        ) || null
                      }
                      options={filteredOptions}
                      error={errors.reimbursement_typeId}
                      touched={touched.reimbursement_typeId}
                    />
                  </div>


                   {/* Active payroll month */}



            <div className="col-12 col-md-6 mt-3 d-flex flex-column align-items-end">

  {activeFiscalYear ? (() => {

    return (
      <>
        <div>
          <b>Active Fiscal Year -</b>{" "}
          {activeFiscalYear?.label}
        </div>
        <div>
          <b>Active Payroll Month -</b>{" "}
          {activeFiscalYear?.payrollMonthLabel}
        </div>
      </>
    );
  })() : null}
</div>


                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="date"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      // label="Date"
                      type="date"
                      maxDate={new Date()}
                      minDate={data.dateOfJoining ? new Date(data.dateOfJoining) : null}
                      // disabled={!isActiveMonth}
                      // disabled={isEdit && !(dashboard?.allPayrollMonthYearList.some(
                      //   (option) => option?.value == values?.pay_in_payroll_forId && option?.isActive === true))}
                      disabled={isEdit}

                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="pay_in_payroll_forId"

                      label={
                        <span>
                          Reimbursement Month
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        setFieldValue("pay_in_payroll_forId", e.value || null);
                      }}
                      value={
                        dashboard?.allPayrollMonthYearList.find(
                          (option) =>
                            option.value === values.pay_in_payroll_forId
                        ) || null
                      }
                      options={
                        dashboard?.allPayrollMonthYearList.filter(
                          (option) => option.isActive
                        ) || []
                      }
                      // options={dashboard.allPayrollMonthYearList}
                      // isDisabled={ !isActiveMonth}
                      // isDisabled={isEdit && !(dashboard?.allPayrollMonthYearList.some(
                      //   (option) => option?.value == values?.pay_in_payroll_forId && option?.isActive === true))}

                      isDisabled={isEdit}
                      error={errors.pay_in_payroll_forId}
                      touched={touched.pay_in_payroll_forId}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="amount"
                      component={Input}
                      placeholder="Enter Amount"
                      // disabled={isEdit && !(dashboard?.allPayrollMonthYearList.some(
                      //   (option) => option?.value == values?.pay_in_payroll_forId && option?.isActive === true))}
                      // disabled={!isActiveMonth}
                      disabled={isEdit}
                      label={(() => {
                        const finalAmountLimit = calculateRemainingAmount(
                          values?.reimbursement_typeId,
                          values?.pay_in_payroll_forId,
                          currentState?.reimbursement_config_policies_permission?.policies, values
                        );
                        return (


                          <div className="d-flex">
                            <div className="d-flex">Total Amount </div>
                            <div className="d-flex ml-3">
                              ( Amount Limit: {finalAmountLimit?.toLocaleString()} )<span style={{ color: "red" }}>*</span>
                            </div>
                          </div>


                        );
                      })()}
                      type="number"
                      onInput={(e) => {
                        e.target.value = amountLimit(e.target.value);
                      }}
                      onChange={(e) => {
                        const finalAmountLimit = calculateRemainingAmount(
                          values?.reimbursement_typeId,
                          values?.pay_in_payroll_forId,
                          currentState?.reimbursement_config_policies_permission?.policies, values
                        );

                        const value = Number(e.target.value);

                        if (
                          finalAmountLimit !== undefined &&
                          value > finalAmountLimit
                        ) {
                          return; // Prevent setting value above max
                        }

                        setFieldValue("amount", value);
                      }}
                    />
                  </div>
                  {/* {isEdit ? (<div className="col-12 col-md-6 mt-3">
                    <label htmlFor="approved_status">
                      Action

                    </label>

                    <Field
                      name="approved_status"
                      as="select"
                      className="form-control"
                      // disabled={!isActiveMonth}
                      disabled={isUserForRead || values.approved_status == 1}
                      onChange={(e) => {
                        setFieldValue(
                          "approved_status",
                          e.target.value
                        );
                      }}


                    >
                      <option value="">Select</option>
                      {basisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>

                    {errors.approved_status &&
                      touched.approved_status && (
                        <div className="text-danger">
                          {errors.approved_status}
                        </div>
                      )}
                  </div>
                  ) : null} */}



                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="details"
                      component={TextArea}
                      placeholder="Enter Details"
                      //  disabled={ !isActiveMonth}
                      // disabled={isEdit && !(dashboard?.allPayrollMonthYearList.some(
                      //   (option) => option?.value == values?.pay_in_payroll_forId && option?.isActive === true))}
                      disabled={isEdit}

                      label={
                        <span>
                          Details <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                    />
                  </div>


                  <div className="col-12 col-md-12 mt-3 d-flex flex-column ">
                    <label
                      style={{
                        "margin-right": "0.5rem",
                      }}
                    >
                      {" "}
                      Attachment:{" "}
                      {isFileReq && <span style={{ color: "red" }}>*</span>}
                    </label>
                    <input

                      name="file"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      onChange={(event) => {
                        // Update Formik's value
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}
                    />

                    <div>
                      <br />
                      {user.file && (
                        <>
                          <label>
                            <strong>Existing File:</strong>
                          </label>
                          {
                            <a href={getUploadUrl(user.file)} target="_blank">
                              <span>{getFileName(user.file)}</span>
                            </a>
                          }
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / Ok Button */}
            {!isUserForRead ? (
              <button
                type="reset"
                onClick={() => {
                  setIds("");
                  handleReset();

                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
                }}
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
                Ok
              </button>
            )}

       
            {/* { true && (
                <button
                  type="submit"
                  // onClick={() => handleSubmit()}
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="btn btn-primary btn-elevate"
                  // disabled={loading}
                  // disabled={loading || (isEdit && !dashboard?.allPayrollMonthYearList.some(
                  //   (option) => option?.value == values?.pay_in_payroll_forId && option?.isActive === true
                  // ))}
                  disabled={loading || isEdit}
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )} */}


                <button
                  type="submit"
                  // onClick={() => handleSubmit()}
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="btn btn-primary btn-elevate"
                  // disabled={loading}
                  // disabled={loading || (isEdit && !dashboard?.allPayrollMonthYearList.some(
                  //   (option) => option?.value == values?.pay_in_payroll_forId && option?.isActive === true
                  // ))}
                  disabled={loading || isEdit}
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
           

               {
                  user?.approved_status ==0 ? (
                    <button
                      type="button"
                      className="btn btn-green"
                      // disabled={user?.approved_status  == 1}
                      onClick={() => UpdateApprovedStatus(user.Id, 1)}
                    >
                      Approve
                    </button>
                  ) : ( null
                  )
                }
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
