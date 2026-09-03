import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function useFavorites() {
  const [userId, setUserId] =
    useState(null);

  const [favoriteExercises, setFavoriteExercises] =
    useState([]);

  /*
   * Track the currently authenticated athlete.
   */
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUserId(
        user?.id ?? null
      );
    }

    loadUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUserId(
            session?.user?.id ?? null
          );
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Load favorites whenever the
   * authenticated athlete changes.
   */
  useEffect(() => {
    if (!userId) {
      setFavoriteExercises([]);
      return;
    }

    const storageKey =
      `favoriteExercises_${userId}`;

    try {
      const saved =
        localStorage.getItem(
          storageKey
        );

      if (!saved) {
        setFavoriteExercises([]);
        return;
      }

      const parsed =
        JSON.parse(saved);

      setFavoriteExercises(
        Array.isArray(parsed)
          ? parsed
          : []
      );
    } catch (error) {
      console.error(
        `Unable to read ${storageKey}:`,
        error
      );

      setFavoriteExercises([]);
    }
  }, [userId]);

  /*
   * Persist favorites for this athlete only.
   */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `favoriteExercises_${userId}`,
      JSON.stringify(
        favoriteExercises
      )
    );
  }, [
    favoriteExercises,
    userId,
  ]);

  return {
    favoriteExercises,
    setFavoriteExercises,
  };
}