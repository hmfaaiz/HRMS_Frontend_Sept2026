import { CircleArrowLeft, House } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const EmployeePortalMenu = ({
  name = "",
  menuOptions = [],
  isDashboardIcon = false,
  isBackButton = false,
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
