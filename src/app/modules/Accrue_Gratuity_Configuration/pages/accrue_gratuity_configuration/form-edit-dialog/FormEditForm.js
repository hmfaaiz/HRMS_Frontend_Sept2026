import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// percentage: Yup.string().required("Required*"),
const accrue_gratuity_configurationEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  // to_amount: Yup.string().required("Required*"),

  graduity_expense_accountId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  graduity_payable_accountId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  // fixed_amount: Yup.string().required("Required*"),

  bank_cash_accountId: Yup.number()

    .required(VALIDATION_MESSAGES.required),

});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    if (!user.Id) {
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList",null,false)); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(45, "allAccountList", null, true));

    }
  }, [dispatch, user.Id]);


  const { currentState, userAccess } = useSelector((state) => {

    return {
      currentState: state.accrue_gratuity_configuration,
      userAccess: state?.auth?.userAccess["accrue_gratuity_configuration"],
    };
  }, shallowEqual);

  const { entities } = currentState;

  let existedId = 0;
  const check_Existed_Data = (subsidiaryId) => {

    entities.forEach((i) => {
      if (i.subsidiaryId == subsidiaryId) {
        existedId = i.Id;

        dispatch(actions.fetchAccrueGratuityConfig(existedId));
      } else {
        dispatch(actions.fetchAccrueGratuityConfig(0));
      }
    });
  };




  return (
    <Formik
      enableReinitialize={true}
      // initialValues={{
      //   Id:user.Id || '',
      //   type: user.type ||  '',
      //   value:user.value || 0,
      //   multiplier: user.multiplier || 0,
      //   divisor: user.divisor || 0,
      // }}

      initialValues={user}
      validationSchema={accrue_gratuity_configurationEditSchema}
      onSubmit={(values) => {

        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-12 gap-x-3 gap-y-1">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 col-span-12">
                    <div className="col-span-1">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          check_Existed_Data(e.value);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option?.value === values?.subsidiaryId
                          ) || null
                        }
                        options={dashboard?.allSubsidiaryList}
                  


                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>
                  </div>

                  <div className="col-span-6 lg:col-span-4">
                    <SearchSelect
                      name="graduity_expense_accountId"
                      label={
                        <span>
                          Gratuity Expense Account<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("graduity_expense_accountId", e.value || null);
                      }}
                      value={
                        dashboard?.allAccountList?.find(
                          (option) => option.value === values.graduity_expense_accountId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard.allAccountList.map((option) => ({
                        label: `${option.mergeLabel}`, // Adding the value to the label
                        value: option.value,
                      }))}

                      error={errors.graduity_expense_accountId}
                      touched={touched.graduity_expense_accountId}
                    />
                  </div>
               <div className="col-span-6 lg:col-span-4">
                    <SearchSelect
                      name="graduity_payable_accountId"
                      label={
                        <span>
                          Gratuity Payable Account<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("graduity_payable_accountId", e.value || null);
                      }}
                      value={
                        dashboard?.allAccountList?.find(
                          (option) => option.value === values.graduity_payable_accountId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard.allAccountList.map((option) => ({
                        label: `${option.mergeLabel}`, // Adding the value to the label
                        value: option.value,
                      }))}

                      error={errors.graduity_payable_accountId}
                      touched={touched.graduity_payable_accountId}
                    />
                  </div>
                <div className="col-span-6 lg:col-span-4">
                    <SearchSelect
                      name="bank_cash_accountId"
                      label={
                        <span>
                          Bank/Cash Account<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("bank_cash_accountId", e.value || null);
                      }}
                      value={
                        dashboard?.allAccountList?.find(
                          (option) => option.value === values.bank_cash_accountId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard.allAccountList.map((option) => ({
                        label: `${option.mergeLabel}`, // Adding the value to the label
                        value: option.value,
                      }))}

                      error={errors.bank_cash_accountId}
                      touched={touched.bank_cash_accountId}
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

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

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
  );
}
