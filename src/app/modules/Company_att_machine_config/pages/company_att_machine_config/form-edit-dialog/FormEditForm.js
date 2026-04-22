import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

// percentage: Yup.string().required("Required*"),
const attMachineConfigEditSchema = Yup.object().shape({


  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  deviceName: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


  deviceIP: Yup.string()
    .transform((value, originalValue) => originalValue === null ? '' : value)
    .trim()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
      "Invalid IP address format"
    ),

  port: Yup.number()
    .nullable()
    .typeError("Port must be a number")
    .required(VALIDATION_MESSAGES.required)
    .integer("Port must be an integer")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535"),

  type: Yup.number()
    .nullable().required(VALIDATION_MESSAGES.required),


  machineNo: Yup.number()
    .nullable()
    .typeError("Must be a number")
    .integer("Must be integer")
    .min(1, "Minimum value is 1")
    .max(99999, "Maximum 5 digits allowed")
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

  useEffect(() => {
    if (!user.Id) {

      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

    }
  }, [dispatch, user.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.company_att_machine_config,
      userAccess: state?.auth?.userAccess["company_att_machine_config"],
    };
  }, shallowEqual);

  const { userForEdit } = currentState;



  const deviceTypeist = [
    { value: 1, label: "ZKTeco" },

  ]

  return (
    <Formik
      enableReinitialize={true}


      initialValues={user}
      validationSchema={attMachineConfigEditSchema}
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">

                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                      />
                    </div>


                  </div>
                  <div className="col-span-1">
                    <label>
                      <span>
                        Device Name<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="deviceName"
                      component={Input}
                      placeholder="Enter device name "
                      type="text"
                    />
                  </div>


                  <div className="col-span-1">
                    <label>
                      <span>
                        Device IP<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="deviceIP"
                      component={Input}
                      placeholder="Enter device ip"
                      type="text"
                    />
                  </div>




                  <div className="col-span-1">
                    <label>
                      <span>
                        Port<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="port"
                      component={Input}

                      type="number"


                    />
                  </div>

                  <div className="col-span-1">
                    <SearchSelect
                      name="type"
                      label={
                        <span>
                          Type<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("type", e.value || null);
                      }}
                      value={
                        deviceTypeist?.find(
                          (option) => option.value === values.type
                        ) || null
                      }
                      options={deviceTypeist}

                      error={errors.type}
                      touched={touched.type}
                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      <span>
                        Machine No<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="machineNo"
                      component={Input}

                      type="number"


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
