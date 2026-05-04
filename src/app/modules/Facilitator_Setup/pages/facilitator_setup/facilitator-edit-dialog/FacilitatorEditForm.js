import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CirclePlus, Trash2 } from "lucide-react";

import { FetchAllFacilitatorTicketType } from "../../../../Dashboard/_redux/dashboardActions";

// Validation schema
const facilitatorValidation = Yup.object().shape({
  ticketTypeId: Yup.mixed().required(VALIDATION_MESSAGES.required),
  employeeId: Yup.mixed().required(VALIDATION_MESSAGES.required),
  departmentLocations: Yup.array()
    .of(
      Yup.object().shape({
        departmentId: Yup.number().required(VALIDATION_MESSAGES.required),
        locationId: Yup.number().required(VALIDATION_MESSAGES.required),
      })
    )

    .min(1, "At least one department and location is required"),
});

export function FacilitatorEditForm({
  saveFacilitator,
  data = {},
  onHide,
  isUserForRead = false,
  loading = false,
}) {
  const dispatch = useDispatch();
  const { dashboard, user } = useSelector(
    (state) => ({ dashboard: state.dashboard, user: state.auth.user }),
    shallowEqual
  );

  const [defEmp, setDefEmp] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // ------------------ FETCH ALL DATA ------------------
  useEffect(() => {
    dispatch(dashboardActions.fetchAllSubsidiaryData("allSubsidiaryData"));
    dispatch(dashboardActions.fetchAllDept());
    dispatch(dashboardActions.fetchAllActiveEmployees("allEmployees"));
    dispatch(FetchAllFacilitatorTicketType());
    dispatch(dashboardActions.fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, [dispatch]);

  // ------------------ MAP DATA FOR DROPDOWNS ------------------
  useEffect(() => {
    if (dashboard?.allLocationChildMenus?.length) {
      setLocations([
        { id: -1, value: -1, label: "All" },
        ...dashboard.allLocationChildMenus.map((loc) => ({
          id: loc.id ?? loc.value,
          value: loc.value || loc.id,
          label: loc.label || loc.name,
        })),
      ]);
    }

    if (dashboard?.allFacilitatorTicketType?.length) {
      setTicketTypes(
        dashboard.allFacilitatorTicketType.map((tt) => ({
          value: tt.id || tt.value,
          label: tt.name || tt.label,
        }))
      );
    }

    if (dashboard?.allEmployees?.length) {
      const mappedEmployees = dashboard.allEmployees.map((emp) => ({
        value: emp.id ?? emp.value,
        label: emp.name ?? emp.label ?? emp.employeeName,
        departmentId: emp.departmentId,
      }));

      setAllEmployees(mappedEmployees);
      setEmployees(mappedEmployees);

      // Set default employee for edit mode or from user
      const empId = data.employeeId || user?.employeeId;
      const selectedEmp =
        mappedEmployees.find((e) => e.value === empId) || null;
      setDefEmp(selectedEmp);
    }

    if (dashboard?.allDept?.length) {
      const mappedDepts = [
        { id: -1, value: -1, label: "All" },
        ...dashboard.allDept.map((d) => ({
          id: d.id ?? d.value,
          value: d.value ?? d.id,
          label: d.label ?? d.name,
        })),
      ];
      setAllDepartments(mappedDepts);
    }
  }, [
    dashboard.allSubsidiaryData,
    dashboard.allLocationChildMenus,
    dashboard.allFacilitatorTicketType,
    dashboard.allEmployees,
    dashboard.allDept,
    data.employeeId,
    user?.employeeId,
  ]);

  // ------------------ HANDLERS ------------------
  const handleEmployeeChange = (employeeOption, setFieldValue) => {
    setDefEmp(employeeOption);
    setFieldValue("employeeId", employeeOption?.value || null);
  };

  // ------------------ INITIAL VALUES ------------------
  const initialValues = {
    ticketTypeId: data.ticketTypeId || null,
    subsidiaryId: data.subsidiaryId || user?.subsidiaryId || null,
    selectedDepartmentId: null, // only for filtering employees
    employeeId: data.employeeId || null,
    departmentLocations: data.departmentLocations?.length
      ? data.departmentLocations.map((d) => ({
          departmentId: d.departmentId ?? -1,
          locationId: d.locationId ?? -1,
        }))
      : [{ departmentId: null, locationId: null }],
  };

  // ------------------ ADD ROW ------------------
  const addRowInfo = (values, setFieldValue) => {
    setFieldValue("departmentLocations", [
      ...values.departmentLocations,
      { departmentId: null, locationId: null },
    ]);
  };

  // ------------------ REMOVE ROW ------------------
  const removeRow = (index, values, setFieldValue) => {
    if (values.departmentLocations.length > 1) {
      const list = [...values.departmentLocations];
      list.splice(index, 1);
      setFieldValue("departmentLocations", list);
    }
  };



  const isDepartmentUsedWithAllLocation = (
    departmentId,
    departmentLocations,
    currentIndex
  ) => {
    return departmentLocations.some(
      (row, rowIndex) =>
        rowIndex !== currentIndex &&
        row.departmentId === departmentId &&
        row.locationId === -1
    );
  };

 

  const hasAllDepartmentWithSpecificLocation = (departmentLocations = []) => {
    return departmentLocations.some(
      (row) =>
        row.departmentId === -1 &&
        row.locationId !== null &&
        row.locationId !== -1
    );
  };
  


  // ------------------ FORM ------------------
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={facilitatorValidation}
      onSubmit={async (values) => {
        if (isSaving) return;
        setIsSaving(true);

        try {
          const payload = [];

          values.departmentLocations.forEach((row) => {
            const selectedDepartments =
              row.departmentId === -1
                ? [null] // All departments
                : [row.departmentId];

            const selectedLocations =
              row.locationId === -1
                ? [null] // All locations
                : [row.locationId];

            selectedDepartments.forEach((deptId) => {
              selectedLocations.forEach((locId) => {
                payload.push({
                  departmentId: deptId,
                  locationId: locId,
                });
              });
            });
          });

          await saveFacilitator({
            ticketTypeId: values.ticketTypeId,
            subsidiaryId: values.subsidiaryId,
            employeeId: values.employeeId,
            departmentLocations: payload,
          });

          onHide();
        } catch (error) {
          console.error("Save error:", error);
        } finally {
          setIsSaving(false);
        }
      }}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <Form className="form form-label-right">
          <fieldset disabled={isUserForRead}>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {/* Subsidiary */}
              <div>
                <SearchSelect
                  name="subsidiaryId"
                  label={
                    <span>
                      Subsidiary <span className="text-red-500">*</span>
                    </span>
                  }
                  value={
                    dashboard?.allSubsidiaryData?.find(
                      (s) => s.value === values.subsidiaryId
                    ) || null
                  }
                  options={
                    dashboard?.allSubsidiaryData?.map((s) => ({
                      value: s.id || s.value,
                      label: s.name || s.label,
                    })) || []
                  }
                  isDisabled={isUserForRead}
                  onChange={(e) => {
                    setFieldValue("subsidiaryId", e?.value || null);
                    dispatch(
                      dashboardActions.fetchAllActiveEmployeesBySubsidiary(
                        e?.value
                      )
                    );
                  }}
                  error={errors.subsidiaryId}
                  touched={touched.subsidiaryId}
                />
              </div>

              {/* Ticket Type */}
              <div>
                <SearchSelect
                  name="ticketTypeId"
                  label={
                    <span>
                      Ticket Type <span className="text-red-500">*</span>
                    </span>
                  }
                  value={
                    dashboard.allFacilitatorTicketType.find(
                      (opt) => opt.value === values.ticketTypeId
                    ) || null
                  }
                  options={dashboard.allFacilitatorTicketType || []}
                  isDisabled={isUserForRead}
                  onChange={(e) =>
                    setFieldValue("ticketTypeId", e?.value || null)
                  }
                  error={errors?.ticketTypeId}
                  touched={touched?.ticketTypeId}
                />
              </div>
              <div>
                <SearchSelect
                  label={
                    <span>
                      Department <span className="text-red-500">*</span>
                    </span>
                  }
                  value={
                    allDepartments.find(
                      (d) => d.value === values?.departmentId
                    ) || null
                  }
                  options={allDepartments.filter((d) => d.value !== -1)}
                  isDisabled={isUserForRead || !values?.ticketTypeId}
                  onChange={(e) => {
                    setFieldValue("departmentId", e?.value);
                  }}
                  error={errors.departmentId}
                  touched={touched.departmentId}
                />
              </div>

              {/* Employee */}
              <div>
                <SearchSelect
                  name="employeeId"
                  label={
                    <span>
                      Employee <span className="text-red-500">*</span>
                    </span>
                  }
                  value={defEmp || null}
                  options={
                    dashboard?.allEmployees?.filter(
                      (el) => el?.departmentId === values?.departmentId
                    ) || []
                  }
                  isDisabled={
                    isUserForRead ||
                    !values?.departmentId ||
                    !values?.ticketTypeId ||
                    !values?.subsidiaryId
                  }
                  onChange={(e) => handleEmployeeChange(e, setFieldValue)}
                  error={errors?.employeeId}
                  touched={touched?.employeeId}
                />
              </div>
            </div>
          </fieldset>

          {/* ------------------ Department & Location Table ------------------ */}
          <div className="w-full overflow-x-auto mt-8">
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-bold mb-0 text-primary">
                Add Department and Location
              </h6>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addRowInfo(values, setFieldValue)}
                disabled={
                  isUserForRead ||
                  !values?.employeeId ||
                  !values?.ticketTypeId ||
                  values.departmentLocations.some(
                    (row) => row.departmentId === -1 && row.locationId === -1
                  )
                }
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </div>

            {typeof errors.departmentLocations === "string" &&
              touched.departmentLocations && (
                <div className="alert alert-danger mb-3" role="alert">
                  {errors.departmentLocations}
                </div>
              )}

            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th className="min-w-40">
                        Department <span className="text-red-500">*</span>
                      </th>
                      <th className="min-w-40">
                        Location <span className="text-red-500">*</span>
                      </th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.departmentLocations.map((obj, index) => (
                      <tr key={index}>
                        <td>
                          <SearchSelect
                            value={
                              allDepartments.find(
                                (d) => d.value === obj.departmentId
                              ) || null
                            }
                            options={allDepartments.map((dept) => {
                              const disableAllDept =
                                dept.value === -1 &&
                                values.departmentLocations.some(
                                  (row, rowIndex) =>
                                    rowIndex !== index &&
                                    row.departmentId !== null &&
                                    row.departmentId !== -1
                                );

                              const disableSameDeptWhenAllLocationUsed =
                                dept.value !== -1 &&
                                isDepartmentUsedWithAllLocation(
                                  dept.value,
                                  values.departmentLocations,
                                  index
                                );

                              return {
                                ...dept,
                                isDisabled:
                                  disableAllDept ||
                                  disableSameDeptWhenAllLocationUsed,
                              };
                            })}
                            isDisabled={
                              isUserForRead ||
                              !values?.employeeId ||
                              !values?.ticketTypeId
                            }
                            onChange={(e) => {
                              const list = [...values.departmentLocations];
                              list[index].departmentId = e?.value || null;

                              // Reset location when department changes
                              list[index].locationId = null;

                              setFieldValue("departmentLocations", list);
                            }}
                            error={
                              errors.departmentLocations?.[index]?.departmentId
                            }
                            touched={
                              touched.departmentLocations?.[index]?.departmentId
                            }
                          />
                        </td>

                        <td>
                          <SearchSelect
                            value={
                              locations.find(
                                (l) => l.value === obj.locationId
                              ) || null
                            }
                            options={locations.map((loc) => {
                              const isUsedInSameDept = values.departmentLocations.some(
                                  (row, rowIndex) =>
                                    rowIndex !== index &&
                                    row.departmentId === obj.departmentId &&
                                    row.locationId === loc.value
                                );


                              const isUsedInAllDept = values.departmentLocations.some(
                                  (row, rowIndex) =>
                                    rowIndex !== index &&
                                    row.departmentId === -1 &&
                                    row.locationId === loc.value
                                );


                              const disableAllLocationBecauseAllDeptSelected =
                                loc.value === -1 &&
                                obj.departmentId !== -1 &&
                                hasAllDepartmentWithSpecificLocation(
                                  values.departmentLocations
                                );

                              return {
                                ...loc,
                                isDisabled:
                                  isUsedInSameDept ||
                                  isUsedInAllDept ||
                                  disableAllLocationBecauseAllDeptSelected,
                              };
                            })}
                            isDisabled={
                              isUserForRead ||
                              !values?.employeeId ||
                              !values?.ticketTypeId
                            }
                            onChange={(e) => {
                              const list = [...values.departmentLocations];
                              list[index].locationId = e?.value || null;
                              setFieldValue("departmentLocations", list);
                            }}
                          />
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() =>
                              removeRow(index, values, setFieldValue)
                            }
                            className="border-none bg-transparent"
                            disabled={
                              isUserForRead ||
                              values.departmentLocations.length === 1
                            }
                            title={
                              values.departmentLocations.length === 1
                                ? "At least one row is required"
                                : "Remove row"
                            }
                          >
                            <Trash2
                              className={`w-4 h-4 ${
                                values.departmentLocations.length === 1
                                  ? "text-black"
                                  : "text-black"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ------------------ Buttons ------------------ */}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className={isUserForRead ? "btn btn-primary" : "btn btn-light"}
              onClick={onHide}
              disabled={isSaving}
            >
              {isUserForRead ? "OK" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading || isSaving}
              >
                Save{" "}
                {(loading || isSaving) && (
                  <span className="spinner spinner-white ml-2"></span>
                )}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
