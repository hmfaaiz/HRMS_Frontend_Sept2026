import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LastTripsDialogHeader } from "./LastTripsDialogHeader";
import { useCentersUIContext } from "../DashboardUIContext";
import { LastTripVehcicleTable } from "../last-trips-vehicles-table/LastTripVehiclesTable";

export function LastTripsDialog({ id, show, isNew, onHide, userForRead }) {
  const lastTrips = useSelector((state) => state.dashboard?.lastTrips);
  const centersUIContext = useCentersUIContext();

  const centersUIProps = useMemo(() => {
    return {
      initCenter: centersUIContext.initCenter,
      queryParams: centersUIContext.queryParams,
      secondQueryParams: centersUIContext.secondQueryParams,
    };
  }, [centersUIContext]);

  const dispatch = useDispatch();

  return (
    <Modal
      size="xl"
      dialogClassName="modal-90w"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <LastTripsDialogHeader id={id} />
      <Modal.Body className="overlay overlay-block cursor-default">
        <LastTripVehcicleTable lastTrips={lastTrips && lastTrips} />
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-primary btn-elevate"
        >
          OK
        </button>
      </Modal.Footer>
    </Modal>
  );
}
