import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CabinCard = ({ cabin, reviews, onFavoriteClick, isFavorite, owner }) => {
  const navigate = useNavigate();
  const imageUrl = `http://localhost:8800/uploads/${cabin.image}`;
  const roundRating = (rating) => {
    const rounded = Math.round(rating * 2) / 2;
    return rounded.toFixed(1);
  };

  const calculateAverageRating = (cabinId) => {
    const cabinReviews = reviews.filter(
      (review) => review.cabin_id === cabinId
    );
    if (cabinReviews.length === 0) {
      return 0;
    }
    const totalRating = cabinReviews.reduce(
      (acc, review) => acc + parseFloat(review.rating),
      0
    );
    return totalRating / cabinReviews.length;
  };

  return (
    <div className="relative">
      <Link to={`/cabin/${cabin.id}`}>
        <div className="flex justify-center items-center">
          <div className="container flex justify-center">
            <div className="max-w-sm flex-grow">
              <div className="bg-white relative shadow-lg hover:shadow-xl transition duration-500 rounded-lg">
                <img
                  className="object-cover w-full sm:h-48 md:h-56 lg:h-64 rounded-lg shadow-lg p-1"
                  src={imageUrl}
                  alt="cabin"
                />
                <div className="py-6 px-8 rounded-lg bg-white">
                  <h1 className="text-blueFountain font-bold text-2xl mb-3 hover:text-gray-900 hover:cursor-pointer">
                    {cabin.name}
                  </h1>
                  <p className="text-regentGray tracking-wide truncate ">
                    {cabin.description}
                  </p>
                  {reviews.filter((review) => review.cabin_id === cabin.id)
                    .length > 0 ? (
                    <p className="text-blueFountain text-xl font-bold">
                      {roundRating(calculateAverageRating(cabin.id))} ★
                    </p>
                  ) : (
                    <p className="text-blueFountain">Ei arvosteluja</p>
                  )}
                  <div className="flex flex-row mt-4 items-center justify-between">
                    <button className=" py-2 px-4 bg-tiara font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300">
                      {cabin.price}€/vrk
                    </button>
                    <p className="text-regentGray">
                      {cabin.location}, {cabin.region}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {!owner && (
        <button
          onClick={() => onFavoriteClick(cabin.id)}
          className="absolute top-2 right-4 z-10 bg-white rounded-full p-2 shadow-lg text-2xl"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}
      {owner && (
        <div className="flex absolute top-2 right-4 z-10">
          <button
            onClick={() =>
              navigate(`/editcabin/${cabin.id}`, {
                state: {
                  edit: true,
                },
              })
            }
            className="bg-white rounded-full p-2 shadow-lg text-2xl mr-2"
          >
            {"✏️"}
          </button>
          <button
            onClick={() => onFavoriteClick(cabin.id)}
            className="bg-white rounded-full p-2 shadow-lg text-2xl "
          >
            {"🗑️"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CabinCard;
