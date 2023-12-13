export default function filterCabins(
  cabins,
  reservations,
  reviews,
  selectedFilters
) {
  const isDateRangeOverlap = (start1, end1, start2, end2) => {
    return start1 <= end2 && end1 >= start2;
  };

  return cabins.filter((cabin) => {
    const cabinReservations = reservations.filter(
      (reservation) => reservation.cabin_id === cabin.id
    );

    const calculateAverageRating = (cabinId) => {
      const cabinReviews = reviews.filter(
        (review) => review.cabin_id === cabinId
      );
      const totalRating = cabinReviews.reduce(
        (acc, review) => acc + parseFloat(review.rating),
        0
      );
      return totalRating / cabinReviews.length;
    };

    const roundRating = (rating) => {
      return Math.round(rating * 10) / 10;
    };

    const isStarCount =
      !selectedFilters.starCount ||
      roundRating(calculateAverageRating(cabin.id)) >=
        selectedFilters.starCount;

    const isCapacity =
      !selectedFilters.personCount ||
      cabin.capacity >= selectedFilters.personCount;

    const isDateRangeValid =
      !selectedFilters.startDate ||
      !selectedFilters.endDate ||
      cabinReservations.every(
        (reservation) =>
          !isDateRangeOverlap(
            new Date(selectedFilters.startDate),
            new Date(selectedFilters.endDate),
            new Date(reservation.start_date),
            new Date(reservation.end_date)
          )
      );

    return isStarCount && isDateRangeValid && isCapacity;
  });
}
