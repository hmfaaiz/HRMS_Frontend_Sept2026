import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/formActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { formatDates } from "../../../../../utils/common";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();
  const { confirm, ConfirmationComponent } = useConfirmationDialog();


  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const {
    actionsLoading,
    user,
    userForEdit,
    roles,
    centers,
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({

    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.close_payroll_month.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.close_payroll_month.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);



  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(FormUIProps.queryParams))
  }, [id, dispatch]);

  // useEffect(() => {

  //   if (actionsLoading === false) {

  //     disbaleLoading();
  //   }
  // }, [actionsLoading]);


  const SavePayrollMonthSetup = async (user) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    if (user.endDate) {
      // If user.endDate is a string, convert it to a Date object first.
      const endDateObj = typeof user.endDate === "string" ? new Date(user.endDate) : user.endDate;
      const fullYear = endDateObj.getFullYear();
      const month = endDateObj.getMonth() + 1;


      if (fullYear != user.year || month != user.month) {
        // Trigger a toast notification (use the toast method)
        toast.error("The year or month does not match the user's data.");
        return
      }
    }

    if (id) {
      const monthNum = parseInt(user.month, 10);
      const monthName = (monthNum >= 1 && monthNum <= 12) ? monthNames[monthNum - 1] : "";
      const yearVal = user.year;

      const isConfirmed = await confirm(
        "Confirm Save",
        `Are you sure you want to close Payroll Month of ${monthName}, ${yearVal}`,
        "No",
        "Yes"
      );

      if (!isConfirmed) {
        return;
      }
    }

    if (!id) {


      // user.month_days= defDays
      const finalObject = { user }
      const formattedValues = {
        ...user,
        startDate: user.startDate
          ? formatDates(user.startDate, "dd-MMM-yyyy")
          : null, endDate: user.endDate
            ? formatDates(user.endDate, "dd-MMM-yyyy")
            : null,

      }

      await dispatch(actions.createPayrollMonth(formattedValues, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {
      // Calculate the next month's values
      const currentMonth = parseInt(user.month, 10);
      const currentYear = parseInt(user.year, 10);

      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

      const currentEndDateObj = typeof user.endDate === "string" ? new Date(user.endDate) : user.endDate;
      const nextStartDate = new Date(currentEndDateObj);
      nextStartDate.setDate(nextStartDate.getDate() + 1);

      const getTotalDaysInMonth = (year, month) => {
        const lastDayOfMonth = new Date(year, month, 0);
        return lastDayOfMonth.getDate();
      };
      const totalDays = getTotalDaysInMonth(nextYear, nextMonth);

      const nextEndDate = new Date(nextStartDate);
      nextEndDate.setDate(nextEndDate.getDate() + totalDays - 1);

      const formattedMonth = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
      const formattedYear = nextYear.toString().slice(-2);
      const shortFormat = `${formattedMonth}${formattedYear}`;

      const payrollMonthSetupUpdatedFields = {
        startDate: nextStartDate,
        endDate: nextEndDate,
        month: nextMonth,
        month_days: totalDays,
        shortFormat: shortFormat,
        year: nextYear,
        subsidiaryId: user.subsidiaryId
      };

      const formattedValues = {
        ...payrollMonthSetupUpdatedFields,
        startDate: payrollMonthSetupUpdatedFields.startDate
          ? formatDates(payrollMonthSetupUpdatedFields.startDate, "dd-MMM-yyyy")
          : null,
        endDate: payrollMonthSetupUpdatedFields.endDate
          ? formatDates(payrollMonthSetupUpdatedFields.endDate, "dd-MMM-yyyy")
          : null,
      };

      await dispatch(actions.createPayrollMonth(formattedValues, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      {id && (!userForEdit || userForEdit.Id != id) ? (
        <div className="text-center p-10" style={{ minHeight: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="spinner spinner-lg spinner-success" />
        </div>
      ) : (
        <MasterEditForm
          SaveClosePayrollMonthSetup={SavePayrollMonthSetup}
          user={userForEdit || formUIProps.initUser}
          onHide={onHide}
          roles={roles}
          centers={centers}
          userStatusTypes={userStatusTypes}
          isUserForRead={userForRead}
          enableLoading={enableLoading}
          loading={loading}
        />
      )}
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
      <ConfirmationComponent />
    </Modal>
  );
}
