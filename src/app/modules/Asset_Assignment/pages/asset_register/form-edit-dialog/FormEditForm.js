import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { fetchAllAssetModelName, fetchAllPresentUnassignedCategory, fetchAllPresentUnassignedMakeCompany, fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";
import { EmployeeAssetTable } from "../form-table/EmployeeAssetTable";
import { fetchAssetAssignmentList } from "../../../_redux/redux-Actions";
import { Eye, XCircle } from "lucide-react";
import AssetDetails from "../../../../../utils/common-modules/AssetDetails";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";

const assetAssignmentSchema = Yup.object().shape({
  employeeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  date_of_assignment: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_categoryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_makeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_modelId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_registerId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  assigned_by_employeeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "different-employee",
      "Assigned By Employee cannot be the same as Employee.",
      function (value) {
        return Number(value) !== Number(this.parent.employeeId);
      }
    ),
});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {

    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllAssetModelName());

    // dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));

    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    // dispatch(fetchAllFormsMenu(558, "allAssetMakeList"));

    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllRegisterAssetName());
    dispatch(fetchAssetAssignmentList(formData?.employeeId));
    if (formData?.asset_categoryId) {
      dispatch(fetchAllPresentUnassignedMakeCompany({ asset_categoryId: formData?.asset_categoryId }));
      dispatch(fetchAllPresentUnassignedCategory({ employeeId: formData?.employeeId }));
    }

  }, [dispatch, formData.Id]);

  const [assetDetailsPanel, setAssetDetailsPanel] = useState(false);
  const [employeeDetailsPanel, setEmployeeDetailsPanel] = useState(false);
  console.log("aaaaaaa2222", formData.assigned_by_employeeId);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        asset_categoryId: formData?.AssetRegister?.asset_categoryId || null,
        asset_makeId: formData?.AssetRegister?.AssetModel?.asset_makeId || null,
        asset_modelId: formData?.AssetRegister?.asset_modelId || null,
        asset_registerId: formData?.asset_registerId || null,
      }}
      validationSchema={assetAssignmentSchema}
      onSubmit={(values) => {
        enableLoading();
        console.log("values111111", values);
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
      }) => {
        const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
          (item) => Number(item.value) === Number(values.subsidiaryId),
        );
        return (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">

                    <div className="col-span-1">
                      <SearchSelect
                        name="employeeId"
                        component={Input}
                        placeholder="Select Employee"
                        className="form-control" // Force full height
                        value={dashboard?.allEmployees?.find(
                          (x) =>
                            Number(x.value) === Number(values.employeeId),
                        )}
                        label={
                          <span>
                            {" "}
                            Employee
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("employeeId", e.value || null);
                          dispatch(fetchAssetAssignmentList(e?.value));
                          dispatch(fetchAllPresentUnassignedCategory({ employeeId: e?.value }));
                          setFieldValue("asset_categoryId", null);
                        }}
                        options={dashboard?.allEmployees}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="employeeId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>

                    <div className="mt-6">
                      {employeeDetailsPanel ? (
                        <button
                          type="button"
                          disabled={values.employeeId ? false : true}
                          className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                          onClick={() =>
                            setEmployeeDetailsPanel(!employeeDetailsPanel)
                          }
                        >
                          <XCircle className="w-3 h-3 text-black" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={values.employeeId ? false : true}
                          className="btn btn-primary d-flex align-items-center gap-2"
                          onClick={() =>
                            setEmployeeDetailsPanel(!employeeDetailsPanel)
                          }
                        >
                          <Eye className="w-4 h-4 text-white" />
                          View Details
                        </button>
                      )}
                    </div>


                  </div>
                  <br />
                  <EmployeeProfile employeeId={values?.employeeId} panelMode={employeeDetailsPanel} />

                  <EmployeeAssetTable employeeId={values.employeeId} />



                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">
                      <label>
                        Date of Assignment
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="date_of_assignment"
                        component={DatePickerField} // Custom component
                        dateFormat="dd-MMM-yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date_of_assignment", e);
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <SearchSelect
                        name="asset_categoryId"
                        component={Input}
                        placeholder="Asset Category"
                        isDisabled={values?.employeeId ? false : true}
                        className="form-control" // Force full height
                        value={dashboard?.allPresentUnassignedCategoryList?.find(
                          (x) =>
                            Number(x.value) === Number(values.asset_categoryId),
                        )}
                        label={
                          <span>
                            {" "}
                            Asset Category
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("asset_categoryId", e.value || null);
                          setFieldValue("asset_makeId", null);
                          setFieldValue("asset_modelId", null);
                          setFieldValue("asset_registerId", null);
                          dispatch(fetchAllPresentUnassignedMakeCompany({ asset_categoryId: e.value }));
                        }}
                        options={dashboard?.allPresentUnassignedCategoryList}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="asset_categoryId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>

                    <div>
                      <SearchSelect
                        name="asset_makeId"
                        isDisabled={values?.asset_categoryId ? false : true}
                        label={
                          <span>
                            Asset Make (Company)
                            <span style={{ color: "red" }}> *</span>
                          </span>
                        }

                        onChange={(e) => {
                          setFieldValue("asset_makeId", e?.value || null);


                          setFieldValue("asset_modelId", null);
                          setFieldValue("asset_registerId", null);

                          dispatch(fetchAllAssetModelName({ asset_categoryId: values?.asset_categoryId, asset_makeId: e?.value }));
                        }}
                        value={
                          dashboard?.allPresentUnassignedMakeCompanyList?.find(
                            (option) => option.value == values?.asset_makeId
                          ) || null
                        }
                        options={dashboard.allPresentUnassignedMakeCompanyList}
                        error={errors.asset_makeId}
                        touched={touched.asset_makeId}
                      />
                    </div>


                  </div>





                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">

                    <div className="col-span-1">
                      <SearchSelect
                        name="asset_modelId"
                        component={Input}
                        placeholder="Enter date of expiry"
                        className="form-control" // Force full height
                        value={dashboard?.allAssetModelNameList?.find(
                          (x) =>
                            Number(x.value) === Number(values.asset_modelId),
                        )}
                        label={
                          <span>
                            {" "}
                            Asset Model Name
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={!values.asset_makeId}
                        onChange={(e) => {
                          setFieldValue("asset_modelId", e.value || null);
                          setFieldValue("asset_registerId", null);
                          dispatch(fetchAllRegisterAssetName({ asset_modelId: e?.value }));
                        }}
                        options={dashboard?.allAssetModelNameList}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="asset_modelId"
                        component="div"
                        className="invalid-feedback d-block"
                      />

                    </div>


                    <div className="">
                      <SearchSelect
                        name="asset_registerId"
                        component={Input}
                        placeholder="Select Asset"
                        className="form-control"
                        isDisabled={!values.asset_modelId}
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

                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">
                      <SearchSelect
                        name="assigned_by_employeeId"
                        component={Input}
                        placeholder="Select Employee"
                        className="form-control" // Force full height
                        value={dashboard?.allEmployees?.find(
                          (x) =>
                            Number(x.value) === Number(values.assigned_by_employeeId),
                        )}
                        label={
                          <span>
                            {" "}
                            Assigned By Employee
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("assigned_by_employeeId", e.value || null);
                        }}
                        // options={dashboard?.allEmployees}
                        options={
                          (dashboard?.allEmployees || []).filter(
                            (item) => Number(item.value) !== Number(values.employeeId)
                          )
                        }
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="assigned_by_employeeId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>
                  </div>





                </fieldset>
              </Form>
            </Modal.Body >
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
                  onClick={() => {
                    console.log("Errors", errors);
                    console.log("Values", values);
                    handleSubmit();
                  }}
                  className="btn btn-primary btn-elevate"
                >
                  Assign Asset
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        );
      }}
    </Formik >
  );
}
