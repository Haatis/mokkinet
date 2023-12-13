import React from "react";
import { useCabinContext } from "../hooks/useCabinContext";
import { useReviewContext } from "../hooks/useReviewContext";
import { useFavoritesContext } from "../hooks/useFavoritesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CabinCard from "./CabinCard";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useState } from "react";

export default function FavoritesList() {
  const { user } = useAuthContext();
  const { cabins } = useCabinContext();
  const { reviews } = useReviewContext();
  const { favorites, handleFavorite } = useFavoritesContext();
  const favoriteCabins = cabins.filter((cabin) => favorites.includes(cabin.id));
  const [registered, setRegistered] = useState(true);
  if (!user) {
    return (
      <div className="bg-white w-2/3 mx-auto rounded-lg my-6 p-6 shadow-lg text-center">
        <p className="text-2xl">
          Sinun täytyy kirjautua sisään nähdäksesi suosikkisi.
        </p>
        {registered ? (
          <LoginForm setRegistered={setRegistered} />
        ) : (
          <RegisterForm setRegistered={setRegistered} />
        )}
      </div>
    );
  }
  return (
    <div className="mx-auto">
      {favoriteCabins.length === 0 && (
        <div className="text-2xl text-center mt-8">
          Et ole asettanut yhtään mökkiä suosikiksi
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4  mx-auto my-5">
        {favoriteCabins.map((cabin) => (
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
