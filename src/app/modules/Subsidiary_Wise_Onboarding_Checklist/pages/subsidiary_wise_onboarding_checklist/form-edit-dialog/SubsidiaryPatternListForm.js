import { Field, FieldArray } from "formik";
import React, { useEffect, useRef } from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllDept } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getUploadUrl, getFileName } from "../../../../../utils/common";
import * as actions from "../../../_redux/redux-Actions";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";

function SubsidiaryPatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  isDataForRead,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state, shallowEqual);

  useEffect(() => {
    dispatch(fetchAllDept());
  }, [dispatch]);

  // Update S.No automatically
  useEffect(() => {
    values.list.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list, setFieldValue]);

  // Handle file selection (single or multiple files)
  const handleFileChange = (e, index) => {
    const files = Array.from(e.currentTarget.files); // Convert FileList to array
    setFieldValue(`list.${index}.attachment`, files[0]);
  };

  const fileRefs = useRef({});

  return (
    <FieldArray name="list">
      {({ push, remove }) => (
        <>
          <div className="flex justify-between items-center mb-2">
            <h6 className="font-bold text-primary">Onboarding Checklist</h6>
            <button
              type="button"
              disabled={!values.subsidiaryId || isDataForRead}
              className="btn btn-primary btn-elevate"
              onClick={() =>
                push({
                  departmentId: "",
                  taskName: "",
                  taskDescription: "",
                  attachmentPath: "",
                })
              }
            >
              <CirclePlus className="w-3 h-3 text-white stroke-3 mr-1" /> Add
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <td>S.No.</td>
                    <td>Department</td>
                    <td>Task Name</td>
                    <td>Task Description</td>
                    <td>Attachment</td>
                    <td className="text-right">Action</td>
                  </tr>
                </thead>
                <tbody>
                  {values.list.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Field
                          name={`list[${index}].sno`}
                          value={index + 1}
                          type="number"
                          className="form-control"
                          style={{ width: "30px" }}
                          disabled
                        />
                      </td>

                      <td style={{ width: "250px" }}>
                        <SearchSelect
                          name={`list[${index}].departmentId`}
                          options={dashboard?.allDept || []}
                          value={
                            dashboard?.allDept?.find(
                              (o) => o.value === row.departmentId,
                            ) || null
                          }
                          onChange={(selected) =>
                            setFieldValue(
                              `list[${index}].departmentId`,
                              selected ? selected.value : "",
                            )
                          }
                          disabled={isDataForRead}
                          placeholder="Select Department"
                          className={
                            errors.list?.[index]?.departmentId &&
                            touched.list?.[index]?.departmentId
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                        />
                        {errors.list?.[index]?.departmentId &&
                          touched.list?.[index]?.departmentId && (
                            <div className="text-danger">
                              {errors.list[index].departmentId}
                            </div>
                          )}
                      </td>

                      <td style={{ width: "250px" }}>
                        <Field
                          name={`list[${index}].taskName`}
                          placeholder="Enter task name"
                          className={
                            errors.list?.[index]?.taskName &&
                            touched.list?.[index]?.taskName
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          disabled={isDataForRead}
                        />
                        {errors.list?.[index]?.taskName &&
                          touched.list?.[index]?.taskName && (
                            <div className="text-danger">
                              {errors.list[index].taskName}
                            </div>
                          )}
                      </td>

                      <td style={{ width: "350px" }}>
                        <Field
                          as="textarea"
                          name={`list[${index}].taskDescription`}
                          placeholder="Enter task description"
                          className={
                            errors.list?.[index]?.taskDescription &&
                            touched.list?.[index]?.taskDescription
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          rows={2}
                          maxLength={200}
                          style={{ resize: "none" }}
                          disabled={isDataForRead}
                        />
                        {errors.list?.[index]?.taskDescription &&
                          touched.list?.[index]?.taskDescription && (
                            <div className="text-danger">
                              {errors.list[index].taskDescription}
                            </div>
                          )}
                      </td>

                      <td>
                        <div style={{ width: "100px" }}>
                          <FileUpload
                            label="Upload"
                            type="file"
                            multiple
                            disabled={isDataForRead}
                            onChange={(e) => handleFileChange(e, index)}
                          />
                        </div>
                        {/* Display uploaded files */}
                        {row.attachmentPath?.length > 0 && (
                          <ul className="list-none">
                            {row.attachmentPath.map((file, fIndex) => {
                              const name =
                                typeof file === "string"
                                  ? getFileName(file)
                                  : file.name;
                              const url =
                                typeof file === "string"
                                  ? getUploadUrl(file)
                                  : "#";
                              return (
                                <li key={fIndex}>
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {name}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </td>

                      <td className="text-right">
                        {!isDataForRead && (
                          <button
                            type="button"
                            className="border-none bg-transparent"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4 cursor-pointer" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </FieldArray>
  );
}

export default SubsidiaryPatternListForm;
