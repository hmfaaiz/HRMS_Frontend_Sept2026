import React from "react";
import { Modal } from "react-bootstrap";

const SmallTableModal = ({ onHide, show, data }) => {
  let theme = data?.color_theme_class;
  return (
    <Modal
      size="sm"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="bg-white rounded-lg px-3 py-2">
        <h6 className="font-bold mb-0 text-primary">
          {data?.days
            ? data?.dashlet_name?.replace("${days}", data?.days)
            : data?.dashlet_name}
        </h6>
        <div className="space-y-3 my-2 max-h-[65vh] overflow-auto">
          {data?.data.length > 0 ? (
            data?.data.map((person) => (
              <div
                key={person?.Id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={person?.profile_image}
                    alt={person?.Employee_Name}
                    className="object-cover rounded-sm w-10 h-10"
                  />
                  <div>
                    <div className="text-sm text-black font-normal">
                      {person?.Employee_Name}
                    </div>
                    <div className="text-xs text-black font-normal">
                      {person?.Designation}
                    </div>
                    {/* <div style={{ fontSize: "12px", color: "#888" }}>
                    {person.departmentName}
                  </div> */}
                  </div>
                </div>
                <div className={`text-sm font-semibold m-0 ${theme}`}>
                  <span>{person?.main_value}</span>
                </div>
              </div>
            ))
          ) : (
            <label className="text-center">No Record Available</label>
          )}
        </div>
      </div>
      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default SmallTableModal;
