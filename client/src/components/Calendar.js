import React, { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  addDays,
  format,
  eachWeekOfInterval,
  isBefore,
  isSameDay,
  isAfter,
  eachDayOfInterval,
} from "date-fns";
import axios from "axios";
import { useReservationContext } from "../hooks/useReservationContext";
import fiLocale from "date-fns/locale/fi";
import { Link } from "react-router-dom";

export default function Calendar({ cabinId, userId, price }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);
  const weeksInMonth = eachWeekOfInterval({
    start: startOfMonthDate,
    end: endOfMonthDate,
  });

  const handleDateClick = (clickedDate) => {
    if (!userId) {
      alert("Kirjaudu sisään varataksesi.");
      return;
    }
    const isReserved = cabinReservations.some((reservation) => {
      const reservationStartDate = new Date(reservation.start_date);
      const reservationEndDate = new Date(reservation.end_date);
      return (
        isSameDay(clickedDate, reservationStartDate) ||
        (isAfter(clickedDate, reservationStartDate) &&
          isBefore(clickedDate, reservationEndDate))
      );
    });
    if (isBefore(clickedDate, today) && !isSameDay(clickedDate, today)) {
      return;
    }
    if (isReserved) {
      return;
    }

    if (startDate && !endDate && isSameDay(clickedDate, startDate)) {
      setStartDate(null);
      return;
    }
    if (startDate && endDate) {
      setStartDate(clickedDate);
      setEndDate(null);
      return;
    }
    if (startDate) {
      if (isBefore(clickedDate, startDate)) {
        setStartDate(clickedDate);
        setEndDate(null);
        return;
      }
      const daysBetween = eachDayOfInterval({
        start: startDate,
        end: clickedDate,
      });

      const isDaysBetweenReserved = daysBetween.some((day) => {
        return cabinReservations.some((reservation) => {
          const reservationStartDate = new Date(reservation.start_date);
          const reservationEndDate = new Date(reservation.end_date);
          return (
            isAfter(day, reservationStartDate) &&
            isBefore(day, reservationEndDate)
          );
        });
      });

      if (isDaysBetweenReserved) {
        alert(
          "You cannot select a reserved date between your start and end date."
        );
        return;
      }
    }

    if (!startDate || isBefore(clickedDate, startDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      setEndDate(clickedDate);
    }
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousMonth = () => {
    if (isBefore(currentDate, today)) {
      return;
    }
    setCurrentDate(subMonths(currentDate, 1));
  };

  const [cabinReservations, setCabinReservations] = useState([]);
  const { setReservations, reservations } = useReservationContext();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/reservations/${cabinId}`
        );
        const formattedReservations = response.data.map((reservation) => ({
          ...reservation,
          start_date: format(new Date(reservation.start_date), "yyyy-MM-dd"),
          end_date: format(new Date(reservation.end_date), "yyyy-MM-dd"),
        }));
        setCabinReservations(formattedReservations);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReservations();
  }, [cabinId, reservations]);

  const reserveCabin = async () => {
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    const requestData = {
      cabinId: cabinId,
      userId: userId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:8800/api/reservations",
        requestData
      );

      if (response.status === 200) {
        console.log("Reservation submitted successfully");
        alert("Varaus onnistui.");
        setStartDate(null);
        setEndDate(null);
        setReservations([...reservations, response.data]);
      } else {
        console.error("Failed to submit the reservation");
        alert("Varaus epäonnistui.");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Varaus epäonnistui.");
    }
  };

  const calculatePrice = (startDate, endDate) => {
    const daysBetween = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
    const totalPrice = daysBetween.length * price;
    return totalPrice;
  };

  return (
    <div className="my-6 mx-auto max-w-3xl rounded-lg p-4 bg-white shadow-lg w-full md:w-full  lg:w-full text-center">
      <div className="flex justify-between my-4">
        <button
          onClick={goToPreviousMonth}
          className=" text-white bg-blueZodiac p-4 rounded-xl transition duration-300 ease-in-out"
        >
          Edellinen
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          {format(currentDate, "MMMM yyyy", { locale: fiLocale })}
        </h2>
        <button
          onClick={goToNextMonth}
          className=" text-white bg-blueZodiac p-4 rounded-xl transition duration-300 ease-in-out"
        >
          Seuraava
        </button>
      </div>

      <table className="w-full border border-tiara rounded-lg shadow-lg bg-white">
        <thead>
          <tr className="bg-blueZodiac text-white text-center">
            <th>Su</th>
            <th>Ma</th>
            <th>Ti</th>
            <th>Ke</th>
            <th>To</th>
            <th>Pe</th>
            <th>La</th>
          </tr>
        </thead>
        <tbody>
          {weeksInMonth.map((weekStart) => (
            <tr key={weekStart.toString()}>
              {Array.from({ length: 7 }, (_, index) => {
                const currentDate = addDays(weekStart, index);
                const isDayInPast =
                  isBefore(currentDate, today) &&
                  !isSameDay(currentDate, today);
                const isDaySelected =
                  isSameDay(currentDate, startDate) ||
                  isSameDay(currentDate, endDate);
                const isInRange =
                  startDate && endDate
                    ? isBefore(startDate, currentDate) &&
                      isBefore(currentDate, endDate)
                    : false;
                const isReserved = cabinReservations.some((reservation) => {
                  const reservationStartDate = new Date(reservation.start_date);
                  const reservationEndDate = new Date(reservation.end_date);
                  return (
                    isSameDay(currentDate, reservationStartDate) ||
                    (isAfter(currentDate, reservationStartDate) &&
                      isBefore(currentDate, reservationEndDate))
                  );
                });

                return (
                  <td
                    key={currentDate.toString()}
                    className={`p-2 ${
                      isDayInPast
                        ? "text-regentGray cursor-default bg-regentGray bg-opacity-40"
                        : isDaySelected
                        ? "bg-blueFountain"
                        : isInRange
                        ? "bg-blueFountain"
                        : isReserved
                        ? "bg-red cursor-default"
                        : "bg-blueFountain bg-opacity-20 cursor-pointer"
                    }`}
                    onClick={() => handleDateClick(currentDate)}
                  >
                    {format(currentDate, "d")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {userId ? (
        <p className="mt-4 ">
          Valitse kalenterista saapumispäivä ja lähtöpäivä.
        </p>
      ) : (
        <Link to="/login">
          <button className="mt-4 text-white bg-blueZodiac border-2 p-4 rounded-lg hover:bg-blueFountain hover:text-white transition duration-300 ease-in-out">
            Kirjaudu sisään varataksesi
          </button>
        </Link>
      )}

      {startDate ? (
        <p className="mt-2">
          Valitut päivämäärät: {startDate && format(startDate, "dd.MM.yyyy")} -{" "}
          {endDate && format(endDate, "dd.MM.yyyy")}
        </p>
      ) : (
        <p className="mt-8"></p>
      )}
      {startDate && endDate ? (
        <p className="">Hinta : {calculatePrice(startDate, endDate)}€</p>
      ) : (
        <p className="mt-4"></p>
      )}
      {startDate && endDate ? (
        userId ? (
          <button
            onClick={() => reserveCabin()}
            type="submit"
            className="mt-4 text-white bg-blueZodiac border-2 p-4 rounded-lg hover:bg-blueFountain hover:text-white transition duration-300 ease-in-out"
          >
            Varaa mökki
          </button>
        ) : (
          <div className="p-8" />
        )
      ) : (
        <div className="p-8" />
      )}
    </div>
  );
}
