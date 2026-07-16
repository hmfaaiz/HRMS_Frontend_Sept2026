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

  }, [values?.list, setFieldValue]);

  const activeStatusOptions = [
    {
      label: "OK",
      value: 1,
    },
    {
      label: "No OK",
      value: 0,
    },
  ];
  console.log("allPresentUnassignedCategoryList11111", dashboard.allAssetInspectionList);

  useEffect(() => {
    if (dashboard.allAssetInspectionList?.length > 0) {
      dashboard.allAssetInspectionList
        .filter((item) => item.active_status === 1)
        .forEach((item, index) => {
          if (!values?.list?.[index]?.checklist_description) {
            setFieldValue(
              `list[${index}].checklist_description`,
              item.description
            );

            // Default OK
            setFieldValue(`list[${index}].status`, 1);
          }
        });
    }
  }, [dashboard.allAssetInspectionList, setFieldValue]);
  
  return (
    <FieldArray name="list">
      {({ remove, push }) => (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="font-bold mb-0 text-primary">Asset Inspection List</h6>

            {!isdataForRead && (
              <button
                disabled={!values?.asset_categoryId}
                type="button"
                className="btn btn-primary btn-elevate"
                onClick={() =>
                  push({


                    checklist_description: "",
                    remarks: "",
                    sno: "",
                    status: 1,


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
                    <td style={{ width: "80px" }}>S.No.</td>




                    <td style={{ width: "320px" }}>Checklist Description</td>
                    <td style={{ width: "80px" }}>Status</td>
                    <td style={{ width: "320px" }}>Remarks</td>

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





                      {/* Description */}
                      <td>
                        <Field
                          as="textarea"
                          rows={2}
                          name={`list[${index}].checklist_description`}
                          className={
                            errors?.list?.[index]?.checklist_description &&
                              touched?.list?.[index]?.checklist_description
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          disabled={isdataForRead}
                          value={row?.checklist_description || ""}
                          onChange={(e) =>
                            setFieldValue(
                              `list[${index}].checklist_description`,
                              e.target.value
                            )
                          }
                        />

                        {errors?.list?.[index]?.checklist_description &&
                          touched?.list?.[index]?.checklist_description && (
                            <div className="invalid-feedback">
                              {errors.list[index].checklist_description}
                            </div>
                          )}
                      </td>




                      <td>

                        <SearchSelect
                          name={`list[${index}].status`}
                          className={
                            errors?.list?.[index]?.status &&
                              touched?.list?.[index]?.status
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          isDisabled={isdataForRead}
                          value={activeStatusOptions?.find(
                            (x) =>
                              Number(x.value) ===
                              Number(values?.list?.[index]?.status)
                          )}
                          onChange={(e) => {
                            setFieldValue(
                              `list[${index}].status`,
                              e ? e.value : null
                            );
                          }}
                          options={activeStatusOptions}
                          autoComplete="off"
                        />
                        {errors?.list?.[index]?.status &&
                          touched?.list?.[index]?.status && (
                            <div className="invalid-feedback">
                              {errors.list[index].status}
                            </div>
                          )}







                      </td>

                      <td>
                        <Field
                          as="textarea"
                          rows={2}
                          name={`list[${index}].remarks`}
                          className={
                            errors?.list?.[index]?.remarks &&
                              touched?.list?.[index]?.remarks
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          disabled={isdataForRead}
                          value={row?.remarks || ""}
                          onChange={(e) =>
                            setFieldValue(
                              `list[${index}].remarks`,
                              e.target.value
                            )
                          }
                        />

                        {errors?.list?.[index]?.remarks &&
                          touched?.list?.[index]?.remarks && (
                            <div className="invalid-feedback">
                              {errors.list[index].remarks}
                            </div>
                          )}
                      </td>


                      {/* Delete */}
                      {!isdataForRead && (
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