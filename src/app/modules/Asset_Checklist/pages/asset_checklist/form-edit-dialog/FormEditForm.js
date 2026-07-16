import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllActiveEmployees, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";
import { DatePickerField, Input, TextArea } from "../../../../../../_metronic/_partials/controls";
import { fetchAllAssetInspectionListById, fetchAllPresentUnassignedCategory, fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";
import { format, set } from "date-fns";
import { Eye, XCircle } from "lucide-react";
import AssetDetails from "../../../../../utils/common-modules/AssetDetails";
import { fetchAssetInspectionListDataForEdit } from "../../../_redux/redux-Actions";

const assetSchema = Yup.object().shape({
  asset_categoryId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  inspected_by_employeeId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  asset_registerId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  date_of_inspection: Yup.date().nullable().required(VALIDATION_MESSAGES.required),
  reason_for_inspection: Yup.string().nullable(),
  event_for_inspection: Yup.string().nullable().required(VALIDATION_MESSAGES.required),

  list: Yup.array()
    .of(
      Yup.object().shape({
        sno: Yup.number().required(),


        checklist_description: Yup.string()
          .trim()
          .max(100)
          .required(VALIDATION_MESSAGES.required),

        remarks: Yup.string()
          .trim()
          .max(200)
        ,

        status: Yup.number()
          .nullable()
          .oneOf([0, 1], "Please select a valid status")
          .required(VALIDATION_MESSAGES.required),
      })
    )
    .test(
      "unique-checklist_description",
      "Same checklist description is not allowed",
      function (list) {
        if (!list) return true;

        const descriptions = list
          .filter(item => item.checklist_description)
          .map(item => item.checklist_description.trim().toLowerCase());

        return descriptions.length === new Set(descriptions).size;
      }
    )
});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();

  const { dashboard } = useSelector((state) => state);
  const [assetDetailsPanel, setAssetDetailsPanel] = useState(false);

  useEffect(() => {

    dispatch(fetchAllPresentUnassignedCategory());
    dispatch(fetchAllActiveEmployees());

    if (data?.asset_categoryId) {
      dispatch(fetchAllRegisterAssetName({ asset_categoryId: data?.asset_categoryId }));
    }
  }, [dispatch, data]);

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.asset_checklist,
    }),
    shallowEqual
  );

  const { entities } = currentState;



  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...data,
        date_of_inspection: data?.date_of_inspection ||
          data?.list?.[0]?.date_of_inspection
          ? format(
            new Date(
              data?.date_of_inspection ||
              data?.list?.[0]?.date_of_inspection
            ),
            "dd-MMM-yyyy"
          )
          : "",
        list: data?.list || [],
      }}
      validationSchema={assetSchema}
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
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">

            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              {console.log("errors1111", errors)}
              <fieldset disabled={isdataForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="asset_categoryId"
                      label={
                        <span>
                          Asset Category
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data?.dataIsExist}
                      onChange={(e) => {
                        setFieldValue("asset_categoryId", e?.value || null);
                        dispatch(fetchAllAssetInspectionListById(e?.value));
                        dispatch(fetchAllRegisterAssetName({ asset_categoryId: e?.value }));
                        setFieldValue("list", []);
                        if (e?.value && values.asset_registerId && values.date_of_inspection) {
                          dispatch(fetchAssetInspectionListDataForEdit({
                            asset_categoryId: e?.value,
                            asset_registerId: values.asset_registerId,
                            date_of_inspection: values.date_of_inspection,
                          }));
                        }
                      }}
                      value={
                        dashboard?.allPresentUnassignedCategoryList?.find(
                          (option) => option.value == values?.asset_categoryId
                        ) || null
                      }
                      options={dashboard?.allPresentUnassignedCategoryList}
                      error={errors.asset_categoryId}
                      touched={touched.asset_categoryId}
                    />
                  </div>


                  <div className="">
                    <SearchSelect
                      name="asset_registerId"
                      component={Input}
                      placeholder="Select Asset"
                      className="form-control"

                      isDisabled={!values.asset_categoryId || isdataForRead || data?.dataIsExist}
                      value={dashboard?.allRegisterAssetList
                        ?.filter((item) => Number(item.status) === 0)
                        ?.find(
                          (x) => Number(x.value) === Number(values.asset_registerId)
                        ) || null}
                      label={
                        <span>
                          Asset <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        setFieldValue("asset_registerId", e?.value || null);
                        if (e?.value && values?.asset_categoryId && values?.date_of_inspection) {
                          dispatch(fetchAssetInspectionListDataForEdit({
                            asset_categoryId: values?.asset_categoryId,
                            asset_registerId: e?.value,
                            date_of_inspection: values?.date_of_inspection,
                          }));
                        }

                      }}
                      options={
                        dashboard?.allRegisterAssetList?.filter(
                          (item) => Number(item.status) === 0
                        ) || []
                      }
                      autoComplete="off"
                    />

                    <ErrorMessage
                      name="asset_registerId"
                      component="div"
                      className="invalid-feedback d-block"
                    />
                  </div>

                  <div className="mt-6">
                    {assetDetailsPanel ? (
                      <button
                        type="button"
                        disabled={values.asset_registerId ? false : true}
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() =>
                          setAssetDetailsPanel(!assetDetailsPanel)
                        }
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={values.asset_registerId ? false : true}
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() =>
                          setAssetDetailsPanel(!assetDetailsPanel)
                        }
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}
                  </div>

                </div>
                <br />
                <AssetDetails assetId={values?.asset_registerId} panelMode={assetDetailsPanel} />
                <br />

                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-1">
                    <label>
                      Date of Inspection
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="date_of_inspection"
                      disabled={!values.asset_registerId || isdataForRead || data?.dataIsExist}
                      component={DatePickerField} // Custom component
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      type="date"
                      maxDate={new Date()}
                      onChange={(e) => {
                        setFieldValue("date_of_inspection", e);

                        if (e && values?.asset_categoryId && values?.asset_registerId) {
                          dispatch(fetchAssetInspectionListDataForEdit({
                            asset_categoryId: values?.asset_categoryId,
                            asset_registerId: values?.asset_registerId,
                            date_of_inspection: e,
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="col-span-1">
                    <SearchSelect
                      name="inspected_by_employeeId"
                      component={Input}
                      placeholder="Select Employee"
                      className="form-control" // Force full height
                      value={dashboard?.allEmployees?.find(
                        (x) =>
                          Number(x.value) === Number(values.inspected_by_employeeId),
                      )}
                      label={
                        <span>
                          {" "}
                          Inspected By
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        setFieldValue("inspected_by_employeeId", e.value || null);
                      }}
                      options={dashboard?.allEmployees}

                      autoComplete="off"
                    />
                    <ErrorMessage
                      name="inspected_by_employeeId"
                      component="div"
                      className="invalid-feedback d-block"
                    />



                  </div>


                  <div className="col-span-1">
                    <Field
                      name="event_for_inspection"
                      component={Input}
                      placeholder="Enter event for inspection"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Inspection Event
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />

                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-3">
                    <Field
                      name="reason_for_inspection"
                      component={TextArea}
                      placeholder="Enter reason for inspection"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Reason for Inspection

                        </span>
                      }
                      autoComplete="off"
                    />

                  </div>


                </div>


                <hr />

                <PatternListForm
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  isdataForRead={isdataForRead}
                  isEditMode={!!data?.Id}
                />
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {!isdataForRead ? (
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

            {!isdataForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={!values?.list?.length}
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white" />
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}