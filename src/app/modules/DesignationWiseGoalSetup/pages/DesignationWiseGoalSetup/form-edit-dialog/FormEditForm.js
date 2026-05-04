import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";


// const roster_patternEditSchema = Yup.object().shape({





//   designationId: Yup.string()
//     .required(VALIDATION_MESSAGES.required),

//   list: Yup.array()
//   .of(
//     Yup.object().shape({
//       goalName: Yup.string().trim()
//         .max(50, "Maximum 50 characters allowed")
//         .required(VALIDATION_MESSAGES.required),
//       goalDescription: Yup.string().trim()
//         .max(100, "Maximum 100 characters allowed")
//         .required(VALIDATION_MESSAGES.required),

//       weightage: Yup.number()
//         .nullable()
//         .required(VALIDATION_MESSAGES.required),

//       competencyId: Yup.number()
//         .nullable()
//         .required(VALIDATION_MESSAGES.required),

//       isManadatory: Yup.boolean(),


//       sno: Yup.number().required(VALIDATION_MESSAGES.required),
//     })
//   ),
// });
// const roster_patternEditSchema = Yup.object().shape({
//   designationId: Yup.string().required(VALIDATION_MESSAGES.required),

//   list: Yup.array()
//     .of(
//       Yup.object().shape({
//         goalName: Yup.string()
//           .trim()
//           .max(50, "Maximum 50 characters allowed")
//           .required(VALIDATION_MESSAGES.required),

//         goalDescription: Yup.string()
//           .trim()
//           .max(100, "Maximum 100 characters allowed")
//           .required(VALIDATION_MESSAGES.required),

//         weightage: Yup.number()
//           .typeError("Only numbers are allowed")
//           .transform((value, originalValue) => {
          
//             return originalValue === "" ? null : value;
//           })
//           .min(1, "Minimum is 1%")
//           .max(100, "Maximum is 100%")
//           .nullable()
//           .required(VALIDATION_MESSAGES.required),
//         competencyId: Yup.number()
//           .nullable()
//           .required(VALIDATION_MESSAGES.required),


//         isManadatory: Yup.boolean(),
//         isActive: Yup.boolean(),

//         sno: Yup.number().required(VALIDATION_MESSAGES.required),
//       })
//   .test(
//   "total-weightage",
//   "Total weightage must be exactly 100%",
//   function (list) {
//     if (!Array.isArray(list) || list.length === 0) return true;

//     const total = list.reduce(
//       (sum, item) => sum + (Number(item?.weightage) || 0),
//       0
//     );

//     return total === 100;
//   }
// )
//     )


// });

const roster_patternEditSchema = Yup.object().shape({
  designationId: Yup.string().required(VALIDATION_MESSAGES.required),

  list: Yup.array()
    .of(
      Yup.object().shape({
        goalName: Yup.string()
          .trim()
          .max(50, "Maximum 50 characters allowed")
          .required(VALIDATION_MESSAGES.required),

        goalDescription: Yup.string()
          .trim()
          .max(100, "Maximum 100 characters allowed")
          .required(VALIDATION_MESSAGES.required),

        weightage: Yup.number()
          .typeError("Only numbers are allowed")
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .min(1, "Minimum is 1%")
          .max(100, "Maximum is 100%")
          .nullable()
          .required(VALIDATION_MESSAGES.required),

        competencyId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),

        isManadatory: Yup.boolean(),
        isActive: Yup.boolean(),

        sno: Yup.number().required(VALIDATION_MESSAGES.required),
      })
    )
    .test(
      "weightage",
      "Total weightage must be exactly 100%",
      function (list) {
        if (!Array.isArray(list)) return false;

        const total = list.reduce(
          (sum, item) => sum + (Number(item?.weightage) || 0),
          0
        );

        return total === 100;
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

    dispatch(fetchAllFormsMenu(158, "allDesignations"));

  }, [dispatch, data.Id]);

  const { currentState } = useSelector(
    (state) => {
      return {
        currentState: state.designation_wise_goal_setup,

      }
    },
    shallowEqual
  );


  const { entities } = currentState;

  const filteredOptions = dashboard?.allDesignations?.filter(opt =>
    !entities?.some(ent => ent.Id === opt.value)
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...data,

      }}
      validationSchema={roster_patternEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
    {console.log("errors1111", errors)}
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="designationId"
                      label={
                        <span>
                          Designation<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data.dataIsExist}
                      onChange={(e) => {
                        setFieldValue("designationId", e.value || null);
                        setFieldValue("list", []);
                      }}
                      value={
                        dashboard?.allDesignations?.find(
                          (option) => option?.value == values?.designationId
                        ) || null
                      }
                      // options={dashboard?.allDesignations}
                      options={filteredOptions}

                      error={errors.designationId}
                      touched={touched.designationId}
                    />
                  </div>




                </div>
                <hr />
                <div>
                  <PatternListForm
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    // dropdownData={{
                    //   // allEmployeeShifts: dashboard?.allEmployeeShifts
                    //   allEmployeeShifts: dashboard?.allEmployeeShifts?.filter(
                    //     (shift) => shift.subsidiaryId === values.subsidiaryId
                    //   ),
                    // }}
                    isdataForRead={isdataForRead}
                  />
                </div>
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

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

            {!isdataForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={!values?.list?.length}
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
