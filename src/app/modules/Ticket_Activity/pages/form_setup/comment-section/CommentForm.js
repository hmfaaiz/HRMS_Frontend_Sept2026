import React, { useEffect, useMemo, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { useFormUIContext } from "../FormUIContext";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { MentionInputField } from "../../../../../../_metronic/_partials/controls/forms/MentionInput";

const formSchema = Yup.object().shape({
  comment: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function CommentForm({ onSave }) {
  const formUIContext = useFormUIContext();
  const inputFile = useRef(null);
  const { initVal, commentForm, setCommentForm } = useMemo(() => {
    return {
      initVal: formUIContext?.initVal,
      commentForm: formUIContext?.commentForm,
      setCommentForm: formUIContext?.setCommentForm,
    };
  }, [formUIContext]);

  const { dashboard, loading } = useSelector(
    (state) => ({
      dashboard: state?.dashboard,
      loading: state?.ticket_activity?.actionLoading,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...commentForm }}
      validationSchema={formSchema}
      onSubmit={(vals, { resetForm }) => {
        onSave(vals, resetForm);
      }}
    >
      {({
        values,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
        handleBlur,
        isValid,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          <div className=" grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <MentionInputField
                label={
                  <span>
                    Comment<span style={{ color: "red" }}>*</span>
                  </span>
                }
                name="comment"
                value={values?.comment}
                setFieldValue={setFieldValue}
                onBlur={handleBlur}
                error={errors?.comment}
                touched={touched?.comment}
                placeholder=""
                rows={3}
                autoResize
                mentionData={(dashboard?.allEmployees || []).map((emp) => ({
                  id: emp?.value,
                  display: emp?.newLabel,
                }))}
                onChangeComplete={(data) => {
                  if (!values?.Id) {
                    setFieldValue("comment", data?.plainText);
                    const ids = (data?.mentions || [])
                      .map((m) => m?.id)
                      .filter(Boolean);
                    setFieldValue("mentionEmpId", ids);
                  } else {
                    setFieldValue("comment", data?.plainText);

                    // @ ki count nikalein
                    let lengthOfAt = data?.plainText?.split("@")?.length - 1;
                    let mentionEmpId = values.mentionEmpId;

                    // New mentions ke IDs nikalein
                    const newIds = (data?.mentions || [])
                      .map((m) => m?.id)
                      .filter(Boolean);

                    // Agar new mentions zyada hain previous se
                    if (lengthOfAt >= mentionEmpId?.length + newIds?.length) {
                      // Sirf new IDs add karein jo pehle se nahi hain
                      setFieldValue("mentionEmpId", [
                        ...mentionEmpId,
                        ...newIds,
                      ]);
                    }
                    // Agar @ ki count aur total mention IDs match nahi karte
                    else if (lengthOfAt < mentionEmpId.length + newIds.length) {
                      let mentionsList = dashboard?.allEmployees;
                      let updatedIds = mentionsList
                        ?.map((el) => {
                          if (data?.plainText?.includes(el?.newLabel)) {
                            return el?.value;
                          }
                        })
                        ?.filter(Boolean);
                      // Pehle check karein kaunse mentions remove hue hain
                      setFieldValue("mentionEmpId", [...updatedIds]);
                    }
                  }
                }}
              />
            </div>
            <div>
              <FileUpload
                label="Attachment:"
                id="file"
                name="file"
                accept="*/*"
                // Pass the ref correctly
                inputFile={inputFile}
                // Get filename from File object or existing filename string
                fileName={
                  values?.file instanceof File ? values.file.name : values?.file // existing filename string if editing
                }
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("file", file);
                }}
                error={errors}
                isEdit={false}
              />
              {/* Optional: Show error if needed */}
              {errors?.file && touched?.file && (
                <div className="invalid-feedback">{errors?.file}</div>
              )}
            </div>
            <div className="flex gap-2 items-end justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  // reset local form state and upstream context state
                  resetForm({ values: { ...initVal } });
                  setCommentForm({ ...initVal });
                  // Also clear the file input
                  if (inputFile.current) {
                    inputFile.current.value = "";
                  }
                }}
                className="btn btn-light"
              >
                Clear
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className="btn btn-primary"
              >
                {commentForm?.Id ? "Update" : "Save"}
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}
