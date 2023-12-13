import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ReviewContext = createContext();

export const useReviewContext = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/reviews");
        setReviews(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, setReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
