import React from "react";
import ReservationsList from "../components/ReservationsList";

export default function ReservationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-tiara mt-16">
      <ReservationsList />
    </div>
  );
}
