import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import {
  fetchAllDept,
  fetchAllSubsidiaryData,
  getLatestTableId,
} from "../../../../../../_metronic/redux/dashboardActions";
import DeptManagement from "../..";
import CheckBox from "@material-ui/icons/CheckBox";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const userEditSchema_2 = Yup.object().shape({
  // parentDept: Yup.string().required("Please select parent department"),
  // deptCode: Yup.string().required("*Required"),
  deptName: Yup.string()
    // .matches(/^[A-Za-z\s\:-]*$/, "Name must only contain letters.")
    .trim()
    .required(VALIDATION_MESSAGES.required),
  budgetStrength: Yup.string()
    .matches(/^\d+$/, "Must contain only digits")
    .required(VALIDATION_MESSAGES.required),
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),
  // parentDept: Yup.string().required("*Required"),
  // parentDept: Yup.string().nullable().required("*Required"),
});

export function DeptEditForm({
  saveDept,
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
  id,
}) {
  const dispatch = useDispatch();

  const { dashboard } = useSelector((state) => state);
  const [defCountry, setDefaultCountry] = useState({});
  const [defCity, setDefaultCity] = useState({});
  // Get User Details
  const { auth } = useSelector((state) => state);

  const [defDept = null, setDefaultDept] = useState(null);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defDepartmentCode = null, setDefaultDepartmentCode] = useState(null);

  // Department DropDown Load when pageLoad
  useEffect(() => {
    if (!user.deptId) {
      dispatch(fetchAllDept());
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch]);

  // This method is used for when edit record and get selected dept where id save in DB
  useEffect(() => {
    const parentDept = defDept?.value ? defDept.value : user.parentDept;
    setDefaultDept(
      dashboard.allDept &&
      dashboard.allDept.filter((item) => {
        return item.value === parentDept;
      })
    );
  }, [user?.parentDept, dashboard.parentDept]);

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
      // dispatch(getLatestTableId("t_department", "deptCode", " 1 = 1 ",setValue));
      dispatch(
        getLatestTableId(
          "t_department",
          "deptCode",
          "companyId =" + currentUser.companyId,
          setValue
        )
      );
    }
  };

  useEffect(() => {
    fetchData(setDefaultDepartmentCode);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={userEditSchema_2}
        onSubmit={(values) => {
          enableLoading();
          saveDept({
            ...values,
            deptCode: defDepartmentCode ? defDepartmentCode : values.deptCode,
          });
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



                    {/* <div className="col-12 m-0 p-0 "> */}

                      <div className="col-12 col-md-4 m-0 p-0 ">
                        <div className="col-12 text-black mt-1">
                          <label>
                            Subsidiary
                          </label>

                          <div className="overflow-auto"

                          >
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
                                    key={option?.value}
                                    className="flex justify-start items-center"
                                  >
                                    <input className="p-0 m-0 mr-1 "
                                      // style={{ width: "25px" }}
                                      name="subsidiaryId"
                                      type="checkbox"
                                      value={option?.value}
                                      checked={Boolean(
                                        values?.subsidiaryId?.includes(
                                          option?.value?.toString()
                                        )
                                      )}
                                      onChange={handleChange}
                                    />

                                    {option?.label}
                                  </div>
                                ))}
                                {errors.subsidiaryId &&
                                  touched.subsidiaryId && (
                                    <div className="invalid-text">
                                      {errors.subsidiaryId}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="col-12 col-md-8  m-0 p-0 row">

                        <div className="col-12 col-md-6 mt-1 ">
                          <Field
                            name="deptCode"
                            disabled
                            maxLength={6}
                            component={Input}
                            placeholder="Enter Department Code"
                            value={defDepartmentCode || values.deptCode}
                            label={
                              <span>
                                {" "}
                                Department Code
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          />
                        </div>

                        <div className="col-12 col-md-6 mt-1">
                          <Field
                            name="deptName"
                            maxLength={100}
                            component={Input}
                            placeholder="Enter Department Name"
                            label={
                              <span>

                                Department Name
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          />
                        </div>


                        <div className="col-12 col-md-6 mt-1 ">
                          <Field
                            name="budgetStrength"
                            maxLength={6}
                            component={Input}
                            placeholder="Enter Budget Strength"
                            label={
                              <span>
                                {" "}
                                Bugdet Strength
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          />
                        </div>



                        <div className="col-12  col-md-6 mt-1">
                          <SearchSelect
                            name="parentDept"
                            label={<span> Parent Department</span>}
                            isDisabled={isUserForRead && true}
                            onBlur={() => {
                              // handleBlur({ target: { name: "countryId" } });
                            }}
                            onChange={(e) => {
                              setFieldValue("parentDept", e.value || null);
                              setDefaultDept(e);
                              //  dispatch(fetchAllDept(e.value));
                            }}
                            value={defDept || null}
                            error={errors.parentDept}
                            touched={touched.parentDept}
                            // options={
                            //   user?.deptId
                            //     ? dashboard.allDept.filter(
                            //         (e) => e?.value !== user?.deptId
                            //       )
                            //     : dashboard.allDept
                            // }
                            options={[
                              { label: 'Select', value: '' },
                              ...(user?.deptId
                                ? dashboard.allDept.filter((e) => e?.value !== user?.deptId)
                                : dashboard.allDept || [])
                            ]}


                          />
                        </div>


                      </div>

                    {/* </div> */}










                  </div>

                  <div className="form-group row"></div>
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
