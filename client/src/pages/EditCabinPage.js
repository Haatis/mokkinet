import React from "react";
import CabinForm from "../components/CabinForm";

export default function EditCabinPage() {
  return (
    <div className="flex flex-col min-h-screen bg-tiara mt-16">
      <CabinForm edit={true} />
    </div>
  );
}
