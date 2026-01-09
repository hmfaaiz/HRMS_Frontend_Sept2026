import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { DetailTable } from "../form-table/DetailTable";

export function DetailData({ detailId, status, show, onHide }) {


    const [loading, setLoading] = useState(false);
    // Customers UI Context
    const usersUIContext = useFormUIContext();
    const usersUIProps = useMemo(() => {
        return {
            queryParams: usersUIContext.queryParams,
        };
    }, [usersUIContext]);

    // Customers Redux state
    const dispatch = useDispatch();
    const { isLoading } = useSelector(
        (state) => ({ isLoading: state.customers.actionsLoading }),
        shallowEqual
    );

    const enableLoading = () => {
        setLoading(true);
    };

    const disableLoading = () => {
        setLoading(false);
    };

    // if !id we should close modal
    useEffect(() => {
        if (!detailId) {
            onHide();
        }
        if (detailId) {
            fetchDetailData()
        }

    }, [detailId]);

    // looking for loading/dispatch


    const fetchDetailData = () => {
        // server request for deleting customer by id
        enableLoading();

        dispatch(actions.fetchAllFacilitatorDetail(detailId)).then(() => {
            // onHide();
            // refresh list after deletion
            // dispatch(actions.fetchEmployeeDocs(usersUIProps.queryParams));

            disableLoading();
        });
    };

    return (
        <Modal
            show={show}
            size="xl"
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            {/*begin::Loading*/}
            {isLoading && <ModalProgressBar />}
            {/*end::Loading*/}
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DetailTable />
            </Modal.Body>
            <Modal.Footer>
                <div>
                    <button type="button" onClick={onHide} className="btn btn-light ">
                        Cancel
                    </button>


                </div>
            </Modal.Footer>
        </Modal>
    );
}
