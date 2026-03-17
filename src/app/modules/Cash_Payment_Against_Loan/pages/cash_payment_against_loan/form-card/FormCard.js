import React, { useMemo, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { LoanTypeSelect } from "../form-edit-dialog/LoanTypeSelect";
import { LoanDetail } from "../form-edit-dialog/LoanDetail";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "../form-delete-dialog/FormDeleteDialog";
import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { fetchAllActiveEmployees, getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import {
  getAllLoanType,
  fetchEmployeeLoanRequest,
} from "../../../../Employee_Loan_Request/_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { useFormUIContext } from "../FormUIContext";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const FormUIProps = useMemo(
    () => ({
      ids:                  FormUIContext.ids,
      setIds:               FormUIContext.setIds,
      isViewMode:           FormUIContext.isViewMode,
      setIsViewMode:        FormUIContext.setIsViewMode,
      employeeId:           FormUIContext.employeeId,
      setemployeeId:        FormUIContext.setemployeeId,
      panelMode:            FormUIContext.panelMode,
      setPanelMode:         FormUIContext.setPanelMode,
      loanTypeId:           FormUIContext.loanTypeId,
      setLoanTypeId:        FormUIContext.setLoanTypeId,
      loanPanelMode:        FormUIContext.loanPanelMode,
      setLoanPanelMode:     FormUIContext.setLoanPanelMode,
      queryParams:          FormUIContext.queryParams,
      resetAll:             FormUIContext.resetAll,
      // Delete dialog
      deleteId:             FormUIContext.deleteId,
      showDeleteDialog:     FormUIContext.showDeleteDialog,
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
      closeDeleteFormDialog:FormUIContext.closeDeleteFormDialog,
    }),
    [FormUIContext]
  );

  const { dashboard } = useSelector(
    (state) => ({ dashboard: state.dashboard }),
    shallowEqual
  );

  useEffect(() => {
    if (!dashboard.allEmployees || !dashboard.allEmployees.length) {
      dispatch(fetchAllActiveEmployees());
    }
    dispatch(getAllLoanType());
  }, [dispatch]);

  useEffect(() => {
    if (FormUIProps.employeeId) {
      dispatch(
        fetchEmployeeLoanRequest({
          employeeId: FormUIProps.employeeId,
          pageNumber: 1,
          pageSize: 100,
          sortOrder: "desc",
        })
      );
    }
  }, [dispatch, FormUIProps.employeeId]);

  const handleEditFromTable = (row) => {
    FormUIProps.setemployeeId(row.employeeId);
    FormUIProps.setLoanTypeId(row.loan_typeId);
    const selectedEmp = dashboard.allEmployees?.find((e) => e.value === row.employeeId);
    dispatch(getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId));
    FormUIProps.setIsViewMode(false);
    FormUIProps.setIds(row.Id);
    dispatch(
      fetchEmployeeLoanRequest({
        employeeId: row.employeeId,
        pageNumber: 1,
        pageSize: 100,
        sortOrder: "desc",
      })
    );
  };

  const handleViewFromTable = (row) => {
    FormUIProps.setemployeeId(row.employeeId);
    FormUIProps.setLoanTypeId(row.loan_typeId);
    const selectedEmp = dashboard.allEmployees?.find((e) => e.value === row.employeeId);
    dispatch(getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId));
    FormUIProps.setIsViewMode(true);
    FormUIProps.setIds(row.Id);
    dispatch(
      fetchEmployeeLoanRequest({
        employeeId: row.employeeId,
        pageNumber: 1,
        pageSize: 100,
        sortOrder: "desc",
      })
    );
  };

  return (
    <TCard name={CurrentModuleName()}>

      <EmployeeSelect
        employeeId={FormUIProps.employeeId}
        setemployeeId={FormUIProps.setemployeeId}
        setPanelMode={FormUIProps.setPanelMode}
        panelMode={FormUIProps.panelMode}
      />

      <EmployeeProfile
        employeeId={FormUIProps.employeeId}
        panelMode={FormUIProps.panelMode}
      />

      <LoanTypeSelect
        employeeId={FormUIProps.employeeId}
        loanTypeId={FormUIProps.loanTypeId}
        setLoanTypeId={FormUIProps.setLoanTypeId}
        loanPanelMode={FormUIProps.loanPanelMode}
        setLoanPanelMode={FormUIProps.setLoanPanelMode}
      />

      <LoanDetail
        loanTypeId={FormUIProps.loanTypeId}
        loanPanelMode={FormUIProps.loanPanelMode}
      />

      <FormEditDialog
        id={FormUIProps.ids || "new"}
        employeeId={FormUIProps.employeeId}
        loanTypeId={FormUIProps.loanTypeId}
      />

      {/* Delete confirmation dialog — controlled by context state */}
      <FormDeleteDialog
        id={FormUIProps.deleteId}
        show={FormUIProps.showDeleteDialog}
        onHide={FormUIProps.closeDeleteFormDialog}
      />

      <br />
      <hr />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <FormFilter />
      </div>

      <FormTable
        onEditRow={handleEditFromTable}
        onViewRow={handleViewFromTable}
        openDeleteFormDialog={FormUIProps.openDeleteFormDialog}
      />

    </TCard>
  );
}