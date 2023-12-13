import React from "react";
import { useCabinContext } from "../hooks/useCabinContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useState } from "react";
import { useReservationContext } from "../hooks/useReservationContext";

export default function ReservationsList() {
  const cabins = useCabinContext();
  const { user } = useAuthContext();
  const [registered, setRegistered] = useState(true);
  if (!user) {
    return (
      <div className="bg-white w-2/3 mx-auto rounded-lg my-6 p-6 shadow-lg text-center">
        <p className="text-2xl">
          Sinun täytyy kirjautua sisään nähdäksesi varauksesi.
        </p>
        {registered ? (
          <LoginForm setRegistered={setRegistered} />
        ) : (
          <RegisterForm setRegistered={setRegistered} />
        )}
      </div>
    );
  }

  const getCabinInfo = (cabinId) => {
    const cabin = cabins.cabins.find((cabin) => cabin.id === cabinId);

    return cabin;
  };

  const { reservations, setReservations } = useReservationContext();

  const userReservations = reservations.filter(
    (reservation) => reservation.user_id === user.id
  );

  const cancelReservation = (reservationId) => {
    axios
      .delete(
        `http://localhost:8800/api/reservations/${reservationId}/${user.id}`
      )
      .then((response) => {
        console.log("Reservation deleted successfully");
        setReservations(
          reservations.filter((reservation) => reservation.id !== reservationId)
        );
      })
      .catch((error) => {
        console.error("Failed to delete reservation", error);
      });
  };

  return (
    <div className="mx-auto">
      {userReservations.length === 0 && (
        <div className="text-2xl text-center mt-8">
          Sinulla ei ole yhtään varausta.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4  mx-auto my-5">
        {userReservations.map((reservation) => {
          const cabinInfo = getCabinInfo(reservation.cabin_id);
          const imageUrl = `http://localhost:8800/uploads/${cabinInfo.image}`;
          const isStartDateInFuture =
            new Date(reservation.start_date) > new Date();
          if (cabinInfo) {
            return (
              <div
                key={reservation.id}
                className="flex justify-center items-center"
              >
                <div className="container flex justify-center">
                  <div className="max-w-sm flex-grow">
                    <div className="bg-white relative shadow-lg hover:shadow-xl transition duration-500 rounded-lg">
                      <img
                        className="object-cover w-full sm:h-48 md:h-56 rounded-lg shadow-lg p-1"
                        src={imageUrl}
                        alt="cabin"
                      />
                      <div className="py-6 px-8 rounded-lg bg-white">
                        <h1 className="text-blueFountain font-bold text-2xl mb-3 hover:text-gray-900 hover:cursor-pointer">
                          {cabinInfo.name}
                        </h1>
                        <p className="text-regentGray tracking-wide truncate ">
                          Saapumispäivä:{" "}
                          {new Date(
                            reservation.start_date
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-regentGray tracking-wide truncate ">
                          Lähtöpäivä:{" "}
                          {new Date(reservation.end_date).toLocaleDateString()}
                        </p>
                        {isStartDateInFuture ? (
                          <button
                            onClick={() => cancelReservation(reservation.id)}
                            className="text-regentGray rounded-full py-2 px-4 mt-2 hover:bg-red"
                          >
                            Peruuta varaus
                          </button>
                        ) : (
                          <Link
                            to={`http://localhost:3000/cabin/${cabinInfo.id}`}
                          >
                            <button className="text-regentGray rounded-full py-2 px-4 mt-2 hover:bg-blueFountain z-10">
                              Varaa uudestaan
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
