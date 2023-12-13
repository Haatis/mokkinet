import React from "react";
import { useCabinContext } from "../hooks/useCabinContext";
import { useReviewContext } from "../hooks/useReviewContext";
import { useFavoritesContext } from "../hooks/useFavoritesContext";
import CabinCard from "./CabinCard";

export default function CabinRow({ rowType }) {
  const { cabins } = useCabinContext();
  const { reviews } = useReviewContext();
  const { favorites, handleFavorite } = useFavoritesContext();

  let cabinsToShow;

  if (rowType === "latest") {
    cabinsToShow = cabins.slice(0, 3);
  } else if (rowType === "topRated") {
    cabinsToShow = calculateTopRatedCabins(cabins, reviews, 3);
  }

  function calculateTopRatedCabins(cabins, reviews, count) {
    return cabins
      .map((cabin) => {
        const cabinReviews = reviews.filter(
          (review) => review.cabin_id === cabin.id
        );
        const totalRating = cabinReviews.reduce(
          (acc, review) => acc + parseFloat(review.rating),
          0
        );
        const averageRating =
          cabinReviews.length > 0 ? totalRating / cabinReviews.length : 0;
        return { ...cabin, averageRating };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, count);
  }

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto my-5">
        {cabinsToShow.length === 0 && <div>There are no cabins.</div>}
        {cabinsToShow.map((cabin) => (
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
