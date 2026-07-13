import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";

const assetSchema = Yup.object().shape({
  asset_makeId: Yup.string().required(VALIDATION_MESSAGES.required),

  list: Yup.array()
    .of(
      Yup.object().shape({
        sno: Yup.number().required(),

        asset_categoryId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),

        name: Yup.string()
          .trim()
          .max(50)
          .required(VALIDATION_MESSAGES.required),

        description: Yup.string()
          .trim()
          .max(100)
          .required(VALIDATION_MESSAGES.required),
      })
    )
    .test(
      "unique-category-name",
      "Same name is not allowed in the same category",
      function (list) {
        if (!list) return true;

        const keys = list
          .filter(item => item.name && item.asset_categoryId)
          .map(
            item =>
              `${item.asset_categoryId}_${item.name.trim().toLowerCase()}`
          );

        return keys.length === new Set(keys).size;
      }
    ),
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

  useEffect(() => {
    dispatch(fetchAllFormsMenu(558, "allAssetMakeList"));
  }, [dispatch]);

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.asset_model,
    }),
    shallowEqual
  );

  const { entities } = currentState;

  const filteredOptions = dashboard?.allAssetMakeList?.filter(
    (opt) => !entities?.some((ent) => ent.Id === opt.value)
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...data,
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
                      name="asset_makeId"
                      label={
                        <span>
                          Asset Make (Company)
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data?.dataIsExist}
                      onChange={(e) => {
                        setFieldValue("asset_makeId", e?.value || null);
                        setFieldValue("list", []);
                      }}
                      value={
                        dashboard?.allAssetMakeList?.find(
                          (option) => option.value == values?.asset_makeId
                        ) || null
                      }
                      options={filteredOptions}
                      error={errors.asset_makeId}
                      touched={touched.asset_makeId}
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