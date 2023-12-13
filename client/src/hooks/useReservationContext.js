import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ReservationContext = createContext();

export const useReservationContext = () => {
  return useContext(ReservationContext);
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/reservations"
        );
        setReservations(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllReservations();
  }, []);

  return (
    <ReservationContext.Provider value={{ reservations, setReservations }}>
      {children}
    </ReservationContext.Provider>
  );
};
