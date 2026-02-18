import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SubsidiaryPayrollUIProvider } from "./FormUIContext";
import { SubsidiaryPayrollFormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { SubsidiaryPayrollDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { SubsidiaryPayrollCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push(
        "/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/new",
      );
    },
    openEditFormDialog: (subsidiaryId, payroll_groupId) => {
      history.push(
        `/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/${subsidiaryId}/${payroll_groupId}/edit`,
      );
    },
    openDeleteFormDialog: (subsidiaryId, payroll_groupId) => {
      history.push(`/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/${subsidiaryId}/${payroll_groupId}/delete`);
    },
    openReadFormDialog: (subsidiaryId, payroll_groupId) => {
      history.push(
        `/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/${subsidiaryId}/${payroll_groupId}/read`,
      );
    },
  };

  return (
    <SubsidiaryPayrollUIProvider FormUIEvents={FormUIEvents}>
      <Route
        exact
        path="/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/new"
      >
        {({ history, match }) => (
          <SubsidiaryPayrollFormEditDialog
            show={match != null}
            onHide={() =>
              history.push(
                "/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist",
              )
            }
          />
        )}
      </Route>

      <Route path="/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/:subsidiaryId/:payroll_groupId/edit">
        {({ history, match }) => (
          <SubsidiaryPayrollFormEditDialog
            show={match != null}
            subsidiaryId={match?.params.subsidiaryId}
            payroll_groupId={match?.params.payroll_groupId}
            onHide={() =>
              history.push(
                "/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist",
              )
            }
          />
        )}
      </Route>

      <Route path="/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/:subsidiaryId/:payroll_groupId/read">
        {({ history, match }) => (
          <SubsidiaryPayrollFormEditDialog
            show={match != null}
            subsidiaryId={match?.params.subsidiaryId}
            payroll_groupId={match?.params.payroll_groupId}
            dataForRead={true}
            onHide={() =>
              history.push(
                "/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist",
              )
            }
          />
        )}
      </Route>
      <Route path="/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist/:subsidiaryId/:payroll_groupId/delete">
  {({ history, match }) => (
    <SubsidiaryPayrollDeleteDialog
      show={match != null}
      subsidiaryId={match?.params.subsidiaryId}
      payroll_groupId={match?.params.payroll_groupId}
      onHide={() =>
        history.push(
          "/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist"
        )
      }
    />
  )}
</Route>


      <SubsidiaryPayrollCard />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </SubsidiaryPayrollUIProvider>
  );
}
