

import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useDispatch, useSelector, shallowEqual } from "react-redux";


const salarypolicyEditSchema = Yup.object().shape({
  type: Yup.string().required("Required*"),
  value: Yup.number().when("type", {
    is: "Fixed Days",
    then: Yup.number().required("Value is required for Fixed Days"),
  }),
  multiplier: Yup.number().when("type", {
    is: "Ratio of Year",
    then: Yup.number().required("Multiplier is required for Month Days"),
  }),
  divisor: Yup.number().when("type", {
    is: "Ratio of Year",
    then: Yup.number().required("Divisor is required for Fixed Days"),
  }),
});

export function SalarypolicyEditForm({
  saveSalarypolicy,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {

//   // const [defMonth, setDefaultMonth] = useState(false);

  const { userAccess, currentMonthList } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.salary_policy,
      currentMonthList: state.salary_policy.currentMonth,
    }),
    shallowEqual
  );

  const options = [
    { value: "Ratio of Year", label: "Ratio of Year" },
    { value: "Month Days", label: "Month Days" },
    { value: "Fixed Days", label: "Fixed Days" },
  ];


  const Dropdown = ({ field, form, options, label, onChange }) => (
    <div className="form-group">
      <label>{label}</label>
      <select {...field} className="form-control" onChange={onChange}>
        <option value="">{user?.type || "Select Type"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {form.touched[field.name] && form.errors[field.name] && (
        <div className="text-danger">{form.errors[field.name]}</div>
      )}
    </div>
  );
  
  
let formattedString;
  if (currentMonthList?.length>0) {

    const monthIndex = currentMonthList && currentMonthList[0]?.month - 1; // 9 for September
    const year = currentMonthList && currentMonthList[0]?.year; // 2024
  
    // Format the month
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[monthIndex]; // "Sep"
  
    // Get the start and end dates
    const startDate = new Date(currentMonthList && currentMonthList[0]?.startDate);
    const endDate = new Date(currentMonthList && currentMonthList[0]?.endDate);
  
    const formattedStartDate = `${String(startDate.getUTCDate()).padStart(2, '0')}-${String(startDate.getUTCMonth() + 1).padStart(2, '0')}-${startDate.getUTCFullYear()}`;
    const formattedEndDate = `${String(endDate.getUTCDate()).padStart(2, '0')}-${String(endDate.getUTCMonth() + 1).padStart(2, '0')}-${endDate.getUTCFullYear()}`;
  
    // Create the final formatted string
    formattedString = `${monthName} ${year} (${formattedStartDate} - ${formattedEndDate})`;
  
  }else{
    formattedString="Payroll month not available"
  }

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
      validationSchema={salarypolicyEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveSalarypolicy(values);
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="form-group row">
                  <div className="col-12 col-md-4 mt-3">

                  <label htmlFor="installment_deduction_basis_type">
                     Type
                    </label>
                    <Field
                      name="type"
                      // component={Dropdown}
                      // options={options}
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                      // label="Type"
                      onChange={(e) => {
                        setFieldValue("type", e.target.value);
                        // Clear fields based on selection
                        if (e.target.value === "Ratio of Year") {
                          setFieldValue("value", 0);
                          setFieldValue("multiplier", "");
                          setFieldValue("divisor", "");
                        }
                        if (e.target.value === "Fixed Days") {
                          setFieldValue("multiplier", 0);
                          setFieldValue("divisor", 0);
                          setFieldValue("value", "");
                        }
                        if (e.target.value === "Month Days") {
                          setFieldValue("multiplier", 0);
                          setFieldValue("divisor", 0);
                          setFieldValue("value", 1);
                        }
                      }}  >
                      <option value="">Select</option>
                      {options.map((option) => (
                        <option
                          key={option.value}
                          value={option.label}
                        >
                          {option.label}
                        </option>
                      ))}
                       </Field>
                  
                  </div>

                 
                    {/* <Field
                      name="multiplier"
                      component={Input}
                      placeholder="Enter Multiplier"
                      label="Multiplier"
                       type="number"
                      disabled={values.type == "Month Days" || values.type == "Fixed Days"}
                    /> */}

                    {!(
                      values.type === "Month Days" ||
                      values.type === "Fixed Days"
                    ) && (
                      <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="multiplier"
                        component={Input}
                        placeholder="Enter Multiplier"
                        label="Multiplier"
                        type="number"
                 
                      />
                          </div>
                    )}
              
                 
                    {/* <Field
                      name="divisor"
                      component={Input}
                      placeholder="Enter Divisor"
                      label="Divisor"
                      type="number"
                      disabled={
                        values.type == "Month Days" ||
                        values.type == "Fixed Days"
                      }
                    /> */}

                    {!(
                      values.type === "Month Days" ||
                      values.type === "Fixed Days"
                    ) && (
                      <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="divisor"
                        component={Input}
                        placeholder="Enter Divisor"
                        label="Divisor"
                        type="number"
                       
                      />
                           </div>
                    )}
             
                  {values.type === "Month Days" && formattedString && (
                  <div className="col-6 mt-3">
                      <Field
                       name="month_days"
                       component={Input}
                         value={formattedString }
                        placeholder={formattedString }
                        label="  "
                         type="number"
                        disabled
                        style={{
                           border: "none",
                          padding: "5px",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  )}
             
                
                    {/* <Field
                      name="value"
                      component={Input}
                      placeholder="Value"
                      label="Value"
                      type="number"
                      disabled={
                        values.type == "Ratio of Year" ||
                        values.type === "Month Days"
                      }
                    /> */}

{!(values.type === "Ratio of Year" || values.type === "Month Days") && (
    <div className="col-12 col-md-4 mt-3">
  <Field
    name="value"
    component={Input}
    placeholder="Duration (Days)"
    label="Duration (Days)"
    type="number"
  
  
  />
       </div>
)}

             
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
            {!isUserForRead  && values.type && (
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
