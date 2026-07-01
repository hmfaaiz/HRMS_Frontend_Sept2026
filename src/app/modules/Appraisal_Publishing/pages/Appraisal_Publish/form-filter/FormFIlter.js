// import React, { useEffect } from "react";
// import { Formik } from "formik";
// import { isEqual } from "lodash";
// import { useFormUIContext } from "../FormUIContext";
// import { initialFilter } from "../FormUIHelpers";
// import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
// import { fetchAllAppraisalPeriodDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";
// import { useDispatch, useSelector, shallowEqual } from "react-redux";
// import {
//   fetchAllActiveEmployees,
//   fetchAllDesignationByGradeId,
//   fetchAllFormsMenu,
//   fetchAllParentDept,
//   fetchAllSubsidiaryData,
// } from "../../../../../../_metronic/redux/dashboardActions";
// import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
// import * as Yup from "yup";
// import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
// import { Form } from "react-bootstrap";

// const formValidator = Yup.object().shape({
//   subsidiaryId: Yup.number()
//     .nullable()
//     .required(VALIDATION_MESSAGES.required),
//   yearId: Yup.number()
//     .nullable()
//     .required(VALIDATION_MESSAGES.required),
//   appraisalCategoryId: Yup.number()
//     .nullable()
//     .required(VALIDATION_MESSAGES.required),
//   departmentId: Yup.number()
//     .nullable()
//     .optional(),
//   gradeId: Yup.number()
//     .nullable()
//     .optional(),
//   designationId: Yup.number()
//     .nullable()
//     .optional(),
//   employeeId: Yup.number()
//     .nullable()
//     .optional(),
// });

// const Status = [
//   {
//     label: "All",
//     value: 1,
//   },
//   {
//     label: "Publish",
//     value: 2,
//   },
//   {
//     label: "Not Publish",
//     value: 3,
//   },
//   {
//     label: "Hold",
//     value: 4,
//   },
// ];

// export const FormFIlter = () => {
//   const dispatch = useDispatch();

//   const { dashboard, loading } = useSelector(
//     (state) => ({
//       dashboard: state?.dashboard,
//       loading: state?.appraisal_publish?.listLoading,
//     }),
//     shallowEqual,
//   );
//   const { queryParams, setQueryParams } = useFormUIContext();

//   const applyFilter = (values) => {
//     const newQueryParams = { ...queryParams, filter: values, pageNumber: 1 };
//     if (!isEqual(newQueryParams, queryParams)) {
//       setQueryParams(newQueryParams);
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
//     dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
//     dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
//     dispatch(fetchAllActiveEmployees());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!dashboard?.allSubsidiaryList?.length) {
//       return;
//     }
//     const findDefaultSubs = dashboard?.allSubsidiaryList?.find(
//       (el) => el?.isDefault,
//     );
//     if (!findDefaultSubs) {
//       return;
//     }
//     dispatch(fetchAllAppraisalPeriodDataBySubsidiaryId(findDefaultSubs.value));
//     dispatch(fetchAllParentDept(findDefaultSubs.value));
//   }, [dashboard?.allSubsidiaryList, dispatch]);

//   const defaultSubsidiaryId =
//     dashboard?.allSubsidiaryList?.find((el) => el?.isDefault)?.value || null;

//   const activeYearId =
//     dashboard?.appraisalPeriodBySubList?.find((e) => e?.isActive)?.value ||
//     null;

//   const defaultCategoryId = dashboard?.allAppraisalCategory?.[0]?.value || null;

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={{
//         // ...initialFilter?.filter,
//         // subsidiaryId:
//         //   dashboard?.allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
//         //   null,
//         // yearId:
//         //   dashboard?.appraisalPeriodBySubList?.find((e) => e?.isActive)
//         //     ?.value || null,
//         // appraisalCategoryId:
//         //   dashboard?.allAppraisalCategory?.[0]?.value || null,
//         ...initialFilter?.filter,
//         subsidiaryId: defaultSubsidiaryId,
//         yearId: activeYearId,
//         appraisalCategoryId: defaultCategoryId,
//       }}
//       onSubmit={applyFilter}
//       validationSchema={formValidator}
//     >
//       {({
//         values,
//         handleSubmit,
//         setFieldValue,
//         errors,
//         touched,
//         handleReset,
//       }) => (
//         <Form className="form form-label-right">
//           <fieldset>
//             <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1">
//               {/* subsidiary  */}
//               <div>
//                 <SearchSelect
//                   name="subsidiaryId"
//                   label={
//                     <span>
//                       Subsidiary<span style={{ color: "red" }}>*</span>
//                     </span>
//                   }
//                   onChange={(e) => {
//                     const subsidiaryId = e?.value || null;

//                     setFieldValue("subsidiaryId", subsidiaryId);
//                     setFieldValue("yearId", null);
//                     setFieldValue("departmentId", null);

//                     if (subsidiaryId) {
//                       dispatch(
//                         fetchAllAppraisalPeriodDataBySubsidiaryId(subsidiaryId),
//                       );
//                       dispatch(fetchAllParentDept(subsidiaryId));
//                     }
//                   }}
//                   error={errors?.subsidiaryId}
//                   touched={touched?.subsidiaryId}
//                   value={
//                     dashboard?.allSubsidiaryList?.find(
//                       (e) => e.value === values?.subsidiaryId,
//                     ) || null
//                   }
//                   options={dashboard?.allSubsidiaryList}
//                 />
//               </div>
//               {/* appraisal period  */}
//               <div>
//                 <SearchSelect
//                   name={"yearId"}
//                   label={
//                     <span>
//                       Appraisal Period<span style={{ color: "red" }}>*</span>
//                     </span>
//                   }
//                   isDisabled={!values?.subsidiaryId}
//                   onChange={(e) => {
//                     setFieldValue("yearId", e?.value || null);
//                   }}
//                   value={
//                     dashboard?.appraisalPeriodBySubList?.find(
//                       (el) => el?.value === values?.yearId,
//                     ) || null
//                   }
//                   error={errors?.yearId}
//                   touched={touched?.yearId}
//                   options={dashboard?.appraisalPeriodBySubList}
//                 />
//               </div>
//               {/* appraisal category  */}
//               <div>
//                 <SearchSelect
//                   name={"statusId"}
//                   label={
//                     <span>
//                       Appraisal Status<span style={{ color: "red" }}>*</span>
//                     </span>
//                   }
//                   isDisabled={!values?.subsidiaryId}
//                   onChange={(e) => {
//                     setFieldValue("statusId", e?.value || null);
//                   }}
//                   value={
//                     Status?.find((el) => el?.value === values?.statusId) || null
//                   }
//                   error={errors?.statusId}
//                   touched={touched?.statusId}
//                   options={Status}
//                 />
//               </div>
//               {/* appraisal status  */}
//               <div>
//                 <SearchSelect
//                   name={"appraisalCategoryId"}
//                   label={
//                     <span>
//                       Appraisal Category<span style={{ color: "red" }}>*</span>
//                     </span>
//                   }
//                   onChange={(e) => {
//                     setFieldValue("appraisalCategoryId", e?.value || null);
//                   }}
//                   value={
//                     dashboard?.allAppraisalCategory?.find(
//                       (el) => el?.value === values?.appraisalCategoryId,
//                     ) || null
//                   }
//                   error={errors?.appraisalCategoryId}
//                   touched={touched?.appraisalCategoryId}
//                   options={dashboard?.allAppraisalCategory}
//                 />
//               </div>
//               {/* department  */}
//               <div>
//                 <SearchSelect
//                   name={"departmentId"}
//                   label={<span>Department</span>}
//                   isDisabled={!values?.subsidiaryId}
//                   onChange={(e) => {
//                     setFieldValue("departmentId", e?.value || "");
//                   }}
//                   value={
//                     dashboard?.allParentDept?.find(
//                       (el) => el?.value === values?.departmentId,
//                     ) || { value: "", label: "All" }
//                   }
//                   error={errors?.departmentId}
//                   touched={touched?.departmentId}
//                   options={[
//                     { value: "", label: "All" },
//                     ...(Array.isArray(dashboard?.allParentDept)
//                       ? dashboard.allParentDept
//                       : []),
//                   ]}
//                 />
//               </div>
//               {/* grade  */}
//               <div>
//                 <SearchSelect
//                   name={"gradeId"}
//                   label={<span>Grade</span>}
//                   onChange={(e) => {
//                     setFieldValue("gradeId", e?.value || "");
//                     setFieldValue("designationId", "");
//                     dispatch(
//                       fetchAllDesignationByGradeId(
//                         e?.value,
//                         "allDesignationByGrade",
//                       ),
//                     );
//                   }}
//                   value={
//                     dashboard?.allEmployeegradeList?.find(
//                       (el) => el?.value === values?.gradeId,
//                     ) || { value: "", label: "All" }
//                   }
//                   error={errors?.gradeId}
//                   touched={touched?.gradeId}
//                   options={[
//                     { value: "", label: "All" },
//                     ...(Array.isArray(dashboard?.allEmployeegradeList)
//                       ? dashboard.allEmployeegradeList
//                       : []),
//                   ]}
//                 />
//               </div>
//               {/* designation  */}
//               <div>
//                 <SearchSelect
//                   name={"designationId"}
//                   label={<span>Designation</span>}
//                   isDisabled={!values?.gradeId}
//                   onChange={(e) => {
//                     setFieldValue("designationId", e?.value || "");
//                   }}
//                   value={
//                     dashboard?.allDesignationByGrade?.find(
//                       (el) => el?.value === values?.designationId,
//                     ) || { value: "", label: "All" }
//                   }
//                   error={errors?.designationId}
//                   touched={touched?.designationId}
//                   options={[
//                     { value: "", label: "All" },
//                     ...(Array.isArray(dashboard?.allDesignationByGrade)
//                       ? dashboard.allDesignationByGrade
//                       : []),
//                   ]}
//                 />
//               </div>
//               {/* employee  */}
//               <div>
//                 <SearchSelect
//                   name={"employeeId"}
//                   label={<span>Employee</span>}
//                   onChange={(e) => {
//                     setFieldValue("employeeId", e?.value || "");
//                   }}
//                   value={
//                     dashboard?.allEmployees?.find(
//                       (el) => el?.value === values?.employeeId,
//                     ) || { value: "", label: "All" }
//                   }
//                   error={errors?.employeeId}
//                   touched={touched?.employeeId}
//                   options={[
//                     { value: "", label: "All" },
//                     ...(Array.isArray(dashboard?.allEmployees)
//                       ? dashboard.allEmployees
//                       : []),
//                   ]}
//                 />
//               </div>
//             </div>
//           </fieldset>
//           <div className="flex gap-2 justify-end mt-2">
//             <button
//               type="button"
//               // disabled={levelList?.length < 2}
//               onClick={() => {
//                 applyFilter(initialFilter.filter);
//                 handleReset();
//               }}
//               className="btn btn-light"
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={() => handleSubmit()}
//               disabled={
//                 loading
//                 // || levelList?.length < 2
//               }
//               className="btn btn-success"
//             >
//               Filter
//               {loading && (
//                 <span className="ml-3 mr-3 spinner spinner-white"></span>
//               )}
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

import React, { useEffect, useRef } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { initialFilter } from "../FormUIHelpers";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllAppraisalPeriodDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllDesignationByGradeId,
  fetchAllFormsMenu,
  fetchAllParentDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Form } from "react-bootstrap";

const formValidator = Yup.object().shape({
  subsidiaryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  yearId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  appraisalCategoryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  departmentId: Yup.number()
    .nullable()
    .optional(),
  gradeId: Yup.number()
    .nullable()
    .optional(),
  designationId: Yup.number()
    .nullable()
    .optional(),
  employeeId: Yup.number()
    .nullable()
    .optional(),
});

const Status = [
  {
    label: "All",
    value: 1,
  },
  {
    label: "Publish",
    value: 2,
  },
  {
    label: "Not Publish",
    value: 3,
  },
  {
    label: "Hold",
    value: 4,
  },
];

export const FormFIlter = () => {
  const dispatch = useDispatch();
  const formikRef = useRef(null);

  const { dashboard, loading } = useSelector(
    (state) => ({
      dashboard: state?.dashboard,
      loading: state?.appraisal_publish?.listLoading,
    }),
    shallowEqual
  );
  const { queryParams, setQueryParams } = useFormUIContext();

  const applyFilter = (values) => {
    const newQueryParams = { ...queryParams, filter: values, pageNumber: 1 };
    if (!isEqual(newQueryParams, queryParams)) {
      setQueryParams(newQueryParams);
    }
  };

  // Initial dropdown data
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  // Set default subsidiary ONLY ONCE (jab tak user khud koi subsidiary select na kar chuka ho)
  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;
    if (formikRef.current?.values?.subsidiaryId) return; // already set/selected by user

    const findDefaultSubs = dashboard.allSubsidiaryList.find(
      (el) => el?.isDefault
    );
    if (!findDefaultSubs) return;

    formikRef.current?.setFieldValue("subsidiaryId", findDefaultSubs.value);
    dispatch(fetchAllAppraisalPeriodDataBySubsidiaryId(findDefaultSubs.value));
    dispatch(fetchAllParentDept(findDefaultSubs.value));
  }, [dashboard?.allSubsidiaryList, dispatch]);

  // Set default yearId ONLY ONCE
  useEffect(() => {
    if (!formikRef.current) return;
    if (formikRef.current.values?.yearId) return; // already set/selected

    const activeYear = dashboard?.appraisalPeriodBySubList?.find(
      (e) => e?.isActive
    );
    if (activeYear) {
      formikRef.current.setFieldValue("yearId", activeYear.value);
    }
  }, [dashboard?.appraisalPeriodBySubList]);

  // Set default appraisalCategoryId ONLY ONCE
  useEffect(() => {
    if (!formikRef.current) return;
    if (formikRef.current.values?.appraisalCategoryId) return; // already set/selected

    const firstCategory = dashboard?.allAppraisalCategory?.[0];
    if (firstCategory) {
      formikRef.current.setFieldValue(
        "appraisalCategoryId",
        firstCategory.value
      );
    }
  }, [dashboard?.allAppraisalCategory]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        ...initialFilter?.filter,
        subsidiaryId: null,
        yearId: null,
        appraisalCategoryId: null,
      }}
      onSubmit={applyFilter}
      validationSchema={formValidator}
    >
      {({
        values,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
        handleReset,
      }) => (
        <Form className="form form-label-right">
          <fieldset>
            <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1">
              {/* subsidiary  */}
              <div>
                <SearchSelect
                  name="subsidiaryId"
                  label={
                    <span>
                      Subsidiary<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  onChange={(e) => {
                    setFieldValue("subsidiaryId", e.value || null);
                    dispatch(
                      fetchAllAppraisalPeriodDataBySubsidiaryId(e.value)
                    );
                    dispatch(fetchAllParentDept(e.value));
                    setFieldValue("yearId", "");
                    setFieldValue("departmentId", "");
                  }}
                  error={errors?.subsidiaryId}
                  touched={touched?.subsidiaryId}
                  value={
                    dashboard?.allSubsidiaryList?.find(
                      (e) => e.value === values?.subsidiaryId
                    ) || null
                  }
                  options={dashboard?.allSubsidiaryList}
                />
              </div>
              {/* appraisal period  */}
              <div>
                <SearchSelect
                  name={"yearId"}
                  label={
                    <span>
                      Appraisal Period<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  isDisabled={!values?.subsidiaryId}
                  onChange={(e) => {
                    setFieldValue("yearId", e?.value || null);
                  }}
                  value={
                    dashboard?.appraisalPeriodBySubList?.find(
                      (el) => el?.value === values?.yearId
                    ) || null
                  }
                  error={errors?.yearId}
                  touched={touched?.yearId}
                  options={dashboard?.appraisalPeriodBySubList}
                />
              </div>
              {/* appraisal category  */}
              <div>
                <SearchSelect
                  name={"statusId"}
                  label={
                    <span>
                      Appraisal Status<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  isDisabled={!values?.subsidiaryId}
                  onChange={(e) => {
                    setFieldValue("statusId", e?.value || null);
                  }}
                  value={
                    Status?.find((el) => el?.value === values?.statusId) ||
                    null
                  }
                  error={errors?.statusId}
                  touched={touched?.statusId}
                  options={Status}
                />
              </div>
              {/* appraisal status  */}
              <div>
                <SearchSelect
                  name={"appraisalCategoryId"}
                  label={
                    <span>
                      Appraisal Category<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  onChange={(e) => {
                    setFieldValue("appraisalCategoryId", e?.value || null);
                  }}
                  value={
                    dashboard?.allAppraisalCategory?.find(
                      (el) => el?.value === values?.appraisalCategoryId
                    ) || null
                  }
                  error={errors?.appraisalCategoryId}
                  touched={touched?.appraisalCategoryId}
                  options={dashboard?.allAppraisalCategory}
                />
              </div>
              {/* department  */}
              <div>
                <SearchSelect
                  name={"departmentId"}
                  label={<span>Department</span>}
                  isDisabled={!values?.subsidiaryId}
                  onChange={(e) => {
                    setFieldValue("departmentId", e?.value || "");
                  }}
                  value={
                    dashboard?.allParentDept?.find(
                      (el) => el?.value === values?.departmentId
                    ) || { value: "", label: "All" }
                  }
                  error={errors?.departmentId}
                  touched={touched?.departmentId}
                  options={[
                    { value: "", label: "All" },
                    ...(Array.isArray(dashboard?.allParentDept)
                      ? dashboard.allParentDept
                      : []),
                  ]}
                />
              </div>
              {/* grade  */}
              <div>
                <SearchSelect
                  name={"gradeId"}
                  label={<span>Grade</span>}
                  onChange={(e) => {
                    setFieldValue("gradeId", e?.value || "");
                    setFieldValue("designationId", "");
                    dispatch(
                      fetchAllDesignationByGradeId(
                        e?.value,
                        "allDesignationByGrade"
                      )
                    );
                  }}
                  value={
                    dashboard?.allEmployeegradeList?.find(
                      (el) => el?.value === values?.gradeId
                    ) || { value: "", label: "All" }
                  }
                  error={errors?.gradeId}
                  touched={touched?.gradeId}
                  options={[
                    { value: "", label: "All" },
                    ...(Array.isArray(dashboard?.allEmployeegradeList)
                      ? dashboard.allEmployeegradeList
                      : []),
                  ]}
                />
              </div>
              {/* designation  */}
              <div>
                <SearchSelect
                  name={"designationId"}
                  label={<span>Designation</span>}
                  isDisabled={!values?.gradeId}
                  onChange={(e) => {
                    setFieldValue("designationId", e?.value || "");
                  }}
                  value={
                    dashboard?.allDesignationByGrade?.find(
                      (el) => el?.value === values?.designationId
                    ) || { value: "", label: "All" }
                  }
                  error={errors?.designationId}
                  touched={touched?.designationId}
                  options={[
                    { value: "", label: "All" },
                    ...(Array.isArray(dashboard?.allDesignationByGrade)
                      ? dashboard.allDesignationByGrade
                      : []),
                  ]}
                />
              </div>
              {/* employee  */}
              <div>
                <SearchSelect
                  name={"employeeId"}
                  label={<span>Employee</span>}
                  onChange={(e) => {
                    setFieldValue("employeeId", e?.value || "");
                  }}
                  value={
                    dashboard?.allEmployees?.find(
                      (el) => el?.value === values?.employeeId
                    ) || { value: "", label: "All" }
                  }
                  error={errors?.employeeId}
                  touched={touched?.employeeId}
                  options={[
                    { value: "", label: "All" },
                    ...(Array.isArray(dashboard?.allEmployees)
                      ? dashboard.allEmployees
                      : []),
                  ]}
                />
              </div>
            </div>
          </fieldset>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => {
                applyFilter(initialFilter.filter);
                handleReset();
              }}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="btn btn-success"
            >
              Filter
              {loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};