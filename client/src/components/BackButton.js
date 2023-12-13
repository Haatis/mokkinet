import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      onClick={goBack}
      className="bg-blueFountain text-white text-xl font-bold p-4  cursor-pointer flex items-center"
    >
      <FaArrowLeft className="mr-2" />
      <p>Palaa takaisin</p>
    </div>
  );
}
