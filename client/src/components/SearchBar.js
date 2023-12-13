import React from "react";
import NumberInput from "./NumberInput";
import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import filterCabins from "../utils/filterCabins";
import { useCabinContext } from "../hooks/useCabinContext";
import { useReservationContext } from "../hooks/useReservationContext";
import { useReviewContext } from "../hooks/useReviewContext";
import searchCabins from "../utils/searchCabins";
import { useEffect } from "react";

export default function SearchBar({
  selectedFilters,
  searchWord,
  setSelectedFilters,
  setSearchWord,
}) {
  const initialStarCount = selectedFilters?.starCount;
  const [starCount, setStarCount] = useState(
    initialStarCount ? initialStarCount : 0
  );
  const [startDate, setStartDate] = useState(
    selectedFilters?.startDate ? selectedFilters.startDate : null
  );
  const [endDate, setEndDate] = useState(
    selectedFilters?.endDate ? selectedFilters.endDate : null
  );
  const [personCount, setPersonCount] = useState(
    selectedFilters?.personCount ? selectedFilters.personCount : 1
  );
  const [search, setSearch] = useState(searchWord ? searchWord : "");
  const [searchDraft, setSearchDraft] = useState("");

  const clearSearch = () => {
    setSearch("");
  };
  const navigate = useNavigate();
  const { cabins } = useCabinContext();
  const locations = [...new Set(cabins.map((cabin) => cabin.location))];
  const regions = [...new Set(cabins.map((cabin) => cabin.region))];
  const names = [...new Set(cabins.map((cabin) => cabin.name))];

  const { reservations } = useReservationContext();
  const { reviews } = useReviewContext();
  const [newSelectedFilters, setNewSelectedFilters] = useState([]);
  const [suggestedSearches, setSuggestedSearches] = useState([]);

  useEffect(() => {
    if (searchDraft.length > 0) {
      const allSearchOptions = [...locations, ...names, ...regions];

      const filteredSuggestions = allSearchOptions.filter((option) =>
        option.toLowerCase().includes(searchDraft.toLowerCase())
      );
      const limitedSuggestions = filteredSuggestions.slice(0, 2);

      setSuggestedSearches(limitedSuggestions);
    }
  }, [searchDraft]);

  useEffect(() => {
    {
      setSelectedFilters
        ? setSelectedFilters({
            startDate: startDate,
            endDate: endDate,
            starCount: starCount,
            personCount: personCount,
          })
        : setNewSelectedFilters({
            startDate: startDate,
            endDate: endDate,
            starCount: starCount,
            personCount: personCount,
          });
    }
  }, [startDate, endDate, starCount, personCount]);

  useEffect(() => {
    if (setSearchWord) {
      setSearchWord(search);
    }
  }, [search]);

  let filteredCabins;
  if (setSelectedFilters && selectedFilters) {
    filteredCabins = filterCabins(
      cabins,
      reservations,
      reviews,
      selectedFilters
    );
  } else if (newSelectedFilters) {
    filteredCabins = filterCabins(
      cabins,
      reservations,
      reviews,
      newSelectedFilters
    );
  } else {
    filteredCabins = cabins;
  }

  const searchResults = searchCabins(search, filteredCabins);

  return (
    <div className="z-30">
      <div className="flex items-center border border-tiara rounded-md w-full shadow-sm px-5 py-2">
        {search && (
          <div className="flex items-center bg-gray-200 rounded-md mr-2 px-3 py-1">
            <span>{search}</span>
            <button
              onClick={clearSearch}
              className="ml-2 text-red-500 focus:outline-none"
            >
              &times;
            </button>
          </div>
        )}
        <FaSearch className="text-gray-500" />
        <input
          className="flex-grow ml-2 border-none outline-none"
          type="text"
          id="search"
          name="search"
          autoComplete="off"
          required
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Lomakohde, sijainti tai mökin nimi"
          onBlur={() => {
            if (searchDraft) {
              setSearch(searchDraft);
              setSearchDraft("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchDraft) {
              setSearch(searchDraft);
              setSearchDraft("");
              setSuggestedSearches([]);
            }
          }}
        />
      </div>
      {suggestedSearches.length > 0 && (
        <div className="absolute bg-white border border-tiara rounded-md shadow-md w-1/2 left-24 top-2/5 z-20">
          {suggestedSearches.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setSearch(suggestion);
                setSearchDraft("");
                setSuggestedSearches([]);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4 ">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <NumberInput label="tähteä" count={starCount} setCount={setStarCount} />
      </div>
      <div className="md-w-full lg:w-1/2 mx-auto my-4">
        <NumberInput
          label="henkilöitä"
          count={personCount}
          setCount={setPersonCount}
        />
      </div>

      {setSelectedFilters ? (
        <div className=" w-full py-2 rounded-md text-blueZodiac underline font-bold">
          Mökkejä suodattimilla ({searchResults.length})
        </div>
      ) : (
        <button
          onClick={() =>
            navigate("/cabins", {
              state: {
                selectedFilters: newSelectedFilters,
                searchWord: search,
              },
            })
          }
          className="bg-blueZodiac w-full py-2 rounded-md text-white font-bold cursor-pointer"
        >
          Hae mökit ({searchResults.length})
        </button>
      )}
    </div>
  );
}
