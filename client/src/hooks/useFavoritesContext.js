import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const FavoritesContext = createContext();

export const useFavoritesContext = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8800/api/favorites/${user.id}`)
        .then((response) => {
          setFavorites(response.data.cabinIds);
        })
        .catch((error) => {
          console.error("Error fetching user favorites:", error);
        });
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = (cabinId) => {
    const url = `http://localhost:8800/api/favorites/add`;
    const data = {
      user_id: user.id,
      cabin_id: cabinId,
    };

    axios
      .post(url, data)
      .then((response) => {
        if (response.status === 200) {
          setFavorites([...favorites, cabinId]);
        }
      })
      .catch((error) => {
        console.error("Error adding cabin to favorites:", error);
      });
  };

  const removeFavorite = (cabinId) => {
    const url = `http://localhost:8800/api/favorites/remove`;
    const data = {
      user_id: user.id,
      cabin_id: cabinId,
    };

    axios
      .post(url, data)
      .then((response) => {
        if (response.status === 200) {
          setFavorites(favorites.filter((id) => id !== cabinId));
        }
      })
      .catch((error) => {
        console.error("Error removing cabin from favorites:", error);
      });
  };

  const handleFavorite = (cabinId) => {
    if (!user) {
      alert("Kirjaudu sisään lisätäksesi suosikkeja");
      return;
    }
    if (favorites.includes(cabinId)) {
      removeFavorite(cabinId);
    } else {
      addFavorite(cabinId);
    }
  };

  const value = {
    favorites,
    setFavorites,
    handleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
