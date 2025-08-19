import React from "react";

const SingleCard = ({ data, setSmallTableModalData }) => {
  let theme = data?.color_theme_class;
  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <h6 className="font-bold mb-0 text-primary">
        {data?.days
          ? data?.dashlet_name?.replace("${days}", data?.days)
          : data?.dashlet_name}
      </h6>
      <div className={data?.data.length > 0 ? "space-y-3 my-2 min-h-72 overflow-auto" : `space-y-0 my-2 max-h-6 overflow-auto`} >
        {data?.data.length > 0 ? (
          data?.data.map((person) => (
            <div key={person?.Id} className="flex justify-between items-center">
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
      <lable
        className="text-black cursor-pointer text-right font-medium underline text-xs hover:text-tprimary flex justify-end"
        onClick={() => setSmallTableModalData(data)}
      >
        Expand
      </lable>
    </div>
  );
};

export default function SmallTable({ data, setSmallTableModalData }) {
  return (
    <SingleCard data={data} setSmallTableModalData={setSmallTableModalData} />
  );
}
