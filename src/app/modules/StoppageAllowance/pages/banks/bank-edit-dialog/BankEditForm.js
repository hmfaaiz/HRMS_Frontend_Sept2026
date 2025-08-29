import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllEarningDeductionList

} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";


// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const formValidation = Yup.object().shape(
  {

    earning_deduction_type: Yup.string()
      .required("Required*"),
    earning_deduction_Id: Yup.string()
      .required("Required*"),
    startDate: Yup.string()
      .required("Required*"),
    endDate: Yup.string()
      .required("Required*"),

  },

);
export function BankEditForm({
  saveIncident,
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
  const { dashboard } = useSelector((state) => state);

  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [defEarningDeductionList = null, setDefaultEarningDeductionList] = useState(null);
  const [defEarningDeductionListType = null, setDefaultEarningDeductionType] = useState(null);


  // EMployee Dropdown Binding
  useEffect(() => {
    console.log("ppp")
    dispatch(fetchAllEarningDeductionList(1));
    console.log("user1", user)


  }, [dispatch]);

  // // For Earning Deduction 
  // useEffect(() => {
  //   const id = defEarningDeductionListType?.value ? defEarningDeductionListType.value : user.earning_deduction_type;
  //   console.log("google", dashboard.allEearningDeductList)
  //   setDefaultEarningDeductionList(


  //     dashboard.allEearningDeductList &&
  //     dashboard.allEearningDeductList.filter((item) => {
  //       return item.value === id;
  //     })
  //   );

  // }, [user?.earning_deduction_Id, dashboard.earning_deduction_Id]);


  // For Earning Deduction 
  useEffect(() => {
    const id = defEarningDeductionList?.value ? defEarningDeductionList.value : user.earning_deduction_Id;
    console.log("google", dashboard.allEearningDeductList)

    setDefaultEarningDeductionList(
      dashboard.allEearningDeductList &&
      dashboard.allEearningDeductList.filter((item) => {
        const defaultType = {
          label: user.earning_deduction_type, value: user.earning_deduction_Id
        };
        if (user.earning_deduction_type == 'Earning') {
          dispatch(fetchAllEarningDeductionList(1));
          setDefaultEarningDeductionType(defaultType)
            console.log("p1",defaultType)
        }
        else {
          dispatch(fetchAllEarningDeductionList(2));
          setDefaultEarningDeductionType(defaultType)
          console.log("p2",defaultType)
        }
      



        return item.value === id;
      })
    );

  }, [user?.earning_deduction_Id, dashboard.earning_deduction_Id]);

  //===== Date Of startDate
  useEffect(() => {

    if (user.startDate) {
      setStartDate(new Date(user.startDate));
    }
  }, [user.startDate]);


  //===== Date Of End Date
  useEffect(() => {

    if (user.endDate) {
      setEndDate(new Date(user.endDate));
    }
  }, [user.endDate]);

  //=========== END
  console.log("dashboar111", dashboard, user)
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          enableLoading();
          saveIncident(values);
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

                  <div className="from-group row">
                    {
                      <><div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          label={<span> Type<span style={{ color: 'red' }}>*</span></span>}
                          name="earning_deduction_type"
                          value={defEarningDeductionListType}
                          onChange={(e) => {

                            setFieldValue("earning_deduction_type", e.label || null);
                            setFieldValue("earning_deduction_Id", '');

                            setDefaultEarningDeductionType(e);
                            setDefaultEarningDeductionList('');
                            dispatch(fetchAllEarningDeductionList(e.value));
                          }}
                          onBlur={handleBlur}
                          options={[{ label: 'Select Type', value: '-1' }, { label: 'Earning', value: 1 }, { label: 'Deduction', value: 2 }]}
                          style={{ display: "block" }}
                        >
                          {/* <option value="-1" label="Select Type" />
                          <option value="1" label="Earning" />
                          <option value="2" label="Deduction" /> */}

                        </SearchSelect>
                        {errors.earning_deduction_type && touched.earning_deduction_type && (
                          <div className="invalid-text">{errors.earning_deduction_type}</div>
                        )}
                      </div></>

                    }
                  </div>
                  <div className="from-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="earning_deduction_Id"
                          label={<span> Earning/Deduction<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("earning_deduction_Id", e.value || null);
                            setDefaultEarningDeductionList(e);
                            //dispatch(fetchAllEarningDeductionList(e.value));
                          }}
                          value={(defEarningDeductionList || null)}
                          error={errors.earning_deduction_Id}
                          touched={touched.earning_deduction_Id}
                          options={dashboard.allEearningDeductList
                          }
                        />
                      </div>

                    }
                  </div>
                  <div className="from-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">
                        {<span> Start Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Start Date"
                          selected={startDate}
                          onChange={(date) => {
                            setFieldValue("startDate", date);
                            setStartDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="startDate"
                          autoComplete="off"
                          disabled={isUserForRead}
                        // value = {values.dateOfJoining}
                        />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        {<span> End Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter End Date"
                          selected={endDate}
                          onChange={(date) => {
                            setFieldValue("endDate", date);
                            setEndDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="endDate"
                          autoComplete="off"
                          disabled={isUserForRead}

                        />
                      </div>
                    }
                  </div>
                  <div className="from-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="remarks"
                          component={TextArea}
                          placeholder="Enter Remarks"
                          // value = {values.skill}
                          label="Remarks"
                          autoComplete="off"
                        />
                      </div>

                    }
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
