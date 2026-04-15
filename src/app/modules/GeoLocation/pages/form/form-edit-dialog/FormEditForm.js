import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, FieldArray, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CirclePlus, Trash2 } from "lucide-react";
import {
  Checkbox,
  Input,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  geoLocations: Yup.array()
    .of(
      Yup.object().shape({
        geoLocationId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        latitude: Yup.number()
          .typeError("Latitude must be a number")
          .nullable()
          .required("Latitude is required")
          .min(-90, "Latitude must be ≥ -90")
          .max(90, "Latitude must be ≤ 90"),
        longitude: Yup.number()
          .typeError("Longitude must be a number")
          .nullable()
          .required("Longitude is required")
          .min(-180, "Longitude must be ≥ -180")
          .max(180, "Longitude must be ≤ 180"),
        geoFencing: Yup.number()
          .typeError("Geo fencing must be a number")
          .nullable()
          .required("Geo fencing is required")
          .min(0, "Geo fencing must be ≥ 0"),
      }),
    )
    .min(1, "Add at least one geo location")
    .required("Geo Locations list is required"),
});

export function FormEditForm({
  saveForm,
  user,
  onHide,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();

  const { dashboard, currentState } = useSelector((state) => {
    return {
      dashboard: state?.dashboard,
      currentState: state.geo_location,
    };
  }, shallowEqual);

  const { entities } = currentState;

  useEffect(() => {
    dispatch(fetchAllFormsMenu(544, "allGeoLocations"));
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch, user]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...user,
        autoAttendance: user?.autoAttendance ?? false,
        autoTracking: user?.autoTracking ?? false,
        isLateReasonAllow: user?.isLateReasonAllow ?? false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleChange,
        handleBlur,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead || actionsLoading}>
                {/* Subsidiary Select */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        const selectedSubsidiaryId = e.value;
                        setFieldValue("subsidiaryId", selectedSubsidiaryId);

                        const existingRecord = entities?.find(
                          (ent) => ent.subsidiaryId === selectedSubsidiaryId,
                        );

                        if (existingRecord) {
                          setFieldValue(
                            "geoLocations",
                            existingRecord.geoLocations,
                          );
                          setFieldValue(
                            "autoAttendance",
                            existingRecord.autoAttendance ?? false,
                          );
                          setFieldValue(
                            "autoTracking",
                            existingRecord.autoTracking ?? false,
                          );

                          setFieldValue(
                            "isLateReasonAllow",
                            existingRecord.isLateReasonAllow ?? false,
                          );
                        } else {
                          setFieldValue("geoLocations", []);
                          setFieldValue("autoAttendance", false);
                          setFieldValue("autoTracking", false);
                          setFieldValue("isLateReasonAllow", false);
                        }
                      }}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (option) => option.value === values?.subsidiaryId,
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-3 gap-y-1 mt-2">
                  <div>
                    <Checkbox
                      isSelected={values?.autoAttendance}
                      children={
                        "Create timestamp automatically every 30 minutes"
                      }
                      disabled={isUserForRead || actionsLoading}
                      onChange={() =>
                        setFieldValue("autoAttendance", !values?.autoAttendance)
                      }
                    />
                  </div>
                  <div >
                    <Checkbox
                      isSelected={values?.isLateReasonAllow}
                      children={"Allow submitting late reason "}
                      disabled={isUserForRead || actionsLoading}
                      onChange={() =>
                        setFieldValue(
                          "isLateReasonAllow",
                          !values?.isLateReasonAllow,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <Checkbox
                      isSelected={values?.autoTracking}
                      children={
                        "Mark attendance automatically when attendance App changes the Status (In Range or Out of Range)"
                      }
                      disabled={isUserForRead || actionsLoading}
                      onChange={() =>
                        setFieldValue("autoTracking", !values?.autoTracking)
                      }
                    />
                  </div>
                </div>

                <hr />

                {/* Geo Locations Table */}
                <FieldArray name="geoLocations">
                  {({ remove, push }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Geo Location
                        </h6>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={!values?.subsidiaryId}
                          onClick={() =>
                            push({
                              geoLocationId: null,
                              latitude: "",
                              longitude: "",
                              geoFencing: "",
                              isDelete: true,
                            })
                          }
                        >
                          <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                          Add
                        </button>
                      </div>

                      <div className="w-full overflow-x-auto mt-3">
                        <div className="react-bootstrap-table table-responsive">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                            <thead>
                              <tr className="custom-table-header">
                                <td>S.No</td>
                                <td>Geo Location</td>
                                <td>Latitude</td>
                                <td>Longitude</td>
                                <td>Geo Fencing (Meter)</td>
                                <td className="text-right">Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {values?.geoLocations?.length > 0 &&
                                values.geoLocations.map((obj, i) => (
                                  <tr key={i}>
                                    <td>{i + 1}</td>

                                    {/* Geo Location Select */}
                                    <td>
                                      <SearchSelect
                                        name={`geoLocations.[${i}].geoLocationId`}
                                        isDisabled={isUserForRead}
                                        onChange={(e) =>
                                          setFieldValue(
                                            `geoLocations.[${i}].geoLocationId`,
                                            e.value || null,
                                          )
                                        }
                                        value={
                                          dashboard?.allGeoLocations?.find(
                                            (option) =>
                                              option.value ===
                                              values.geoLocations?.[i]
                                                ?.geoLocationId,
                                          ) || null
                                        }
                                        options={dashboard?.allGeoLocations?.map(
                                          (el) => ({
                                            ...el,
                                            isDisabled: values?.geoLocations.find(
                                              (e) =>
                                                e?.geoLocationId === el?.value,
                                            ),
                                          }),
                                        )}
                                        error={
                                          errors?.geoLocations?.[i]
                                            ?.geoLocationId
                                        }
                                        touched={
                                          touched?.geoLocations?.[i]
                                            ?.geoLocationId
                                        }
                                      />
                                    </td>

                                    {/* Latitude */}
                                    <td>
                                      <Field
                                        name={`geoLocations.[${i}].latitude`}
                                        component={Input}
                                        type="number"
                                        step="any"
                                        placeholder=""
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={
                                          values.geoLocations?.[i]?.latitude
                                        }
                                        error={
                                          errors?.geoLocations?.[i]?.latitude
                                        }
                                        touched={
                                          touched?.geoLocations?.[i]?.latitude
                                        }
                                        autoComplete="off"
                                      />
                                      {touched?.geoLocations?.[i]?.latitude &&
                                        errors.geoLocations?.[i]?.latitude && (
                                          <CustomErrorLabel
                                            touched={true}
                                            error={
                                              errors.geoLocations?.[i]?.latitude
                                            }
                                          />
                                        )}
                                    </td>

                                    {/* Longitude */}
                                    <td>
                                      <Field
                                        name={`geoLocations.[${i}].longitude`}
                                        component={Input}
                                        type="number"
                                        step="any"
                                        placeholder=""
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={
                                          values.geoLocations?.[i]?.longitude
                                        }
                                        error={
                                          errors?.geoLocations?.[i]?.longitude
                                        }
                                        touched={
                                          touched?.geoLocations?.[i]?.longitude
                                        }
                                        autoComplete="off"
                                      />
                                      {touched?.geoLocations?.[i]?.longitude &&
                                        errors.geoLocations?.[i]?.longitude && (
                                          <CustomErrorLabel
                                            touched={true}
                                            error={
                                              errors.geoLocations?.[i]
                                                ?.longitude
                                            }
                                          />
                                        )}
                                    </td>

                                    {/* Geo Fencing */}
                                    <td>
                                      <Field
                                        name={`geoLocations.[${i}].geoFencing`}
                                        component={Input}
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder=""
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={
                                          values.geoLocations?.[i]?.geoFencing
                                        }
                                        error={
                                          errors?.geoLocations?.[i]?.geoFencing
                                        }
                                        touched={
                                          touched?.geoLocations?.[i]?.geoFencing
                                        }
                                        autoComplete="off"
                                      />
                                      {touched?.geoLocations?.[i]?.geoFencing &&
                                        errors.geoLocations?.[i]
                                          ?.geoFencing && (
                                          <CustomErrorLabel
                                            touched={true}
                                            error={
                                              errors.geoLocations?.[i]
                                                ?.geoFencing
                                            }
                                          />
                                        )}
                                    </td>

                                    {/* Action */}
                                    <td className="text-right">
                                      {!isUserForRead &&
                                        (values.geoLocations?.[i]?.isDelete ? (
                                          <span
                                            id={i}
                                            onClick={() => remove(i)}
                                          >
                                            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                          </span>
                                        ) : (
                                          <span id={i} title="Reocrd in Use">
                                            <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer" />
                                          </span>
                                        ))}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {typeof errors?.geoLocations === "string" && (
                        <label className="invalid-feedback">
                          {errors?.geoLocations}
                        </label>
                      )}
                    </div>
                  )}
                </FieldArray>
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
                disabled={actionsLoading}
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
