import { useState } from "react";
import { WeekDisplay } from "./WeekDisplay";
import { Tooltip } from "./components/Tooltip";
import { FaChevronDown } from "react-icons/fa";
import { mapDatesToWeek, parseDateString } from "./utils/dates";
import moment from "moment";

export const Planner = ({
  weeks,
  updateWeeks,
  templates,
  updateTemplates,
}: any) => {
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [displayedWeeks, setDisplayedWeeks] = useState(weeks.slice(0, 1));

  const updateWeekAtIndex = (index: any, week: any) => {
    var modifiedWeeks = weeks;
    modifiedWeeks[index] = week;
    updateWeeks(modifiedWeeks);
  };

  const addWeek = () => {
    // Add all the user's weeks and after that add templates
    if (displayedWeeks.length < weeks.length)
      setDisplayedWeeks(weeks.slice(0, displayedWeeks.length + 1));
    else {
      // Need to include dates as well
      var last = parseDateString(
        displayedWeeks[displayedWeeks.length - 1].Monday.date
      );

      var next = moment(last).add(1, "week");

      var newTemplate = structuredClone(templates[0]);
      var untouchedWeek = mapDatesToWeek(newTemplate, next.toDate());

      setDisplayedWeeks(displayedWeeks.concat(untouchedWeek));
    }
  };

  return (
    <div className="w-full mt-2 flex flex-col gap-2">
      <div className="flex flex-row w-full gap-2">
        <MenuButton
          selected={!updatingTemplate}
          onPress={() => setUpdatingTemplate(false)}
        >
          <p className="my-auto">My Week</p>
        </MenuButton>
        <MenuButton
          selected={updatingTemplate}
          onPress={() => setUpdatingTemplate(true)}
        >
          <div className="flex flex-row my-auto">
            <p>Routine</p>
            <Tooltip id="template-info" className="my-auto ml-2" color="white">
              Items in your routine are automatically included in each week.
            </Tooltip>
          </div>
        </MenuButton>
      </div>
      <hr className="mt-2" />
      {updatingTemplate ? (
        <WeekDisplay
          week={templates[0]}
          updateWeek={(template: any) => updateTemplates([template])}
        />
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          {displayedWeeks.map((x: any, i: any) => (
            <WeekDisplay
              week={x}
              updateWeek={(week: any) => updateWeekAtIndex(i, week)}
              hasDates
            />
          ))}
        </div>
      )}

      {!updatingTemplate && (
        <button
          className="mt-2 font-semibold p-2 border-2 hover:border-black w-fit mx-auto rounded-lg flex flex-row justify-center gap-2 items-center"
          onClick={() => addWeek()}
        >
          <FaChevronDown className="my-auto" />
          <p>Load another week</p> <FaChevronDown className="my-auto" />
        </button>
      )}
    </div>
  );
};

const MenuButton = ({ children, onPress, selected = false }: any) => {
  return (
    <button
      className={`p-2 bg-green-700 w-1/2 text-white rounded-xl justify-center flex flex-row ${
        selected && "border-black border-2"
      }`}
      onClick={() => onPress()}
    >
      {children}
    </button>
  );
};
