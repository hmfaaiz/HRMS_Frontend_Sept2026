import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllFormsMenu,

} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";

import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { FormDynamicDialogModal } from "../form-delete-dialog/FormDeleteDialog";
import AssetDetails from "../../../../../utils/common-modules/AssetDetails";
import { Eye, XCircle } from "lucide-react";

const assetDisposalSchema = Yup.object().shape({
  date_of_disposal: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_categoryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),




  asset_registerId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  disposal_typeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  disposal_price: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  remarks: Yup.string()
    .trim()
    .nullable(),
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assetDetailsPanel, setAssetDetailsPanel] = useState(false);
  useEffect(() => {

    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
    dispatch(fetchAllFormsMenu(559, "allAssetDisposaTypeList"));

    dispatch(fetchAllRegisterAssetName({ asset_categoryId: formData?.asset_categoryId }));


  }, [dispatch, formData.Id]);




  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        asset_categoryId: formData?.AssetRegister?.asset_categoryId || null,

        asset_registerId: formData?.asset_registerId || null,
      }}
      validationSchema={assetDisposalSchema}
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
        handleChange, setFieldTouched,
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
                        name="asset_categoryId"
                        component={Input}
                        placeholder="Asset Category"
                        className="form-control" // Force full height
                        value={dashboard?.allAssetCategoryList?.find(
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
                          dispatch(fetchAllRegisterAssetName({ asset_categoryId: e?.value }));
                        }}
                        options={dashboard?.allAssetCategoryList}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="asset_categoryId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>


                    <div className="">
                      <SearchSelect
                        name="asset_registerId"
                        component={Input}
                        placeholder="Enter date of expiry"
                        className="form-control" // Force full height
                        isDisabled={!values.asset_categoryId}
                        value={dashboard?.allRegisterAssetList?.find(
                          (x) =>
                            Number(x.value) === Number(values.asset_registerId),
                        )}
                        label={
                          <span>
                            {" "}
                            Asset
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("asset_registerId", e.value || null);
                        }}
                        options={dashboard?.allRegisterAssetList?.filter(
                          (item) => item.status !== 1 && item.status !== 2
                        )}
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
                        name="disposal_typeId"
                        component={Input}
                        placeholder="Select Asset Disposal Type"
                        className="form-control" // Force full height
                        value={dashboard?.allAssetDisposaTypeList?.find(
                          (x) =>
                            Number(x.value) === Number(values.disposal_typeId),
                        )}
                        label={
                          <span>
                            {" "}
                            Asset Disposal Type
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("disposal_typeId", e.value || null);

                        }}
                        options={dashboard?.allAssetDisposaTypeList}

                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="disposal_typeId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>
                    <div className="col-span-1">
                      <label>
                        Date of Disposal
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="date_of_disposal"
                        component={DatePickerField} // Custom component
                        dateFormat="dd-MMM-yyyy"
                        placeholder="Select Date"

                        type="date"
                        onChange={(e) => {
                          setFieldValue("date_of_disposal", e);
                        }}

                        maxDate={new Date()}
                      />
                    </div>

                    <div className="">
                      <AmountInput
                        field={{
                          name: "disposal_price",
                          value: values.disposal_price,
                          onBlur: () => setFieldTouched("disposal_price", true),
                          onChange: () => { },
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        label={
                          <span>
                            Disposal Price<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Enter Purchase Price"
                        autoComplete="off"

                        value={values.disposal_price}
                        onChange={(value) => {

                          setFieldValue("disposal_price", value);
                        }}
                      />
                    </div>
                  </div>




                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">

                  </div>


                  <div className="col-span-3">
                    <Field
                      name="remarks"
                      component={TextArea}
                      placeholder="Enter disposal remarks"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Disposal Remarks
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div></div>
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
                // <button
                //   type="submit"
                //   onClick={() => {
                //     console.log("Errors", errors);
                //     console.log("Values", values);
                //     handleSubmit();
                //   }}
                //   className="btn btn-primary btn-elevate"
                // >
                //   Disposal Asset
                //   {loading && (
                //     <span className="ml-3 mr-3 spinner spinner-white"></span>
                //   )}
                // </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="btn btn-primary btn-elevate"
                >
                  Disposal Asset
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>

            <Modal
              show={showConfirmModal}
              onHide={() => setShowConfirmModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Disposal</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                Are you sure you want to dispose this asset?
              </Modal.Body>

              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowConfirmModal(false)}
                >
                  No
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleSubmit();
                  }}
                >
                  Yes
                </button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }}
    </Formik >
  );
}
