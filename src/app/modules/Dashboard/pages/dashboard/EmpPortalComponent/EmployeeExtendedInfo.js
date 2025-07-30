import React from "react";
import { StarIcon } from "lucide-react";

export const EmployeeExtendedInfo = ({ contactInfo, skillsInfo }) => {
  return (
    <>
      <div className="w-full col-span-1 text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-weight-bolder mb-0 text-primary my-2">
          Emergency Contact
        </h6>
        {contactInfo && contactInfo?.length > 0 ? (
          <div className="grid grid-cols-2 text-sm text-black gap-y-2 mt-2">
            <div className="font-medium">Name</div>
            <div>{contactInfo[0] ? contactInfo[0]?.relation_name : "N/A"}</div>

            <div className="font-medium">Relation</div>
            <div>{contactInfo[0] ? contactInfo[0]?.relation_text : "N/A"}</div>

            <div className="font-medium">Contact No</div>
            <div>{contactInfo[0] ? contactInfo[0]?.contactNo : "N/A"}</div>
          </div>
        ) : (
          // ))
          <p className="text-sm mb-0">No Contact Info Found</p>
        )}
      </div>
      <div className="w-full col-span-1 text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-weight-bolder mb-0 text-primary my-2">Skills</h6>
        {skillsInfo && skillsInfo?.length > 0 ? (
          skillsInfo.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 text-black">
              <p className="text-sm mb-0 col-span-3">{item.skill}</p>
              <p className="col-span-3">
                {[1, 2, 3, 4, 5].map((i) => {
                  const rating = item?.ratingScale / 2;
                  return (
                    <StarIcon
                      key={i}
                      size={13}
                      className={
                        rating >= i
                          ? "text-yellow-500 fill-yellow-500"
                          : rating >= i - 0.5
                          ? "text-yellow-400 fill-yellow-400" // Optional for half star look
                          : "text-gray-300"
                      }
                    />
                  );
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm mb-0">No Skills Found</p>
        )}
      </div>
    </>
  );
};
