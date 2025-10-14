import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { useSelector } from "react-redux";
import LeaveTypePolicyTable from "./LeaveTypePolicyTable";
import LeaveTypeSalaryDeductionTable from "./LeaveTypeSalaryDeductionTable";
import * as actions from "../../../_redux/formActions";
import { VALIDATION_MESSAGES, WEEK_DAYS } from "../../../../../utils/constants";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import {
  fetchAllLeaveTypeBySubsidiary,
  getActiveFiscalYear,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

const SandwichType = [
  {
    value : 0,
    label : "No Sandwich "
  },
  {
    value : 1,
    label : "Mark All Days as Sandwich"
  },
  {
    value : 2,
    label : "Mark One day as Sandwich"
  },
]
/*
//Validations for Form
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  // gradeId: Yup.number().required(VALIDATION_MESSAGES.required),
  // employeeTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
  // minExp: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(99, VALIDATION_MESSAGES.maxTwoDigits).optional(),
  // maritalStatus: Yup.number().nullable(),
  weekend: Yup.array().required(VALIDATION_MESSAGES.required).min(1),
  isSandwich: Yup.boolean().optional(),
  leavetypePolicies: Yup.array().of(
    Yup.object().shape({
      leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
      gender: Yup.number().nullable(),
      entitledAt: Yup.number().when('leaveType', {
        is: (leaveType) => {
          const leaveTypeData = allLeaveTypeMap.get(leaveType);
          return leaveTypeData && leaveTypeData.type && leaveTypeData.type === 2; // Check if type is 2
        },
        then: Yup.number().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.number().notRequired(),
      }),
      encashableCount: Yup.number()
        .when('encashable', {
          is: true,
          then: Yup.number().required(VALIDATION_MESSAGES.required).min(1, VALIDATION_MESSAGES.minOneValue).max(Yup.ref('maxAllowed'), 'Cannot be greater than Entitled Days'),
          otherwise: Yup.number().notRequired(),
        }),
      carryForwardableCount: Yup.number()
        .when('carryForwardable', {
          is: true,
          then: Yup.number().required(VALIDATION_MESSAGES.required).min(1, VALIDATION_MESSAGES.minOneValue).max(Yup.ref('maxAllowed'), 'Cannot be greater than Entitled Days'),
          otherwise: Yup.number().notRequired(),
        }),
      maxAllowed: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(999, VALIDATION_MESSAGES.maxThreeDigit).required(VALIDATION_MESSAGES.required),
      attachmentRequired: Yup.boolean(),
    })
  ),
  leaveTypeSalaryDeductionPolicies: Yup.array().of(
    Yup.object().shape({
      leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
      minLeave: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(999, VALIDATION_MESSAGES.maxThreeDigit).required(VALIDATION_MESSAGES.required),
      maxLeave: Yup.number().min(Yup.ref('minLeave'), 'Max leave should be more than min leave').max(999, VALIDATION_MESSAGES.maxThreeDigit).required(VALIDATION_MESSAGES.required),
      deduction: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).test(
        'max-decimals',
        'Deduction should be up to max 3 digits before and max 2 digits after the decimal',
        (value) => /^\d{1,3}(\.\d{1,2})?$/.test(value?.toString())
      ).required(VALIDATION_MESSAGES.required),
      leaveStatus: Yup.number().nullable(),
    })
  )
});
*/

export function MasterEditForm({
  initUser,
  isEdit,
  submitForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  dispatch,
}) {
  //Get Dropdown Data from State
  const {
    allEmployeeGradeList,
    allEmpTypeChildMenus,
    allSubsidiaryList,
    allGenderList,
    allLeaveStatus,
    allMaritalStatus,
    allLeaveTypes,
    allEntitlementEvents,
    activeFiscalYear,
  } = useSelector((state) => state.dashboard);

  //Get Leave Type Dropdown data on Edit when subisidary is present
  useEffect(() => {
    if (user.subsidiaryId) {
      dispatch(
        fetchAllLeaveTypeBySubsidiary("allLeaveTypes", user.subsidiaryId)
      );
    }
  }, [user.subsidiaryId]);

  const allLeaveTypeMap = useMemo(() => {
    return new Map(allLeaveTypes?.map((item) => [item.value, item]));
  }, [allLeaveTypes]);

  const formValidation = useMemo(() => {
    return Yup.object().shape({
      subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
      // gradeId: Yup.number().required(VALIDATION_MESSAGES.required),
      // employeeTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
      // minExp: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(99, VALIDATION_MESSAGES.maxTwoDigits).optional(),
      // maritalStatus: Yup.number().nullable(),
      weekend: Yup.array().when("isSandwich", {
      is: (val) => val === 1 || val === 2, // check if value is 1 or 2
     then: Yup.array()
    .required(VALIDATION_MESSAGES.required)
    .min(1, VALIDATION_MESSAGES.min),   // Minimum 1 item
     otherwise: Yup.array().notRequired(), // Not required for other values
    }),
      isSandwich: Yup.number().optional(),
      leavetypePolicies: Yup.array().of(
        Yup.object().shape({
          leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
          gender: Yup.number().nullable(),
          entitledAt: Yup.number()
            .nullable()
            .when("leaveType", {
              is: (leaveType) => {
                const leaveTypeData = allLeaveTypeMap.get(leaveType);
                return (
                  leaveTypeData && leaveTypeData.type && leaveTypeData.type == 1
                ); // Check if type is 1
              },
              then: Yup.number().required(VALIDATION_MESSAGES.required),
              otherwise: Yup.number().notRequired(),
            }),
          encashableCount: Yup.number().when("encashable", {
            is: true,
            then: Yup.number()
              .required(VALIDATION_MESSAGES.required)
              .min(1, VALIDATION_MESSAGES.minOneValue)
              .max(
                Yup.ref("maxAllowed"),
                "Cannot be greater than Entitled Days"
              ),
            otherwise: Yup.number().notRequired(),
          }),
          carryForwardableCount: Yup.number().when("carryForwardable", {
            is: true,
            then: Yup.number()
              .required(VALIDATION_MESSAGES.required)
              .min(1, VALIDATION_MESSAGES.minOneValue)
              .max(
                Yup.ref("maxAllowed"),
                "Cannot be greater than Entitled Days"
              ),
            otherwise: Yup.number().notRequired(),
          }),
          maxAllowed: Yup.number()
            .min(0, VALIDATION_MESSAGES.minZeroValue)
            .max(999, VALIDATION_MESSAGES.maxThreeDigit)
            .required(VALIDATION_MESSAGES.required),
          attachmentRequired: Yup.boolean(),
        })
      ),
      leaveTypeSalaryDeductionPolicies: Yup.array().of(
        Yup.object().shape({
          leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
          minLeave: Yup.number()
            .min(0, VALIDATION_MESSAGES.minZeroValue)
            .max(999, VALIDATION_MESSAGES.maxThreeDigit)
            .required(VALIDATION_MESSAGES.required),
          maxLeave: Yup.number()
            .min(Yup.ref("minLeave"), "Max leave should be more than min leave")
            .max(999, VALIDATION_MESSAGES.maxThreeDigit)
            .required(VALIDATION_MESSAGES.required),
          deduction: Yup.number()
            .min(0, VALIDATION_MESSAGES.minZeroValue)
            .max(100, VALIDATION_MESSAGES.maxHundredValue)
            .test(
              "max-decimals",
              "Deduction should be up to max 3 digits before and max 2 digits after the decimal",
              (value) => /^\d{1,3}(\.\d{1,2})?$/.test(value?.toString())
            )
            .required(VALIDATION_MESSAGES.required),
          leaveStatus: Yup.number().nullable(),
        })
      ),
    });
  }, [allLeaveTypeMap]);

  //Create Dropdown HTML from data for Select Components.
  //when leaveTypeData is provided it will check one of leave type is already selected then it will not allow it to be selected again.
  const createDropdown = (data, leaveTypData = null) => {
    return (data || []).map((el) => {
      const disabled =
        leaveTypData && leaveTypData.find((sel) => sel.leaveType == el.value)
          ? true
          : false;
      return (
        <>
          <option disabled={disabled} value={el.value}>
            {el.label}
          </option>
        </>
      );
    });
  };

  //Function to fetch Data from server when all dropdown values are present or updated.
  //If there is no old data for selected dropdown values then form will clear for user to enter new data
  const getOldData = (values) => {
    if (values.subsidiaryId) {
      dispatch(actions.fetchEditRecord(values, { ...initUser, ...values }));
    }
  };

  //Function to Delete table row data from server.
  const deleteTableRow = (key, id, remove, index) => {
    switch (key) {
      case "LeaveTypePolicyTable":
        dispatch(actions.deleteLeaveTypePolicyRecord(id, remove, index));
        break;
      case "LeaveTypeSalaryDeductionTable":
        dispatch(
          actions.deleteLeaveTypeDeductionPolicyRecord(id, remove, index)
        );
        break;
      default:
    }
  };

  const allocateLeaves = (subsidiaryId, leavetypePolicies) => {
    dispatch(actions.allocateLeaves({ subsidiaryId, list: leavetypePolicies } , onHide));

  };

  useEffect(() => {
    dispatch(getActiveFiscalYear("activeFiscalYear", user?.subsidiaryId || ""));
  }, [user.subsidiaryId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          console.log("valuesvalues" , values)
          submitForm(values);
        }}
      >
        {({
          handleSubmit,
          errors,
          values,
          touched,
          handleBlur,
          setFieldValue,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}

              {/* Form Starts */}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-3 gap-y-1">
                    {/* Subsidiary Field Start */}
                    <div className="col-span-1">
                      <Field
                        name="subsidiaryId"
                        component={Select}
                        disabled={isEdit}
                        className={
                          errors.subsidiaryId && touched.subsidiaryId
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.target.value == "Select" ? "" : e.target.value;
                          dispatch(
                            getActiveFiscalYear("activeFiscalYear", value)
                          );
                          dispatch(
                            fetchAllLeaveTypeBySubsidiary(
                              "allLeaveTypes",
                              value
                            )
                          );
                          setFieldValue("subsidiaryId", value);
                          const filter = {
                            subsidiaryId: value,
                          };
                          getOldData(filter);
                        }}
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.subsidiaryId}
                        autoComplete="off"
                        children={CustomDropdown({
                          data: allSubsidiaryList,
                          firstElement: { label: "Select", value: null },
                        })}
                      />
                      {/* <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isEdit}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e?.value;
                          dispatch(
                            getActiveFiscalYear("activeFiscalYear", value)
                          );
                          dispatch(
                            fetchAllLeaveTypeBySubsidiary(
                              "allLeaveTypes",
                              value
                            )
                          ); setFieldValue("subsidiaryId", value);
                          const filter = {
                            subsidiaryId: value  };
                          getOldData(filter);
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          const value = e?.value;
                          dispatch(
                            getActiveFiscalYear("activeFiscalYear", value)
                          );
                          dispatch(
                            fetchAllLeaveTypeBySubsidiary(
                              "allLeaveTypes",
                              value
                            )
                          ); //When subsidiary is updated then fetch leave types dropdown data according to the subsidiary selected
                          setFieldValue("subsidiaryId", value);
                          const filter = {
                            subsidiaryId: value };
                          getOldData(filter);
                        }}
                      /> */}
                      {/* {errors.subsidiaryId && touched.subsidiaryId && (
                        <CustomErrorLabel
                          touched={true}
                          error={errors.subsidiaryId}
                        />
                      )} */}
                    </div>
                    {/* Subsidiary Field End */}

                    {/* This field is commented/removed after discussion with mubin bhai because of it's link with Leave Allocation Form */}
                    {/* Grade Field Start */}
                    {/* <div className="col-12 col-md-4 mt-3">  
                      <Field
                        name="gradeId"
                        component={Select}
                        disabled={isEdit}
                        className={errors.gradeId && touched.gradeId ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : e.target.value
                          setFieldValue('gradeId', value)
                          const filter = { subsidiaryId: values.subsidiaryId, gradeId: value, employeeTypeId: values.employeeTypeId }
                          getOldData(filter)
                        }}
                        label={
                          <span>
                            {" "}
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.gradeId}
                        autoComplete="off"
                        children={CustomDropdown({ data: allEmployeeGradeList, firstElement: { label: 'Select', value: null } })}
                      />
                      {
                        errors.gradeId && touched.gradeId && <CustomErrorLabel touched={true} error={errors.gradeId} />
                      }
                    </div> */}
                    {/* Grade Field End */}

                    {/* This field is commented/removed after discussion with mubin bhai because of it's link with Leave Allocation Form */}
                    {/* Employee Type Field Start */}
                    {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="employeeTypeId"
                        component={Select}
                        disabled={isEdit}
                        className={errors.employeeTypeId && touched.employeeTypeId ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : e.target.value
                          setFieldValue('employeeTypeId', value)
                          const filter = { subsidiaryId: values.subsidiaryId, gradeId: values.gradeId, employeeTypeId: value }
                          getOldData(filter)
                        }}
                        label={<span>{" "}Employee Type<span style={{ color: "red" }}>*</span></span>}
                        value={values.employeeTypeId}
                        autoComplete="off"
                        children={CustomDropdown({ data: allEmpTypeChildMenus, firstElement: { label: 'Select', value: null } })}
                      />
                      {
                        errors.employeeTypeId && touched.employeeTypeId && <CustomErrorLabel touched={true} error={errors.employeeTypeId} />
                      }
                    </div> */}
                    {/* Employee Type Field End */}
                    {/* Sandwich Field Start */}
                    <div className="col-span-1">
                      {/* <div className="flex items-center gap-2">
                        <Field
                          name="isSandwich"
                          component={Checkbox}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setFieldValue("isSandwich", e.target.checked);
                          }}
                          isSelected={values.isSandwich}
                        />
                        <label>Sandwich</label>
                      </div> */}
                      <Field
                        name="isSandwich"
                        component={Select}
                        disabled={isUserForRead}
                        className={
                          errors.isSandwich && touched.isSandwich
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.target.value == "Select" ? "" : e.target.value;
                          setFieldValue("isSandwich", value);
                        }}
                        label={
                          <span>
                            {" "}
                            Sandwich Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.isSandwich}
                        autoComplete="off"
                        children={CustomDropdown({
                          data: SandwichType,
                        })}
                      />

                    </div>
                    {/* Weekends Field Start */}
                    {/* {console.log("WEEK_DAYSWEEK_DAYS" , WEEK_DAYS)} */}
                    <div className="col-span-3">
                      <label>
                          <span>
                            {" "}
                            Weekends
                            {Boolean(values.isSandwich) && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                      </label>
                    <div className="grid-cols-4 grid lg:grid-cols-7 gap-x-3">
                      {/* <Field
                        name="weekend"
                        component={Select}
                        className={
                          errors.weekend && touched.weekend
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder=""
                        multiple={true}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const data = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          setFieldValue(
                            "weekend",
                            data.map((el) => Number(el))
                          );
                        }}
                        label={
                          <span>
                            {" "}
                            Weekends
                            {Boolean(values.isSandwich) && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        }
                        value={values.weekend}
                        autoComplete="off"
                        children={createDropdown(WEEK_DAYS)}
                      />
                      {errors.weekend && touched.weekend && (
                        <CustomErrorLabel
                          touched={true}
                          error={errors.weekend}
                        />
                      )} */}

                      {WEEK_DAYS?.map((el,ind)=>{
                        return (
                          <Checkbox 
                          children={el?.label} 
                          isSelected={values?.weekend?.find((e)=> e === el?.value)} 
                          onChange={()=>{
                          let prevVal = values?.weekend || [];
                          let result = prevVal.includes(el?.value)
                            ? prevVal.filter((v) => v !== el?.value)
                            : [...prevVal, el?.value];
                           setFieldValue("weekend", result);
                          }} />
                        )
                      })}
                    </div>
                    </div>
                    {/* Weekends Field End */}


                    {/* Sandwich Field End */}
                  </div>

                  <hr />
                  {/* Leave Type Policy Table Start */}

                  <LeaveTypePolicyTable
                    values={values}
                    setFieldValue={setFieldValue}
                    createDropdown={createDropdown}
                    errors={errors}
                    touched={touched}
                    dropdownData={{
                      allGenderList,
                      allMaritalStatus,
                      allLeaveTypes,
                      allEntitlementEvents,
                    }}
                    allLeaveTypeMap={allLeaveTypeMap}
                    handleDelete={deleteTableRow}
                  />
                  {/* Leave Type Policy Table End */}

                  {/* Leave Type Deduction Table Start */}
                  <div
                    style={{
                      display: "none",
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <LeaveTypeSalaryDeductionTable
                      values={values}
                      setFieldValue={setFieldValue}
                      createDropdown={createDropdown}
                      errors={errors}
                      touched={touched}
                      dropdownData={{
                        allLeaveStatus,
                        allLeaveTypes,
                      }}
                      handleDelete={deleteTableRow}
                    />
                  </div>
                  {/* Leave Type Deduction Table End */}

                  {/* Leave Allocation Section Start */}
                  {Boolean(values.Id) && Boolean(activeFiscalYear?.label) && (
                    <>
                      <hr />
                      <div className="space-y-1">
                        <h6 className="font-bold mb-0 text-primary">
                          Leave Allocation
                        </h6>
                        <div>
                          <label>{activeFiscalYear?.label}</label>
                        </div>

                        <div>
                          <button
                            type="button"
                            disabled={!values?.allowAllocation}
                            onClick={() =>
                              allocateLeaves(
                                values.subsidiaryId,
                                values.leavetypePolicies
                              )
                            }
                            className="btn btn-primary btn-elevate"
                          >
                            Allocate Leave
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Leave Allocation Section End */}
                </fieldset>
              </Form>
              {/* Form End */}
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
                  disabled={loading}
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
