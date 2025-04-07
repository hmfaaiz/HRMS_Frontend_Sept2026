import React, { useState } from "react"
import { Field, Formik } from "formik"
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import { CardBody, DatePickerField,  } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CardHeader } from "@material-ui/core";



const formValidation = Yup.object().shape({
   subsidiaryId: Yup.number()
     .required(VALIDATION_MESSAGES.required),
  from_date: Yup.date(),
  to_date: Yup.date().min(Yup.ref('from_date'), 'Date to date cannot be before Date from date'),

});




export function FormCard() {
  const dispatch = useDispatch();
const [loading,setLoading]=useState(false)
  const customSubmit = (values) => {
    dispatch(actions.fetchHolidays(values,setLoading));
  }
  const { currentState } = useSelector(
    (state) => {
      return {
        currentState: state.calendar,
      };
    }
  );

  const {holidayCalendar } = currentState;
  return (
<>
    <Card>

    <CardHeader title={CurrentModuleName()} >

   
      
    </CardHeader>

    <Formik
        enableReinitialize={true}
        initialValues={{
          from_date: null,  // Assuming no date initially
          to_date: null,    // Assuming no date initially
        }}
        validationSchema={formValidation}
        onSubmit={(values) => 
     {
          
          customSubmit(values)
        }}
      >
        {({
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset,values,
        
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>

        


                  <div style={{ backgroundColor: "rgb(235 243 255)", marginTop: "15px", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>{CurrentModuleName()}</h6>

                    <div className="from-group row">




                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="from_date"
                          component={DatePickerField}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          label={
                            <span>
                              {" "}
                              Date From
                            </span>
                          }
                          onChange={(date) => {
                            setFieldValue('from_date', date)
                            setFieldValue('to_date', date)
                          }}
                          autoComplete="off"
                        />
                      </div>



                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="to_date"
                          component={DatePickerField}
                          onBlur={handleBlur}
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          label={
                            <span>
                              {" "}
                              Date To
                            </span>
                          }
                          onChange={(date) => {
                            setFieldValue('to_date', date)
                          }}
                          autoComplete="off"
                        />
                      </div>


                    </div>

                  </div>


              
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>

              <button
                type="button"
                onClick={() => {
                  handleReset();
                  dispatch(actions.clearEvents());
                }}
                className="btn btn-danger btn-elevate"
              >
                Cancel
              </button>

              <button
           
                onClick={() => {customSubmit(values)}}
           
                className="btn btn-success btn-elevate"
              >
                Filter Record
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>


            </Modal.Footer>

        

          </>
        )}
      </Formik>


      <CardBody>
          {holidayCalendar && holidayCalendar.length>0 && <FormTable />}
        </CardBody>

  </Card>
    

    

    </>
  )
}
