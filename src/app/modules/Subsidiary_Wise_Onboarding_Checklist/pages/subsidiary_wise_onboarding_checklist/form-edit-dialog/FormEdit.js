// import React, { useEffect } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector, shallowEqual } from "react-redux";
// import { Modal } from "react-bootstrap";

// import { fetchAllSubsidiaryData, fetchAllDept } from "../../../../../../_metronic/redux/dashboardActions";
// import SubsidiaryPatternListForm from "./SubsidiaryPatternListForm";

// const checklistSchema = Yup.object().shape({
//   subsidiaryId: Yup.string().required("Subsidiary is required"),
//   list: Yup.array().of(
//     Yup.object().shape({
//       departmentId: Yup.string().required("Department is required"),
//       taskName: Yup.string().required("Task Name is required"),
//       taskDescription: Yup.string().required("Task Description is required"),
//       attachment: Yup.mixed(),
//     })
//   ).min(1, "At least one task is required"),
// });

// export function SubsidiaryOnboardingFormEditForm({ saveForm, data, onHide, isDataForRead, enableLoading, loading }) {
//   const dispatch = useDispatch();
//   const { dashboard } = useSelector(state => state, shallowEqual);

//   useEffect(() => {
//     dispatch(fetchAllSubsidiaryData("allSubsidiaries"));
//     dispatch(fetchAllDept());
//   }, [dispatch]);

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={{ ...data, list: data.list || [] }}
//       validationSchema={checklistSchema}
//       onSubmit={saveForm}
//     >
//       {({ handleSubmit, values, setFieldValue, errors, touched }) => (
//         <>
//           <Modal.Body className="overlay overlay-block cursor-default">
//             {loading && (
//               <div className="overlay-layer bg-transparent">
//                 <div className="spinner spinner-lg spinner-success" />
//               </div>
//             )}
//             <Form className="form form-label-right">
//               <fieldset disabled={isDataForRead}>
//                 <div className="grid grid-cols-3 gap-x-3 gap-y-1">
//                   <div>
//                     <label>Subsidiary <span className="text-danger">*</span></label>
//                     <select
//                       className="form-control"
//                       disabled={isDataForRead || data.dataIsExist}
//                       value={values.subsidiaryId || ""}
//                       onChange={(e) => {
//                         setFieldValue("subsidiaryId", e.target.value);
//                         setFieldValue("list", []); // reset tasks
//                       }}
//                     >
//                       <option value="">Select Subsidiary</option>
//                       {dashboard?.allSubsidiaries?.map(sub => (
//                         <option key={sub.value} value={sub.value}>{sub.label}</option>
//                       ))}
//                     </select>
//                     {errors.subsidiaryId && touched.subsidiaryId && (
//                       <div className="text-danger">{errors.subsidiaryId}</div>
//                     )}
//                   </div>
//                 </div>

//                 <hr />
//                 <SubsidiaryPatternListForm
//                   values={values}
//                   setFieldValue={setFieldValue}
//                   errors={errors}
//                   touched={touched}
//                   isDataForRead={isDataForRead}
//                 />
//               </fieldset>
//             </Form>
//           </Modal.Body>

//           <Modal.Footer>
//             {!isDataForRead ? (
//               <button
//                 type="button"
//                 onClick={onHide}
//                 className="btn btn-light btn-elevate"
//               >
//                 Cancel
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={onHide}
//                 className="btn btn-primary btn-elevate"
//               >
//                 OK
//               </button>
//             )}

//             {!isDataForRead && (
//               <button
//                 type="submit"
//                 onClick={() => handleSubmit()}
//                 className="btn btn-primary btn-elevate"
//                 disabled={!values.list?.length}
//               >
//                 Save
//                 {loading && (
//                   <span className="ml-3 mr-3 spinner spinner-white"></span>
//                 )}
//               </button>
//             )}
//           </Modal.Footer>
//         </>
//       )}
//     </Formik>
//   );
// }


import React, { useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Modal } from "react-bootstrap";

import { fetchAllSubsidiaryData, fetchAllDept } from "../../../../../../_metronic/redux/dashboardActions";
import SubsidiaryPatternListForm from "./SubsidiaryPatternListForm";

const checklistSchema = Yup.object().shape({
  subsidiaryId: Yup.string().required("Subsidiary is required"),
  list: Yup.array().of(
    Yup.object().shape({
      departmentId: Yup.string().required("Department is required"),
      taskName: Yup.string().required("Task Name is required"),
      taskDescription: Yup.string().required("Task Description is required"),
      attachment: Yup.mixed(),
    })
  ).min(1, "At least one task is required"),
});

export function SubsidiaryOnboardingFormEditForm({
  saveForm,
  data,
  onHide,
  isDataForRead,
  loading,
}) {
  const dispatch = useDispatch();

  const { dashboard, onboardingChecklist } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      onboardingChecklist: state.onboarding_checklist,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaries"));
    dispatch(fetchAllDept());
  }, [dispatch]);

  // Get already saved subsidiary IDs to disable them
  const usedSubsidiaryIds = useMemo(() => {
    if (!Array.isArray(onboardingChecklist.entities)) return [];
    return onboardingChecklist.entities.map((item) => String(item.subsidiaryId));
  }, [onboardingChecklist.entities]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...data, list: data.list || [] }}
      validationSchema={checklistSchema}
      onSubmit={saveForm}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {loading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isDataForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <label>Subsidiary <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      disabled={isDataForRead} // remove previous data.dataIsExist check
                      value={String(values.subsidiaryId || "")}
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.target.value);
                        setFieldValue("list", []); // reset tasks
                      }}
                    >
                      <option value="">Select Subsidiary</option>
                      {dashboard?.allSubsidiaries?.map((sub) => {
                        const subId = String(sub.value);
                        const selectedId = String(values.subsidiaryId || "");

                        // disable if already used in other records, but not current
                        const disableOption = usedSubsidiaryIds.includes(subId) && subId !== selectedId;

                        return (
                          <option key={subId} value={subId} disabled={disableOption}>
                            {sub.label}
                            {disableOption ? " " : ""}
                          </option>
                        );
                      })}
                    </select>
                    {errors.subsidiaryId && touched.subsidiaryId && (
                      <div className="text-danger">{errors.subsidiaryId}</div>
                    )}
                  </div>
                </div>

                <hr />
                <SubsidiaryPatternListForm
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  isDataForRead={isDataForRead}
                />
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {!isDataForRead ? (
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

            {!isDataForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={!values.list?.length}
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
