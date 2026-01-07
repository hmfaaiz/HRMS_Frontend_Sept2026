// import React, { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { Input } from "../../../../../../_metronic/_partials/controls";
// import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";
// import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// const facilitatorValidation = Yup.object().shape({
//   ticketType: Yup.string().required(VALIDATION_MESSAGES.required),
//   departmentId: Yup.number().required(VALIDATION_MESSAGES.required),
//   employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
//   locationId: Yup.number().required(VALIDATION_MESSAGES.required),
// });

// export function FacilitatorEditForm({
//   saveFacilitator,
//   data,
//   actionsLoading,
//   onHide,
//   isUserForRead,
//   loading,
// }) {
//   const dispatch = useDispatch();
//   const { dashboard } = useSelector((state) => ({ dashboard: state.dashboard }), shallowEqual);

//   const [defchildLocationMenus, setDefaultChildLocationMenus] = useState(null);
//   const [employeesList, setEmployeesList] = useState([]);
//   const [locationsList, setLocationsList] = useState([]);

//   // Fetch departments on load (replace invalid actions)
//   useEffect(() => {
//     dispatch(dashboardActions.fetchAllDept());
//   }, [dispatch, data?.subsidiaryId]);
//   useEffect(() => {
//     dispatch(dashboardActions.fetchAllTicketTypes());
//   }, [dispatch, data?.subsidiaryId]);

//   // Handle department change
//   const handleDepartmentChange = (departmentId, setFieldValue) => {
//     setFieldValue("departmentId", departmentId);
//     setFieldValue("employeeId", "");
//     // dispatch(dashboardActions.getEmployeeHierarchy(departmentId)) // comment out
//     //   .then(res => setEmployeesList(res?.employeeList || []));
//     setEmployeesList([]); // fallback until function exists
//   };

//   // Set locations from dashboard
//   useEffect(() => {
//     if (dashboard?.AllGeoLocationFetchedList?.length) {
//       setLocationsList(dashboard.AllGeoLocationFetchedList);
//     }
//   }, [dashboard.AllGeoLocationFetchedList]);

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={data}
//       validationSchema={facilitatorValidation}
//       onSubmit={(values) => saveFacilitator(values)}
//     >
//       {({ handleSubmit, errors, touched, values, setFieldValue }) => (
//         <>
//           <Modal.Body className="overlay overlay-block cursor-default">
//             {actionsLoading && (
//               <div className="overlay-layer bg-transparent">
//                 <div className="spinner spinner-lg spinner-success" />
//               </div>
//             )}
//             <Form className="form form-label-right">
//               <fieldset disabled={isUserForRead}>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   <div>
//                     <Input
//                       name="ticketType"
//                       label="Ticket Type"
//                       value={values.ticketType || ""}
//                       onChange={(e) => setFieldValue("ticketType", e.target.value)}
//                       isDisabled={isUserForRead}
//                       error={errors.ticketType}
//                       touched={touched.ticketType}
//                     />
//                   </div>

//                   <div>
//                     <SearchSelect
//                       name="departmentId"
//                       label={<span>Department <span className="text-red-500">*</span></span>}
//                       isDisabled={isUserForRead}
//                       value={dashboard?.AllDepartmentBysSubIdsList?.find(
//                         (opt) => opt.value === values.departmentId
//                       ) || null}
//                       onChange={(e) => handleDepartmentChange(e.value, setFieldValue)}
//                       options={dashboard?.AllDepartmentBysSubIdsList || []}
//                       error={errors.departmentId}
//                       touched={touched.departmentId}
//                     />
//                   </div>

//                   <div>
//                     <SearchSelect
//                       name="employeeId"
//                       label={<span>Employee <span className="text-red-500">*</span></span>}
//                       isDisabled={isUserForRead || !values.departmentId}
//                       value={employeesList?.find((opt) => opt.value === values.employeeId) || null}
//                       onChange={(e) => setFieldValue("employeeId", e.value)}
//                       options={employeesList || []}
//                       error={errors.employeeId}
//                       touched={touched.employeeId}
//                     />
//                   </div>

//                   <div>
//                     <SearchSelect
//                       name="locationId"
//                       label={<span>Location <span className="text-red-500">*</span></span>}
//                       isDisabled={isUserForRead}
//                       onChange={(e) => setFieldValue("locationId", e.value)}
//                       value={defchildLocationMenus || null}
//                       options={locationsList || []}
//                       error={errors.locationId}
//                       touched={touched.locationId}
//                     />
//                   </div>
//                 </div>
//               </fieldset>
//             </Form>
//           </Modal.Body>

//           <Modal.Footer>
//             <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
//               {isUserForRead ? "OK" : "Cancel"}
//             </button>
//             {!isUserForRead && (
//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="btn btn-primary btn-elevate"
//               >
//                 Save {loading && <span className="ml-2 spinner spinner-white"></span>}
//               </button>
//             )}
//           </Modal.Footer>
//         </>
//       )}
//     </Formik>
//   );
// }

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CirclePlus, Trash2 } from "lucide-react";

// Validation schema
const facilitatorValidation = Yup.object().shape({
  ticketTypeId: Yup.number().required(VALIDATION_MESSAGES.required),
  employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
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
    dispatch(dashboardActions.fetchAllFormsMenu(545, "allTicketTypes"));
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

    if (dashboard?.allTicketTypes?.length) {
      setTicketTypes(
        dashboard.allTicketTypes.map((tt) => ({
          value: tt.id || tt.value,
          label: tt.name || tt.label,
        }))
      );
    }

    if (dashboard?.allEmployees?.length) {
      const mappedEmployees = dashboard.allEmployees.map((emp) => ({
        value: emp.id ?? emp.value,
        label: emp.name ?? emp.label ?? emp.employeeName,
        departmentId: emp.departmentId ?? emp.subsidiaryId,
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
    dashboard.allTicketTypes,
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
    employeeId: data.employeeId || null,
    departmentLocations: data.departmentLocations?.length
      ? data.departmentLocations.map((d) => ({
          departmentId: d.departmentId ?? null,
          locationId: d.locationId ?? null,
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

  // ------------------ FORM ------------------
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={facilitatorValidation}
      onSubmit={async (values) => {
        setIsSaving(true);

        try {
          // Collect all save operations
          const allSavePromises = [];

          // values.departmentLocations.forEach((row) => {
          //   const deptIds =
          //     row.departmentId === -1
          //       ? dashboard.allDept
          //           .filter((d) => d.value !== -1)
          //           .map((d) => d.value)
          //       : [row.departmentId];

          //   const locIds =
          //     row.locationId === -1
          //       ? dashboard.allLocationChildMenus.map((l) => l.value)
          //       : [row.locationId];

          //   deptIds.forEach((deptId) => {
          //     locIds.forEach((locId) => {
          //       allSavePromises.push(
          //         saveFacilitator({
          //           ticketTypeId: values.ticketTypeId,
          //           subsidiaryId: values.subsidiaryId,
          //           departmentId: deptId,
          //           locationId: locId,
          //           employeeId: values.employeeId,
          //         })
          //       );
          //     });
          //   });
          // });

          values.departmentLocations.forEach((row) => {
            const deptId = row.departmentId === -1 ? null : row.departmentId;
            const locId = row.locationId === -1 ? null : row.locationId;

            allSavePromises.push(
              saveFacilitator({
                ticketTypeId: values.ticketTypeId,
                subsidiaryId: values.subsidiaryId,
                departmentId: deptId, // null if All
                locationId: locId, // null if All
                employeeId: values.employeeId,
              })
            );
          });

          // Wait for all saves to complete
          await Promise.all(allSavePromises);

          // Only close modal after ALL saves are done
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    ticketTypes.find(
                      (opt) => opt.value === values.ticketTypeId
                    ) || null
                  }
                  options={ticketTypes || []}
                  isDisabled={isUserForRead}
                  onChange={(e) =>
                    setFieldValue("ticketTypeId", e?.value || null)
                  }
                  error={errors?.ticketTypeId}
                  touched={touched?.ticketTypeId}
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
                  options={employees || []}
                  isDisabled={isUserForRead}
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
                disabled={isUserForRead}
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
                            options={allDepartments || []}
                            isDisabled={isUserForRead}
                            onChange={(e) => {
                              const list = [...values.departmentLocations];
                              list[index].departmentId = e?.value || null;
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
                            options={locations}
                            isDisabled={isUserForRead}
                            onChange={(e) => {
                              const list = [...values.departmentLocations];
                              list[index].locationId = e?.value || null;
                              setFieldValue("departmentLocations", list);
                            }}
                            error={
                              errors.departmentLocations?.[index]?.locationId
                            }
                            touched={
                              touched.departmentLocations?.[index]?.locationId
                            }
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
