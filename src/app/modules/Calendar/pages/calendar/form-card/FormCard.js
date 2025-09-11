import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import {
  CardBody,
  DatePickerField,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import TCard from "../../../../../utils/common-modules/TCard";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  from_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from_date"), "'To Date' should not be less than 'From Date'."),
});

export function FormCard() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [bodyValues, setBodyValues] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const customSubmit = (values) => {
    let formattedFromDate = formatDates(values?.from_date, "yyyy-MM-dd");
    let formattedToDate = formatDates(values?.to_date, "yyyy-MM-dd");
    dispatch(
      actions.fetchHolidays(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
    // dispatch(actions.fetchHolidays(values, setLoading));
  };

  const { currentState, dashboard } = useSelector((state) => {
    return {
      currentState: state?.calendar,
      dashboard: state?.dashboard,
    };
  });

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  const { holidayCalendar } = currentState;

  useEffect(() => {
    if (dashboard.allSubsidiaryList && dashboard.allSubsidiaryList.length > 0) {
      const firstSubsidiary = dashboard.allSubsidiaryList[0];
      setBodyValues({
        from_date: firstSubsidiary.fiscalYear?.startDate || "",
        to_date: firstSubsidiary.fiscalYear?.endDate || "",
        subsidiaryId: firstSubsidiary.value || "",
      });
      setIsDataLoaded(true); // Mark data as loaded
    }
  }, [dashboard.allSubsidiaryList]);

  useEffect(() => {
    // Automatically submit when data is loaded
    if (isDataLoaded && bodyValues?.subsidiaryId) {
      customSubmit(bodyValues);
    }
  }, [isDataLoaded, bodyValues]);

  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}></CardHeader>

    //     <Formik
    //       enableReinitialize={true}
    //       initialValues={{
    //         from_date: bodyValues?.from_date,
    //         to_date: bodyValues?.to_date,
    //         subsidiaryId: bodyValues?.subsidiaryId,
    //       }}
    //       validationSchema={formValidation}
    //       onSubmit={(values) => {
    //         customSubmit(values);
    //       }}
    //     >
    //       {({
    //         handleSubmit,
    //         handleBlur,
    //         setFieldValue,
    //         handleReset,
    //         values,
    //         touched,
    //         errors,
    //       }) => (
    //         <>
    //           <Modal.Body className="overlay overlay-block cursor-default">
    //             <Form className="form form-label-right">
    //               <fieldset>
    //                 <div
    //                   style={{
    //                     backgroundColor: "rgb(235 243 255)",
    //                     marginTop: "15px",
    //                     padding: "20px",
    //                     borderRadius: "5px",
    //                     border: "2px solid #adceff",
    //                   }}
    //                 >
    //                   <h6>Holiday Calendar</h6>

    //                   <div className="from-group row">
    //                     <div className="col-12 col-md-4 mt-3">
    //                       <SearchSelect
    //                         name="subsidiaryId"
    //                         label={
    //                           <span>
    //                             Subsidiary
    //                             <span style={{ color: "red" }}>*</span>
    //                           </span>
    //                         }
    //                         onChange={(e) => {
    //                           setFieldValue("subsidiaryId", e.value || null);
    //                         }}
    //                         value={
    //                           dashboard?.allSubsidiaryList?.find(
    //                             (option) =>
    //                               option?.value === values?.subsidiaryId
    //                           ) || null
    //                         }
    //                         options={dashboard?.allSubsidiaryList}
    //                         error={errors.subsidiaryId}
    //                         touched={touched.subsidiaryId}
    //                       />
    //                     </div>

    //                     {/*
    //                     <div className="col-12 col-md-4 mt-3">
    //                       <Field
    //                         name="from_date"
    //                         component={DatePickerField}
    //                         dateFormat="dd/MM/yyyy"
    //                         className="form-control"

    //                         label={
    //                           <span>
    //                             {" "}
    //                             Date From<span style={{ color: "red" }}>*</span>
    //                           </span>
    //                         }
    //                         onChange={(date) => {
    //                           setFieldValue('from_date', date)
    //                           setFieldValue('to_date', date)
    //                         }}
    //                         autoComplete="off"
    //                       />
    //                     </div>

    //                     <div className="col-12 col-md-4 mt-3">
    //                       <Field
    //                         name="to_date"
    //                         component={DatePickerField}
    //                         onBlur={handleBlur}
    //                         className="form-control"
    //                         dateFormat="dd/MM/yyyy"
    //                         label={
    //                           <span>
    //                             {" "}
    //                             Date To<span style={{ color: "red" }}>*</span>
    //                           </span>
    //                         }
    //                         onChange={(date) => {
    //                           setFieldValue('to_date', date)
    //                         }}
    //                         autoComplete="off"
    //                       />
    //                     </div> */}

    //                     <div className="col-12 col-md-4 mt-3">
    //                       <label>
    //                         From<span style={{ color: "red" }}>*</span>
    //                       </label>
    //                       <DatePicker
    //                         className="form-control"
    //                         placeholder="From "
    //                         selected={
    //                           values?.from_date
    //                             ? new Date(values.from_date)
    //                             : null
    //                         }
    //                         onChange={(date) => {
    //                           setFieldValue("from_date", date);
    //                           setFieldValue("to_date", date); // Sync from_date and to_date
    //                         }}
    //                         timeInputLabel="Time:"
    //                         dateFormat="dd-MMM-yyyy"
    //                         // showTimeInput
    //                         name="from_date"
    //                         autoComplete="off"
    //                       />
    //                     </div>

    //                     {/* Date To Selector */}
    //                     <div className="col-12 col-md-4 mt-3">
    //                       <label>
    //                         Date To<span style={{ color: "red" }}>*</span>
    //                       </label>
    //                       <DatePicker
    //                         className="form-control"
    //                         placeholder="To "
    //                         selected={
    //                           values?.to_date ? new Date(values.to_date) : null
    //                         }
    //                         onChange={(date) => {
    //                           setFieldValue("to_date", date);
    //                         }}
    //                         timeInputLabel="Time:"
    //                         dateFormat="dd-MMM-yyyy"
    //                         // showTimeInput
    //                         name="to_date"
    //                         autoComplete="off"
    //                       />
    //                     </div>
    //                   </div>
    //                 </div>
    //               </fieldset>
    //             </Form>
    //           </Modal.Body>
    //           <Modal.Footer>
    //             <button
    //               type="button"
    //               onClick={() => {
    //                 handleReset();
    //                 dispatch(actions.clearEvents());
    //               }}
    //               className="btn btn-danger btn-elevate"
    //             >
    //               Cancel
    //             </button>

    //             <button
    //               onClick={() => {
    //                 customSubmit(values);
    //               }}
    //               disabled={!values.from_date || !values.to_date}
    //               className="btn btn-success btn-elevate"
    //             >
    //               Filter Record
    //               {loading && (
    //                 <span className="ml-3 mr-3 spinner spinner-white"></span>
    //               )}
    //             </button>
    //           </Modal.Footer>
    //         </>
    //       )}
    //     </Formik>

    //     <CardBody>
    //       {holidayCalendar && holidayCalendar.length > 0 && <FormTable />}
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <div className="">
        <Formik
          enableReinitialize={true}
          initialValues={{
            from_date: bodyValues?.from_date,
            to_date: bodyValues?.to_date,
            subsidiaryId: bodyValues?.subsidiaryId,
          }}
          validationSchema={formValidation}
          onSubmit={(values) => {
            customSubmit(values);
          }}
        >
          {({
            handleSubmit,
            handleBlur,
            setFieldValue,
            handleReset,
            values,
            touched,
            errors,
          }) => (
            <>
              <Form className="form form-label-right">
                <fieldset>
                  <div>
                    <h6 className="font-bold mb-0 text-primary my-2 mt-4">
                      Fitlers
                    </h6>

                    <div className="grid-cols-3 md:grid-cols-6 grid gap-x-3 gap-y-1">
                      <div className="col-span-1">
                        {/* <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                          }}
                          value={
                            dashboard?.allSubsidiaryList?.find(
                              (option) => option?.value === values?.subsidiaryId
                            ) || null
                          }
                          options={dashboard?.allSubsidiaryList}
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                        /> */}
                        <SubsidiarySelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                          }}
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                          currentValue={values?.subsidiaryId}
                          initializeSubsidiary={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                          }}
                        />
                      </div>

                      {/* 
                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            name="from_date"
                            component={DatePickerField}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"

                            label={
                              <span>
                                {" "}
                                Date From<span style={{ color: "red" }}>*</span>
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
                                Date To<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            onChange={(date) => {
                              setFieldValue('to_date', date)
                            }}
                            autoComplete="off"
                          />
                        </div> */}

                      <div>
                        <label>
                          From<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="From "
                          selected={
                            values?.from_date
                              ? new Date(values.from_date)
                              : null
                          }
                          onChange={(date) => {
                            setFieldValue("from_date", date);
                            setFieldValue("to_date", date); // Sync from_date and to_date
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          // showTimeInput
                          name="from_date"
                          autoComplete="off"
                        />
                      </div>

                      {/* Date To Selector */}
                      <div>
                        <label>
                          Date To<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="To "
                          selected={
                            values?.to_date ? new Date(values.to_date) : null
                          }
                          onChange={(date) => {
                            setFieldValue("to_date", date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          // showTimeInput
                          name="to_date"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </Form>
              <Modal.Footer>
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    dispatch(actions.clearEvents());
                  }}
                  className="btn btn-light"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    customSubmit(values);
                  }}
                  disabled={!values.from_date || !values.to_date}
                  className="btn btn-primary btn-elevate"
                >
                  Filter
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </div>
      {holidayCalendar && holidayCalendar.length > 0 && <FormTable />}
    </TCard>
    // </>
  );
}
