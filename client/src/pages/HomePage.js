import React from "react";
import bgImage from "../assets/bgImage2.jpg";
import CabinRow from "../components/CabinRow";
import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen mt-16 bg-tiara">
      <div
        className="bg-cover min-h-[450px] relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "70% 90%",
        }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 p-4 -translate-y-1/2 text-center bg-white lg:w-4/6 xl:w-3/6 md:w-2/3 w-3/4 rounded-lg">
          <p className="text-3xl font-bold text-center my-4">
            Vuokraa mökkejä useilta paikkakunnilta!
          </p>
          <SearchBar />
        </div>
      </div>
      <div className="flex flex-col  mt-8 ">
        <p className="text-3xl font-bold text-center mb-2">Uusimmat mökit</p>
        <CabinRow rowType={"latest"} />
        <p className="text-3xl font-bold text-center mb-2">
          Parhaiten arvostellut mökit
        </p>
        <CabinRow rowType={"topRated"} />
      </div>
    </div>
  );
}
