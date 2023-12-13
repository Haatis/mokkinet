import React from "react";
import { useCabinContext } from "../hooks/useCabinContext";
import { useReviewContext } from "../hooks/useReviewContext";
import { useFavoritesContext } from "../hooks/useFavoritesContext";
import CabinCard from "./CabinCard";
import filterCabins from "../utils/filterCabins";
import { useReservationContext } from "../hooks/useReservationContext";
import searchCabins from "../utils/searchCabins";

export default function CabinList({
  selectedFilters,
  searchWord,
  userId,
  onDeleteClick,
}) {
  const { cabins } = useCabinContext();

  const { reviews } = useReviewContext();
  const { favorites, handleFavorite } = useFavoritesContext();
  const { reservations } = useReservationContext();
  const filteredCabins = filterCabins(
    cabins,
    reservations,
    reviews,
    selectedFilters ? selectedFilters : []
  );
  const searchResults = searchCabins(searchWord, filteredCabins);

  if (userId) {
    const filteredCabins = cabins.filter((cabin) => cabin.user_id === userId);

    return (
      <div className="mx-auto">
        {filteredCabins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4  mx-auto my-5">
            {filteredCabins.map((cabin) => (
              <CabinCard
                key={cabin.id}
                cabin={cabin}
                reviews={reviews}
                onFavoriteClick={userId ? onDeleteClick : handleFavorite}
                isFavorite={favorites.includes(cabin.id)}
                owner={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-2xl text-center mt-8">
            Et ole lisännyt yhtään mökkiä
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4  mx-auto my-5">
        {searchResults.length === 0 && <div>Mökkejä ei löydetty.</div>}

        {searchResults.map((cabin) => (
          <CabinCard
            key={cabin.id}
            cabin={cabin}
            reviews={reviews}
            onFavoriteClick={handleFavorite}
            isFavorite={favorites.includes(cabin.id)}
          />
        ))}
      </div>
    </div>
  );
}
