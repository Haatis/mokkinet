import React from "react";
import CabinList from "../components/CabinList";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useState } from "react";

export default function CabinListPage() {
  const state = useLocation();
  const [searchWord, setSearchWord] = useState(state.state?.searchWord);
  const [selectedFilters, setSelectedFilters] = useState(
    state.state?.selectedFilters
  );

  return (
    <div className="flex flex-col min-h-screen mt-16 bg-tiara">
      <div className="bg-cover mt-6 min-h-[300px] lg:min-h-[250px] relative ">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 p-4 -translate-y-1/2 text-center bg-white lg:w-4/6 xl:w-3/6 md:w-2/3 w-3/4 rounded-lg z-20">
          <SearchBar
            selectedFilters={selectedFilters}
            searchWord={searchWord}
            setSelectedFilters={setSelectedFilters}
            setSearchWord={setSearchWord}
          />
        </div>
      </div>
      <CabinList selectedFilters={selectedFilters} searchWord={searchWord} />
    </div>
  );
}
