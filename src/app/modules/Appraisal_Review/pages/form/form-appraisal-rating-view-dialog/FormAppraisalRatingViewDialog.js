import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../_redux/formActions";
import {
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";

export function FormAppraisalRatingViewDialog({ payload, show, onHide }) {
  const dispatch = useDispatch();

  const { appraisalPublishRatingFetch } = useSelector(
    (state) => ({
      appraisalPublishRatingFetch:
        state.appraisal_review.appraisalPublishRating,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (payload) {
      dispatch(actions.appraisalPublishRatingFetch(payload));
    }
  }, [payload, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "code",
      text: "Rating Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
    },
    {
      dataField: "name",
      text: "Rating Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
    },
    {
      dataField: "description",
      text: "Rating Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
      },
    },
    {
      dataField: "points",
      text: "Rating Value",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
    },
    {
      dataField: "from_percentage",
      text: "Rating From (%)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
    },
    {
      dataField: "to_percentage",
      text: "Rating To (%)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
    },
    {
      dataField: "increment_percentage",
      text: "Increment (%)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
    },
  ];

  // Defensive check - table ko hamesha array milna chahiye
  const tableData = Array.isArray(appraisalPublishRatingFetch)
    ? appraisalPublishRatingFetch
    : [];

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="bg-white rounded-lg px-3 py-2 col-span-2">
        <h6 className="font-bold mb-0 text-primary">Rating Scale</h6>
        <div className="w-full overflow-x-auto scrollbar-fancy">
          <BootstrapTable
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            remote
            keyField="Id"
            data={tableData}
            columns={columns}

            // selectRow={getSelectRow({
            //   entities,

            // })}
          >
            <PleaseWaitMessage entities={appraisalPublishRatingFetch} />
            <NoRecordsFoundMessage entities={appraisalPublishRatingFetch} />
          </BootstrapTable>
        </div>
      </div>
      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
