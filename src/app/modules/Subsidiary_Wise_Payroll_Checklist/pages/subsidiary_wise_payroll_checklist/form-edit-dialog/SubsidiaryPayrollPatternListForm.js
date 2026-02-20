import { Field, FieldArray } from "formik";
import React, { useEffect } from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getUploadUrl, getFileName } from "../../../../../utils/common";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";

function SubsidiaryPayrollPatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  isDataForRead,
}) {
  const dispatch = useDispatch();

  const { categoryOptions } = useSelector(
    (state) => ({
      categoryOptions: state.dashboard?.formsMenu || [],
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchAllFormsMenu(550, "formsMenu"));
  }, [dispatch]);

  // Update S.No automatically
  useEffect(() => {
    values.list?.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list?.length]); 

  const handleFileChange = (e, index) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setFieldValue(`list[${index}].attachment`, file);
    setFieldValue(`list[${index}].attachmentPath`, [file]);
  };

  return (
    <FieldArray name="list">
      {({ push, remove }) => (
        <>
          <div className="flex justify-between items-center mb-2">
            <h6 className="font-bold text-primary">Payroll Checklist</h6>
            <button
              type="button"
              disabled={!values.subsidiaryId || isDataForRead}
              className="btn btn-primary btn-elevate"
              onClick={() =>
                push({
                  categoryId: "",
                  taskName: "",
                  taskDescription: "",
                  attachmentPath: [],
                  attachment: null,
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
                    <td>Payroll Checklist Category</td>
                    <td>Task Name</td>
                    <td>Task Description</td>
                    <td>Attachment</td>
                    <td className="text-right">Action</td>
                  </tr>
                </thead>
                <tbody>
                  {values.list?.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: "50px" }}
                          value={index + 1}
                          disabled
                          readOnly
                        />
                      </td>

                      <td style={{ width: "250px" }}>
                        <SearchSelect
                          name={`list[${index}].categoryId`}
                          options={categoryOptions} 
                          value={
                            categoryOptions?.find(
                              (o) =>
                                String(o.value) === String(row.categoryId)
                            ) || null
                          }
                          onChange={(selected) =>
                            setFieldValue(
                              `list[${index}].categoryId`,
                              selected ? selected.value : ""
                            )
                          }
                          isDisabled={isDataForRead}
                          placeholder="Select Category"
                        />
                        {errors.list?.[index]?.categoryId &&
                          touched.list?.[index]?.categoryId && (
                            <div className="text-danger">
                              {errors.list[index].categoryId}
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
                            id={`file_input_${index}`}
                            name={`list[${index}].attachment`}
                            label="Upload"
                            type="file"
                            disabled={isDataForRead}
                            onChange={(e) => handleFileChange(e, index)}
                          />
                        </div>
                        {row.attachmentPath && row.attachmentPath.length > 0 && (
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

                  {(!values.list || values.list.length === 0) && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-400 py-4">
                        No tasks added. Click "Add" to add a task.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </FieldArray>
  );
}

export default SubsidiaryPayrollPatternListForm;