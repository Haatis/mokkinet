import React, { useState } from "react";
import axios from "axios";
import { useReviewContext } from "../hooks/useReviewContext";
import { AiFillCloseCircle } from "react-icons/ai";

export default function CommentForm({ userId, cabinId, setOpenReviewForm }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { setReviews } = useReviewContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.length === 0) {
      alert("Arvostelu ei voi olla tyhjä");
      return;
    }
    axios
      .post("http://localhost:8800/api/reviews", {
        cabinId,
        userId,
        rating,
        comment,
      })
      .then((response) => {
        if (response.status === 200) {
          const newReviewId = response.data.id;
          setReviews((prevReviews) => [
            ...prevReviews,
            {
              id: newReviewId,
              cabin_id: cabinId,
              user_id: userId,
              rating,
              comment,
            },
          ]);
          setRating(0);
          setComment("");
        } else {
          alert("Arvostelun lähetys epäonnistui");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Arvostelun lähetys epäonnistui");
      });
  };

  return (
    <>
      <form
        className="w-1/2 mx-auto bg-white p-4 rounded-lg shadow-lg relative"
        onSubmit={handleSubmit}
      >
        <div className="absolute top-0 right-0 mt-2 mr-2">
          {" "}
          <button onClick={() => setOpenReviewForm(false)}>
            <AiFillCloseCircle className="text-2xl" />
          </button>
        </div>
        <div>
          <label>Arvostelu:</label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <label>Arvosana (0-10):</label>
          <input
            className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mx-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blueZodiac border-2 p-4 rounded-lg hover:bg-blueFountain hover:text-white transition duration-300 ease-in-out"
        >
          Lähetä arvostelu
        </button>
      </form>
    </>
  );
}
