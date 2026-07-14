import React, { useEffect } from "react";
import { Field, FieldArray } from "formik";
import { CirclePlus, Trash2 } from "lucide-react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

function PatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  isdataForRead,
  isEditMode,
}) {

  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    values?.list?.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
  }, [values?.list, setFieldValue]);



  return (
    <FieldArray name="list">
      {({ remove, push }) => (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="font-bold mb-0 text-primary">Asset List</h6>

            {!isdataForRead && (
              <button
                disabled={!values?.asset_makeId}
                type="button"
                className="btn btn-primary btn-elevate"
                onClick={() =>
                  push({
                    code: "",
                    name: "",
                    description: "",
                    sno: "",
                    asset_categoryId: "",
                  })
                }
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <td style={{ width: "50px" }}>S.No.</td>

                    {isdataForRead && <td style={{ width: "80px" }}>Code</td>}
                    <td style={{ width: "200px" }}>Category</td>
                    <td style={{ width: "200px" }}>Name</td>

                    <td style={{ width: "320px" }}>Description</td>

                    {!isdataForRead && (
                      <td className="text-right" style={{ width: "90px" }}>
                        Action
                      </td>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {values?.list?.map((row, index) => (
                    <tr key={index}>
                      {/* S.No */}
                      <td>
                        <Field
                          name={`list[${index}].sno`}
                          value={index + 1}
                          className="form-control"
                          disabled
                        />

                        {errors?.list?.[index]?.sno &&
                          touched?.list?.[index]?.sno && (
                            <div className="text-danger">
                              {errors.list[index].sno}
                            </div>
                          )}
                      </td>
                      {/* Code */}
                      {isdataForRead && (
                        <td>
                          <Field
                            name={`list[${index}].code`}
                            className="form-control"
                            value={row?.code || ""}
                            disabled
                          />
                        </td>
                      )}

                      <td>

                        <SearchSelect
                          name={`list[${index}].asset_categoryId`}
                          className={
                            errors?.list?.[index]?.asset_categoryId &&
                              touched?.list?.[index]?.asset_categoryId
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          disabled={isdataForRead}
                          value={dashboard?.allAssetCategoryList?.find(
                            (x) =>
                              Number(x.value) ===
                              Number(values?.list?.[index]?.asset_categoryId)
                          )}
                          onChange={(e) => {
                            setFieldValue(
                              `list[${index}].asset_categoryId`,
                              e?.value || null
                            );
                          }}
                          options={dashboard?.allAssetCategoryList}
                          autoComplete="off"
                        />
                        {errors?.list?.[index]?.asset_categoryId &&
                          touched?.list?.[index]?.asset_categoryId && (
                            <div className="invalid-feedback">
                              {errors.list[index].asset_categoryId}
                            </div>
                          )}







                      </td>



                      {/* Name */}
                      <td>
                        <Field
                          name={`list[${index}].name`}
                          className={
                            errors?.list?.[index]?.name &&
                              touched?.list?.[index]?.name
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          disabled={isdataForRead}
                          value={row?.name || ""}
                          onChange={(e) =>
                            setFieldValue(
                              `list[${index}].name`,
                              e.target.value
                            )
                          }
                        />

                        {errors?.list?.[index]?.name &&
                          touched?.list?.[index]?.name && (
                            <div className="invalid-feedback">
                              {errors.list[index].name}
                            </div>
                          )}
                      </td>

                      {/* Description */}
                      <td>
                        <Field
                          as="textarea"
                          rows={2}
                          name={`list[${index}].description`}
                          className={
                            errors?.list?.[index]?.description &&
                              touched?.list?.[index]?.description
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          disabled={isdataForRead}
                          value={row?.description || ""}
                          onChange={(e) =>
                            setFieldValue(
                              `list[${index}].description`,
                              e.target.value
                            )
                          }
                        />

                        {errors?.list?.[index]?.description &&
                          touched?.list?.[index]?.description && (
                            <div className="invalid-feedback">
                              {errors.list[index].description}
                            </div>
                          )}
                      </td>

                      {/* Delete */}
                      {!isdataForRead && !row?.isPresent && (
                        <td className="text-right">
                          <button
                            type="button"
                            className="border-none bg-transparent"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {typeof errors.list === "string" && (
            <div className="text-danger">{errors.list}</div>
          )}
        </>
      )}
    </FieldArray>
  );
}

export default PatternListForm;