import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaTimes } from "react-icons/fa";

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const filterPassedDates = (date) => {
    const currentDate = new Date();
    return date >= currentDate.setHours(0, 0, 0, 0);
  };

  const clearStartDate = () => {
    setStartDate(null);
  };

  const clearEndDate = () => {
    setEndDate(null);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="border border-tiara py-2 rounded-md w-3/6 flex items-center">
        <FaCalendar className="text-gray-500 mx-2" />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate}
          placeholderText="Saapumispäivä"
          dateFormat="dd/MM/yyyy"
          filterDate={filterPassedDates}
          className="w-full"
        />
        {startDate && (
          <button onClick={clearStartDate} className="clear-button">
            <FaTimes />
          </button>
        )}
      </div>
      <div className="border border-tiara py-2 rounded-md w-3/6 flex items-center">
        <FaCalendar className="text-gray-500 mx-2" />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Lähtöpäivä"
          dateFormat="dd/MM/yyyy"
          filterDate={filterPassedDates}
          className="w-full"
        />
        {endDate && (
          <button onClick={clearEndDate} className="clear-button">
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
