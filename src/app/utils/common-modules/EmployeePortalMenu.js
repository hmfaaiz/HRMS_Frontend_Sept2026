import { CircleArrowLeft, House, Megaphone, Star } from "lucide-react";
import React from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const EmployeePortalMenu = ({
  name = "",
  menuOptions = [],
  isDashboardIcon = false,
  isBackButton = false,
  isAnouncement = false,
  announcement,
}) => {
  const history = useHistory();
  return (
    <div className="px-3 py-2 rounded-lg bg-white">
      <div className="flex flex-wrap justify-between items-center gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {isBackButton && (
            <CircleArrowLeft
              className="w-8 h-8 text-black cursor-pointer rounded-md p-1"
              onClick={() => history.goBack()}
            />
          )}
          <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
            {name}
          </h5>
          {isAnouncement && announcement?.length > 0 && (
            <div className="px-2 py-1 bg-tlight rounded-md col-span-4 flex items-center gap-1">
              <Megaphone className="text-black w-4 h-4 mr-1 stroke-3" />
              <h6 className="font-bold mb-0 text-primary">Announcements</h6>
              <Marquee
                className="content-center ml-5"
                speed={20}
                gradient={false}
                pauseOnHover={true}
              >
                {announcement?.length > 0 &&
                  announcement?.map((e) => (
                    <label className="text-sm mx-2 font-medium text-black">
                      <Star className="w-3 h-3 text-black ms-1" />{" "}
                      {e?.ticker_description}
                    </label>
                  ))}
              </Marquee>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {isDashboardIcon && (
            <Link title="Dashboard" to="/dashboard">
              <House className="w-6 h-6 bg-primary rounded-md p-1 text-white" />
            </Link>
          )}

          {menuOptions
            // .filter((option) => option.isShow)
            .map((option) => (
              <Link
                key={option.name}
                className="text-xs sm:text-sm font-semibold text-primary hover:underline"
                to={option.link}
              >
                {option.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeePortalMenu;
