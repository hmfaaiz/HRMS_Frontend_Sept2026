import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { CustomerEditForm } from "./FormEdit"; 
import { CustomerEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { useCustomerUIContext } from "../FormUIContext";

export function CustomerEditDialog({ id, show, onHide, userForRead }) {
  const dispatch = useDispatch();
  const customerUIContext = useCustomerUIContext();
  const { queryParams } = customerUIContext;

  const [loading, setLoading] = useState(false);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const { customerForEdit = {}, actionsLoading = false } = useSelector(
    (state) => state.customer_setup || {},
    shallowEqual
  );

  // Fetch customer by ID when editing or viewing
  useEffect(() => {
    if (id) dispatch(actions.fetchCustomer(id));
  }, [id, dispatch]);

  // Save customer (create or update)
  const saveCustomer = async (customer) => {
    enableLoading();

    // Build payload
    const payload = {
      customerCode: customer.customerCode,
      customerName: customer.customerName,
      countryId: customer.countryId,
      cityId: customer.cityId,
      phone: customer.phone,
      cellNo: customer.cellNo,
      emailAddress: customer.emailAddress,
      contactPerson: customer.contactPerson,
      address: customer.address,
      ...(id ? { Id: id } : {}), // add Id only for updates
    };

    if (!id) {
      await dispatch(actions.createCustomer(payload, disableLoading, onHide, queryParams));
    } else {
      await dispatch(actions.updateCustomer(payload, disableLoading, onHide, queryParams));
    }
  };

  // For add (no id), always start with empty fields
  // For edit (with id), use fetched data
  const initialCustomer = id ? {
    customerCode: customerForEdit.customerCode || "",
    customerName: customerForEdit.customerName || "",
    countryId: customerForEdit.countryId || "",
    cityId: customerForEdit.cityId || "",
    phone: customerForEdit.phone || "",
    cellNo: customerForEdit.cellNo || "",
    emailAddress: customerForEdit.emailAddress || "",
    contactPerson: customerForEdit.contactPerson || "",
    address: customerForEdit.address || "",
  } : {
    customerCode: "",
    customerName: "",
    countryId: "",
    cityId: "",
    phone: "",
    cellNo: "",
    emailAddress: "",
    contactPerson: "",
    address: "",
  };

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CustomerEditDialogHeader id={id} isUserForRead={userForRead} />

      <CustomerEditForm
        customer={initialCustomer}
        saveCustomer={saveCustomer}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isUserForRead={userForRead} // disables fields in view mode
        enableLoading={enableLoading}
        loading={loading}
      />
    </Modal>
  );
}