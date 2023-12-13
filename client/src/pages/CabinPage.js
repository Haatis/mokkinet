import React, { useState, useEffect } from "react";
import { useCabinContext } from "../hooks/useCabinContext.js";
import { useParams } from "react-router-dom";
import { useReviewContext } from "../hooks/useReviewContext.js";
import BackButton from "../components/BackButton.js";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { Link } from "react-router-dom";
import CommentForm from "../components/CommentForm.js";
import Calendar from "../components/Calendar.js";

export default function Cabin() {
  const { cabins } = useCabinContext();
  const { id } = useParams();
  const { reviews, setReviews } = useReviewContext();
  const { user } = useAuthContext();
  const [ownerName, setOwnerName] = useState("");
  const [reviewerUsernames, setReviewerUsernames] = useState({});
  const [openReviewForm, setOpenReviewForm] = useState(false);

  const cabinId = +id;

  const cabin = cabins.find((cabin) => cabin.id === cabinId);

  useEffect(() => {
    const fetchData = async () => {
      if (cabin) {
        try {
          const ownerResponse = await axios.get(
            `http://localhost:8800/api/users/${cabin.user_id}`
          );
          setOwnerName(ownerResponse.data.username);
        } catch (error) {
          console.error("Error fetching owner name: ", error);
        }

        const uniqueUserIds = Array.from(
          new Set(reviews.map((review) => review.user_id))
        );

        const usernamePromises = uniqueUserIds.map((userId) =>
          getUserNameById(userId)
        );

        try {
          const usernames = await Promise.all(usernamePromises);
          const usernameMap = {};
          uniqueUserIds.forEach((userId, index) => {
            usernameMap[userId] = usernames[index];
          });
          setReviewerUsernames(usernameMap);
        } catch (error) {
          console.error("Error fetching reviewer usernames: ", error);
        }
      }
    };

    fetchData();
  }, [cabin, reviews]);

  const getUserNameById = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/users/${userId}`
      );
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  };

  if (!cabin) {
    return (
      <div className="flex flex-col text-center min-h-screen bg-tiara">
        Ladataan...
      </div>
    );
  }

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

  const removeReview = (reviewId, userId) => {
    axios
      .delete(`http://localhost:8800/api/reviews/${reviewId}/${userId}`)
      .then((response) => {
        console.log(response);
        const newReviews = reviews.filter((review) => review.id !== reviewId);
        setReviews(newReviews);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="bg-tiara  py-8 min-h-scree mt-10">
        <BackButton />
        <div className="max-w-6xl bg-white rounded-lg p-8 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={`http://localhost:8800/uploads/${cabin.image}`}
                  alt="Product Image"
                />
              </div>
            </div>
            <div className="md:flex-1 px-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {cabin.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4"></p>
              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Hinta (vrk):{" "}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {cabin.price}€
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Omistaja:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 break-all">
                  {ownerName}
                </p>
              </div>
              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Arvio
                  </span>
                  {reviews.filter((review) => review.cabin_id === cabin.id)
                    .length > 0 ? (
                    <p>{roundRating(calculateAverageRating(cabin.id))} ★</p>
                  ) : (
                    <p>Ei arvioita</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Kuvaus:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 break-all">
                  {cabin.description}
                </p>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Henkilömäärä:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 break-all">
                  {cabin.capacity}
                </p>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Sijainti:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 break-all">
                  {cabin.location}, {cabin.region}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-5/6 md:w-5/6 lg:w-2/3">
          {user ? (
            <Calendar cabinId={cabin.id} userId={user.id} price={cabin.price} />
          ) : (
            <Calendar cabinId={cabin.id} />
          )}
          <div className="mx-auto w-5/6 md:w-5/& lg:w-2/3 justify-center text-center">
            <h2 className="text-2xl font-bold text-blueFountain">Arvostelut</h2>
            <ul>
              {reviews.filter((review) => review.cabin_id === cabinId).length >
              0 ? (
                reviews
                  .filter((review) => review.cabin_id === cabinId)
                  .map((review) => (
                    <li
                      className="bg-white my-6 p-4 w-1/2 mx-auto rounded-lg shadow-lg"
                      key={review.id}
                    >
                      <p>{roundRating(review.rating)} ★</p>
                      <p>{review.comment}</p>
                      <p>{reviewerUsernames[review.user_id]}</p>
                      {user && user.id === review.user_id && (
                        <button
                          className="text-white bg-blueZodiac border-2 p-4 rounded-lg hover:bg-blueFountain hover:text-white transition duration-300 ease-in-out"
                          onClick={() => {
                            removeReview(review.id, user.id);
                          }}
                        >
                          Poista arvostelu
                        </button>
                      )}
                    </li>
                  ))
              ) : (
                <li className="my-6 mx-auto text-center">
                  Mökillä ei ole vielä arvosteluja.
                </li>
              )}
            </ul>

            {user ? (
              openReviewForm ? (
                <CommentForm
                  userId={user.id}
                  cabinId={cabin.id}
                  setOpenReviewForm={setOpenReviewForm}
                />
              ) : (
                <button
                  onClick={() => setOpenReviewForm(true)}
                  className="text-white bg-blueZodiac border-2 p-4 rounded-lg hover:bg-blueFountain hover:text-white transition duration-300 ease-in-out"
                >
                  Lisää arvostelu
                </button>
              )
            ) : (
              <p className="text-center">
                <Link to="/login" className="text-blueFountain">
                  Kirjaudu sisään
                </Link>{" "}
                lisätäksesi arvostelu
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
