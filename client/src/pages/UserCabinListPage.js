import React from "react";
import CabinList from "../components/CabinList";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCabinContext } from "../hooks/useCabinContext";
import axios from "axios";

export default function UserCabinListPage() {
  const { user } = useAuthContext();
  const { cabins, setCabins } = useCabinContext();

  const onDeleteClick = async (cabinId) => {
    try {
      await axios.delete(`http://localhost:8800/api/cabins/${cabinId}`);
      const newCabins = cabins.filter((cabin) => cabin.id !== cabinId);
      setCabins(newCabins);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen mt-16 bg-tiara">
      {user && <CabinList userId={user.id} onDeleteClick={onDeleteClick} />}
    </div>
  );
}
