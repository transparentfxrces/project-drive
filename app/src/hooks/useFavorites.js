import { useState, useEffect } from "react";

export default function useFavorites() {
  const [favoriteExercises, setFavoriteExercises] =
    useState(() => {
      const saved = localStorage.getItem(
        "favoriteExercises"
      );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "favoriteExercises",
      JSON.stringify(favoriteExercises)
    );
  }, [favoriteExercises]);

  return {
    favoriteExercises,
    setFavoriteExercises,
  };
}