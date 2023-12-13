import React from "react";
import { useCabinContext } from "../hooks/useCabinContext";
import { useNavigate } from "react-router-dom";
import searchCabins from "../utils/searchCabins";

export default function LocationsPage() {
  const { cabins } = useCabinContext();
  const locations = [...new Set(cabins.map((cabin) => cabin.location))];
  const regions = [...new Set(cabins.map((cabin) => cabin.region))];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen mt-16 bg-tiara">
      <div className="grid grid-cols-2 gap-4 mt-8 bg-white w-4/5 md:w-1/2 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col mx-auto">
          <p className="mx-auto text-xl font-bold">Kaupungit:</p>
          {locations.map((location) => (
            <div
              key={location}
              className="mt-2 mx-auto cursor-pointer text-blueFountain"
            >
              <button
                onClick={() =>
                  navigate("/cabins", {
                    state: { searchWord: location },
                  })
                }
              >
                {location} ({searchCabins(location, cabins).length})
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col mx-auto">
          <p className="mx-auto text-xl font-bold">Maakunnat:</p>
          {regions.map((region) => (
            <div
              className="mt-2 mx-auto cursor-pointer text-blueFountain"
              key={region}
            >
              <button
                onClick={() =>
                  navigate("/cabins", {
                    state: { searchWord: region },
                  })
                }
              >
                {region} ({searchCabins(region, cabins).length})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
