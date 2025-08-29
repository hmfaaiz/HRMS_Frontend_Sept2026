// please be familiar with react-bootstrap-table-next column formaters
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Column%20Formatter&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
import React from "react";
import {
  CustomerStatusCssClasses,
  CustomerStatusTitles,
} from "../../DashboardUIHelpers";
import { getDate } from "../../../../../../utils/common";

export function CreatedColumnFormatter(cellContent, row) {
  //   const getLabelCssClasses = () => {
  //     return `label label-lg label-light-${
  //       CustomerStatusCssClasses[row.createtedAt]
  //     } label-inline`
  //   }
  return <span>{cellContent}</span>;
}

export const DatetimeColumnFormatter = (cellContent, row) => {
  return (
    <span className={`badge badge-light-success  ${getDate(cellContent)}`}>
      {getDate(cellContent)}
    </span>
  );
};
