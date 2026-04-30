import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import { TimeLogForm } from "./FormTimeLog";



export function TimeLog({ detailId, status, show, onHide }) {


    const [loading, setLoading] = useState(false);
    // Customers UI Context
    const usersUIContext = useTaskAssignmentTimelineUIContext();
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

    // if !id we should close modal
    useEffect(() => {
        if (!detailId) {
            onHide();
        }
        // if (detailId) {
        //     fetchDetailData()
        // }

    }, [detailId]);


    return (
        <Modal
            show={show}
            // size="xl"
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            {/*begin::Loading*/}
            {isLoading && <ModalProgressBar />}
            {/*end::Loading*/}
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Time Logging
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TimeLogForm onHide={onHide}/>
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
