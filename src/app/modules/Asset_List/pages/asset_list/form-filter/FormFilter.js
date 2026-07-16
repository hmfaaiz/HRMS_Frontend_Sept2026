import React, { useEffect, useMemo, useRef } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { initialFilter, assetStatusOptions } from "../FormUIHelper";
import * as actions from "../../../_redux/redux-Actions";
import { formatDates } from "../../../../../utils/common";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { FileText, Sheet } from "lucide-react";

const formValidation = Yup.object().shape({
  acquisitionFrom: Yup.date().nullable().optional(),
  acquisitionTo: Yup.date()
    .nullable()
    .optional()
    .min(Yup.ref("acquisitionFrom"), "'To Date' should not be less than 'From Date'."),
  expiryFrom: Yup.date().nullable().optional(),
  expiryTo: Yup.date()
    .nullable()
    .optional()
    .min(Yup.ref("expiryFrom"), "'To Date' should not be less than 'From Date'."),
});


const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  const formattedValues = {
    ...values,
    acquisitionFrom: values.acquisitionFrom ? formatDates(values.acquisitionFrom, "dd-MMM-yyyy") : null,
    acquisitionTo: values.acquisitionTo ? formatDates(values.acquisitionTo, "dd-MMM-yyyy") : null,
    expiryFrom: values.expiryFrom ? formatDates(values.expiryFrom, "dd-MMM-yyyy") : null,
    expiryTo: values.expiryTo ? formatDates(values.expiryTo, "dd-MMM-yyyy") : null,
  };
  newQueryParams.filter = { ...formattedValues };
  return newQueryParams;
};


const idsToLabels = (ids, options) => {
  if (!ids?.length || !options?.length) return "";
  const optionMap = new Map(options.map((o) => [o.value, o]));
  return ids.map((id) => optionMap.get(id)?.label).filter(Boolean).join(", ");
};

const resolveAssetStatusSelection = (prevValues, selectedValues) => {
  const justSelectedAll =
    selectedValues.includes("all") && !prevValues.includes("all");
  const justSelectedOther =
    selectedValues.some((v) => v !== "all") && prevValues.includes("all");

  if (justSelectedAll) return ["all"];
  if (justSelectedOther) return selectedValues.filter((v) => v !== "all");
  return selectedValues;
};

const stripIfAllSelected = (selectedIds, fullOptions) => {
  if (!fullOptions?.length || !selectedIds?.length) return selectedIds;
  if (selectedIds.length !== fullOptions.length) return selectedIds;
  const fullSet = new Set(fullOptions.map((o) => o.value));
  const allMatch = selectedIds.every((id) => fullSet.has(id));
  return allMatch ? [] : selectedIds;
};

const stripFullySelected = (values, optionsMap) => {
  const stripped = { ...values };
  Object.entries(optionsMap).forEach(([field, options]) => {
    stripped[field] = stripIfAllSelected(values[field], options);
  });
  return stripped;
};

const labelOrAll = (selectedIds, options) => {
  if (!options?.length || !selectedIds?.length) return idsToLabels(selectedIds, options);
  if (selectedIds.length === options.length) {
    const fullSet = new Set(options.map((o) => o.value));
    if (selectedIds.every((id) => fullSet.has(id))) return "All";
  }
  return idsToLabels(selectedIds, options);
};

export function FormFilter({ loading, dispatch, pdfLoading, registerExcelLoading }) {
  const FormUIContext = useFormUIContext();
  const formikRef = useRef(null);

  const autoSelected = useRef({});

  const {
    allEmployees,
    allSubsidiaryList,
    allDept,
    allLocationChildMenus,
    allAssetCategoryList,
    allAssetMakeList,
  } = useSelector((state) => state.dashboard);

  const { assetModelList: allAssetModelList } = useSelector((state) => state.asset_list);
  const optionsMap = {
    asset_categoryId: allAssetCategoryList,
    asset_makeId: allAssetMakeList,
    asset_modelId: allAssetModelList,
    subsidiaryId: allSubsidiaryList,
    departmentId: allDept,
    employeeId: allEmployees,
    locationId: allLocationChildMenus,
  };

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const applyFilter = (values) => {
    const strippedValues = stripFullySelected(values, optionsMap);
    const newQueryParams = prepareFilter(formUIProps.queryParams, strippedValues);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  const getLabels = (values) => {
    return {
      asset_categoryLabel: labelOrAll(values.asset_categoryId, allAssetCategoryList),
      asset_makeLabel: labelOrAll(values.asset_makeId, allAssetMakeList),
      asset_modelLabel: labelOrAll(values.asset_modelId, allAssetModelList),
      asset_noLabel: values?.asset_no || "",
      registration_noLabel: values?.registration_no || "",
      subsidiaryLabel: labelOrAll(values.subsidiaryId, allSubsidiaryList),
      departmentLabel: labelOrAll(values.departmentId, allDept),
      employeeLabel: labelOrAll(values.employeeId, allEmployees),
      locationLabel: labelOrAll(values.locationId, allLocationChildMenus),
      assetStatusLabel: idsToLabels(values.assetStatus, assetStatusOptions),
      acquisitionFromLabel: values?.acquisitionFrom ? formatDates(values.acquisitionFrom) : "",
      acquisitionToLabel: values?.acquisitionTo ? formatDates(values.acquisitionTo) : "",
      expiryFromLabel: values?.expiryFrom ? formatDates(values.expiryFrom) : "",
      expiryToLabel: values?.expiryTo ? formatDates(values.expiryTo) : "",
    };
  };

  const getPdf = (values) => {
    const strippedValues = stripFullySelected(values, optionsMap);
    const newQueryParams = prepareFilter(formUIProps.queryParams, strippedValues);
    const labels = getLabels(values);
    dispatch(actions.fetchPdfData(newQueryParams.filter, document, labels));
  };

  const getExcel = (values) => {
    const strippedValues = stripFullySelected(values, optionsMap);
    const newQueryParams = prepareFilter(formUIProps.queryParams, strippedValues);
    const labels = getLabels(values);
    dispatch(actions.generateRegisterExcel(newQueryParams.filter, document, labels));
  };

  useEffect(() => {
    if (!allAssetModelList?.length) {
      dispatch(actions.fetchAssetModelOptions());
    }
  }, []);

  // Auto-select "all" for each master-data dropdown, once its options load

  useEffect(() => {
    if (allAssetCategoryList?.length && !autoSelected.current.asset_categoryId) {
      formikRef.current?.setFieldValue(
        "asset_categoryId",
        allAssetCategoryList.map((o) => o.value),
      );
      autoSelected.current.asset_categoryId = true;
    }
  }, [allAssetCategoryList]);

  useEffect(() => {
    if (allAssetMakeList?.length && !autoSelected.current.asset_makeId) {
      formikRef.current?.setFieldValue(
        "asset_makeId",
        allAssetMakeList.map((o) => o.value),
      );
      autoSelected.current.asset_makeId = true;
    }
  }, [allAssetMakeList]);

  useEffect(() => {
    if (allAssetModelList?.length && !autoSelected.current.asset_modelId) {
      formikRef.current?.setFieldValue(
        "asset_modelId",
        allAssetModelList.map((o) => o.value),
      );
      autoSelected.current.asset_modelId = true;
    }
  }, [allAssetModelList]);

  useEffect(() => {
    if (allLocationChildMenus?.length && !autoSelected.current.locationId) {
      formikRef.current?.setFieldValue(
        "locationId",
        allLocationChildMenus.map((o) => o.value),
      );
      autoSelected.current.locationId = true;
    }
  }, [allLocationChildMenus]);

  useEffect(() => {
    if (allSubsidiaryList?.length && !autoSelected.current.subsidiaryId) {
      const ids = allSubsidiaryList.map((o) => o.value);
      formikRef.current?.setFieldValue("subsidiaryId", ids);
      autoSelected.current.subsidiaryId = true;

      ids.forEach((id) => {
        dispatch(fetchAllActiveEmployeesBySubsidiary(id));
        dispatch(fetchAllDept(id));
      });
    }
  }, [allSubsidiaryList]);

  useEffect(() => {
    if (!allDept?.length) return;
    const newIds = allDept.map((o) => o.value);
    const lastAuto = autoSelected.current.departmentIdValue;
    const currentValue = formikRef.current?.values?.departmentId;
    const untouchedByUser = !lastAuto || isEqual(currentValue, lastAuto);
    if (untouchedByUser) {
      formikRef.current?.setFieldValue("departmentId", newIds);
      autoSelected.current.departmentIdValue = newIds;
    }
  }, [allDept]);

  useEffect(() => {
    if (!allEmployees?.length) return;
    const newIds = allEmployees.map((o) => o.value);
    const lastAuto = autoSelected.current.employeeIdValue;
    const currentValue = formikRef.current?.values?.employeeId;
    const untouchedByUser = !lastAuto || isEqual(currentValue, lastAuto);
    if (untouchedByUser) {
      formikRef.current?.setFieldValue("employeeId", newIds);
      autoSelected.current.employeeIdValue = newIds;
    }
  }, [allEmployees]);

  return (
    <>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initialFilter.filter}
        validationSchema={formValidation}
        onSubmit={(values) => applyFilter(values)}
      >
        {({ values, errors, touched, handleSubmit, handleBlur, setFieldValue, handleReset, isValid }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  {/* Asset Filters */}
                  <div>
                    <h6 className="font-bold mb-0 text-primary">Asset Filters</h6>
                    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-1">
                      {/* Asset Category */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="asset_categoryId"
                          label="Asset Category"
                          value={(allAssetCategoryList || []).filter((o) =>
                            values.asset_categoryId.includes(o.value),
                          )}
                          options={allAssetCategoryList || []}
                          onChange={(items = []) =>
                            setFieldValue("asset_categoryId", items.map((i) => i.value))
                          }
                        />
                      </div>

                      {/* Asset Company (Make) */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="asset_makeId"
                          label="Asset Company"
                          value={(allAssetMakeList || []).filter((o) =>
                            values.asset_makeId.includes(o.value),
                          )}
                          options={allAssetMakeList || []}
                          onChange={(items = []) =>
                            setFieldValue("asset_makeId", items.map((i) => i.value))
                          }
                        />
                      </div>

                      {/* Asset Model */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="asset_modelId"
                          label="Asset Model"
                          value={(allAssetModelList || []).filter((o) =>
                            values.asset_modelId.includes(o.value),
                          )}
                          options={allAssetModelList || []}
                          onChange={(items = []) =>
                            setFieldValue("asset_modelId", items.map((i) => i.value))
                          }
                        />
                      </div>

                      {/* Asset No. */}
                      <div className="col-span-1">
                        <label>Asset No.</label>
                        <Field
                          name="asset_no"
                          as="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>

                      {/* Registration Number */}
                      <div className="col-span-1">
                        <label>Registration Number</label>
                        <Field
                          name="registration_no"
                          as="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Employee Filter — Company field removed as requested */}
                  <div>
                    <h6 className="font-bold mb-0 text-primary">Employee Filter</h6>
                    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-1">
                      {/* Subsidiary */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="subsidiaryId"
                          label="Subsidiary"
                          value={(allSubsidiaryList || []).filter((o) =>
                            values.subsidiaryId.includes(o.value),
                          )}
                          options={allSubsidiaryList || []}
                          onChange={(items = []) => {
                            const ids = items.map((i) => i.value);
                            setFieldValue("subsidiaryId", ids);
                            ids.forEach((id) => {
                              dispatch(fetchAllActiveEmployeesBySubsidiary(id));
                              dispatch(fetchAllDept(id));
                            });
                          }}
                        />
                      </div>

                      {/* Department Wise */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="departmentId"
                          label="Department"
                          value={(allDept || []).filter((o) =>
                            values.departmentId.includes(o.value),
                          )}
                          options={allDept || []}
                          onChange={(items = []) =>
                            setFieldValue("departmentId", items.map((i) => i.value))
                          }
                        />
                      </div>

                      {/* Employee Wise */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="employeeId"
                          label="Employee"
                          value={(allEmployees || []).filter((o) =>
                            values.employeeId.includes(o.value),
                          )}
                          options={allEmployees || []}
                          onChange={(items = []) =>
                            setFieldValue("employeeId", items.map((i) => i.value))
                          }
                        />
                      </div>

                      {/* Location Wise */}
                      <div className="col-span-1">
                        <MultiSelect
                          name="locationId"
                          label="Location"
                          value={(allLocationChildMenus || []).filter((o) =>
                            values.locationId.includes(o.value),
                          )}
                          options={allLocationChildMenus || []}
                          onChange={(items = []) =>
                            setFieldValue("locationId", items.map((i) => i.value))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Report Filter + Date Range */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-1">
                    <div className="col-span-1">
                      <h6 className="font-bold mb-0 text-primary">Report Filter</h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <MultiSelect
                            name="assetStatus"
                            label="Asset Status"
                            value={assetStatusOptions.filter((o) =>
                              values.assetStatus.includes(o.value),
                            )}
                            options={assetStatusOptions}
                            onChange={(items = []) =>
                              setFieldValue("assetStatus",resolveAssetStatusSelection(values.assetStatus, items.map((i) => i.value)),
                              )
                            }
                          />
                        </div>
                        <div className="col-span-2">
                      <h6 className="font-bold mb-0 text-primary">Date Range</h6>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <label>Date of Acquisition</label>
                          <div className="grid grid-cols-2 gap-x-2">
                            <Field
                              name="acquisitionFrom"
                              component={DatePickerField}
                              dateFormat="dd-MMM-yyyy"
                              className="form-control"
                              label={<span> From</span>}
                              onChange={(date) => {
                                setFieldValue("acquisitionFrom", date);
                                setFieldValue("acquisitionTo", date);
                              }}
                              autoComplete="off"
                            />
                            <Field
                              name="acquisitionTo"
                              component={DatePickerField}
                              onBlur={handleBlur}
                              dateFormat="dd-MMM-yyyy"
                              className="form-control"
                              label={<span> To</span>}
                              onChange={(date) => setFieldValue("acquisitionTo", date)}
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div className="col-span-1">
                          <label>Date of Expiry</label>
                          <div className="grid grid-cols-2 gap-x-2">
                            <Field
                              name="expiryFrom"
                              component={DatePickerField}
                              dateFormat="dd-MMM-yyyy"
                              className="form-control"
                              label={<span> From</span>}
                              onChange={(date) => {
                                setFieldValue("expiryFrom", date);
                                setFieldValue("expiryTo", date);
                              }}
                              autoComplete="off"
                            />
                            <Field
                              name="expiryTo"
                              component={DatePickerField}
                              onBlur={handleBlur}
                              dateFormat="dd-MMM-yyyy"
                              className="form-control"
                              label={<span> To</span>}
                              onChange={(date) => setFieldValue("expiryTo", date)}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                      </div>
                      
                    </div>

                    
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
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
                type="submit"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="btn btn-primary btn-elevate"
              >
                Filter
                {loading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
              </button>

              <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
                <OverlayTrigger overlay={<Tooltip id="asset-list-pdf-tooltip">Export PDF</Tooltip>}>
                  <button
                    onClick={() => getPdf(values)}
                    disabled={pdfLoading || !isValid}
                    className="border-none bg-transparent"
                  >
                    <FileText className="w-4 h-4 text-black cursor-pointer" />
                    {pdfLoading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip id="asset-list-excel-tooltip">Export Excel</Tooltip>}>
                  <button
                    onClick={() => getExcel(values)}
                    disabled={registerExcelLoading || !isValid}
                    className="border-none bg-transparent"
                    type="button"
                  >
                    <Sheet className="w-4 h-4 text-black cursor-pointer" />
                    {registerExcelLoading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
                  </button>
                </OverlayTrigger>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}