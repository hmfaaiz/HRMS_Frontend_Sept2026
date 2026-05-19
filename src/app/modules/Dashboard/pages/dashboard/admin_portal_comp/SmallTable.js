import React, { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import { PeriodType } from "../EmpUIHelper";
import { useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

const SingleCard = ({ data, setSmallTableModalData, expand }) => {
  const [activeKey, setActiveKey] = useState(expand ? "0" : null);
  let theme = data?.theme_class;
  const dashboard = useSelector((state) => state.dashboard || []);

  const getHeading = () => {
    if (!data) return "";

    let name = data.dashlet_name || "";
    // Handle period type name override
    if (data.isPeriodType) {
      const periodLabel = PeriodType[data.PeriodType];

      if (periodLabel) {
        name = `${name} In ${periodLabel}`;
      } else {
        const type = data.sequenceStatus == "0" ? "Next" : "Last";
        name = `${name} In ${type} ${data.days} Days`;
      }
    }

    // Add trend label
    if (data.trendValue) {
      const label =
        data.trendValue == 1
          ? dashboard?.activeFiscalYear?.label
          : dashboard?.activeFiscalYear?.payrollMonthLabel;

      name = `${name} - ${label ?? ""}`;
    }

    return name;
  };

  return (
    <div className="bg-white w-full rounded-lg px-3 py-2">
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        <Card className="border-0">
          <Card.Header className="bg-white border-0 p-0">
            <div className="flex justify-between items-center w-full">
              {/* Left side - Accordion toggle with icon and heading */}
              <Accordion.Toggle
                eventKey="0"
                className="flex items-center gap-2 p-0 border-0 bg-transparent shadow-none hover:bg-transparent"
                style={{ outline: "none" }}
              >
                {activeKey === "0" ? (
                  <CircleMinus className="h-4 w-4 text-tprimary" />
                ) : (
                  <CirclePlus className="h-4 w-4 text-tprimary" />
                )}
                <h6 className="font-bold mb-0 text-tprimary">{getHeading()}</h6>
              </Accordion.Toggle>
            </div>
          </Card.Header>

          <Accordion.Collapse eventKey="0">
            <div className="pt-3">
              <div
                className={
                  data?.data.length > 0
                    ? "space-y-3 my-2 max-h-[19rem] overflow-auto scrollbar-fancy px-1"
                    : `space-y-0 my-2 max-h-6 scrollbar-fancy`
                }
              >
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = toAbsoluteUrl(
                              "/media/users/profileImage.png",
                            );
                          }}
                        />
                        <div>
                          <div className="text-sm text-black font-normal">
                            {person?.Employee_Name}
                          </div>
                          <div className="text-xs text-black font-normal">
                            {person?.Designation}
                          </div>
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
              </div>{" "}
              <div className="text-right w-full flex justify-end">
                {" "}
                {data?.data.length > 0 ? (
                  <label
                    className={`text-black cursor-pointer w-fit font-medium underline text-xs hover:text-tprimary flex justify-end`}
                    onClick={() => setSmallTableModalData(data)}
                  >
                    Expand
                  </label>
                ) : (
                  <label
                    className={`text-gray-500 cursor-not-allowed w-fit font-medium text-xs flex justify-end`}
                  >
                    Expand
                  </label>
                )}
              </div>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default function SmallTable({ data, setSmallTableModalData, expand }) {
  
  return (
    <SingleCard
      data={data}
      setSmallTableModalData={setSmallTableModalData}
      expand={expand}
    />
  );
}
