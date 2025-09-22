import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CirclePlus, Trash2 } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

const validationSchema = Yup.object().shape({
  gradeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  designationList: Yup.array()
    .of(
      Yup.object().shape({
        designationId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
      })
    )
    .min(1, "Add at least one designation")
    .required("Designation list is required"),
});

export function FormEditForm({
  saveForm,
  user,
  onHide,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
  isNew,
}) {
  const dispatch = useDispatch();
  const [gradeId, setGradeId] = useState(null);

  const { dashboard, allDesignations, currentState } = useSelector((state) => {
    return {
      dashboard: state?.dashboard,
      allDesignations: state?.desig_map?.allDesignations,
      currentState: state.desig_map,
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
  }, [dispatch, user]);

  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

  const { userForEdit, entities } = currentState;

  useEffect(() => {
    if (user?.gradeId) {
      dispatch(actions.fetchDesignationsByGradeId(user?.gradeId));
    }
    dispatch(actions.fetchDesigMappings(formUIProps.queryParams));
  }, [user]);

  useEffect(() => {
    if (gradeId) {
      dispatch(actions.fetchDesignationsByGradeId(gradeId));
      dispatch(actions.fetchDesigMapping(gradeId));
    }
  }, [gradeId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={validationSchema}
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
              <fieldset disabled={isUserForRead || actionsLoading}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="gradeId"
                      label={
                        <span>
                          Grade<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || !isNew}
                      onChange={(e) => {
                        if (e?.value) {
                          setFieldValue("gradeId", e.value || null);
                          setGradeId(e?.value);
                        }
                      }}
                      value={
                        dashboard?.allEmployeegradeList?.find(
                          (option) => option.value === values?.gradeId
                        ) || null
                      }
                      options={dashboard?.allEmployeegradeList
                        ?.filter(
                          (el) =>
                            !entities?.some((e) => e?.gradeId === el?.value)
                        ) // exclude already used grades
                        .map((el) => ({
                          ...el,
                        }))}
                      error={errors.gradeId}
                      touched={touched.gradeId}
                    />
                  </div>
                </div>
                <hr />
                <FieldArray name="designationList">
                  {({ remove, push }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Designations
                        </h6>
                        <button
                          type="button"
                          className="btn btn-primary"
                          id="Other"
                          disabled={!values?.gradeId}
                          onClick={() =>
                            push({
                              designationId: null,
                            })
                          }
                        >
                          <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                          Add
                        </button>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <div className="react-bootstrap-table table-responsive">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                            <tr className="custom-table-header">
                              {/* <td>Employee</td> */}
                              <td>S.No</td>
                              <td>Designation</td>
                              <td className="text-right">Action</td>
                            </tr>
                            {values?.designationList?.length > 0 &&
                              values?.designationList?.map(
                                (obj, rightindex) => (
                                  <>
                                    <tr>
                                      <td>{rightindex + 1}</td>

                                      <td>
                                        <SearchSelect
                                          name={`designationList.[${rightindex}].designationId`}
                                          isDisabled={
                                            isUserForRead 
                                            // || isNew
                                            //   ? values.designationList?.[
                                            //       rightindex
                                            //     ]?.isDelete
                                            //   : !values.designationList?.[
                                            //       rightindex
                                            //     ]?.isDelete
                                          }
                                          onChange={(e) => {
                                            setFieldValue(
                                              `designationList.[${rightindex}].designationId`,
                                              e.value || null
                                            );
                                          }}
                                          value={
                                            allDesignations?.find(
                                              (option) =>
                                                option.value ===
                                                values.designationList?.[
                                                  rightindex
                                                ]?.designationId
                                            ) || null
                                          }
                                          options={allDesignations?.map(
                                            (el) => {
                                              return {
                                                ...el,
                                                isDisabled: values?.designationList.find(
                                                  (e) =>
                                                    e?.designationId ===
                                                    el?.value
                                                ),
                                              };
                                            }
                                          )}
                                          error={
                                            errors?.designationList?.[
                                              rightindex
                                            ]?.designationId
                                          }
                                          touched={
                                            touched?.designationList?.[
                                              rightindex
                                            ]?.designationId
                                          }
                                        />
                                      </td>

                                      <td className="text-right">
                                        {!isUserForRead &&
                                          // (values.designationList?.[rightindex]
                                          //   ?.isDelete 
                                          //    || isNew
                                          // )
                                          //  &&
                                            (
                                            <span
                                              id={rightindex}
                                              onClick={() => {
                                                remove(rightindex);
                                              }}
                                            >
                                              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                            </span>
                                          )}
                                      </td>
                                    </tr>
                                  </>
                                )
                              )}
                          </table>
                        </div>
                      </div>
                      {typeof errors?.designationList === "string" && (
                        <label className="invalid-feedback">
                          {errors?.designationList}
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
