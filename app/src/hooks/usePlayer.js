import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const blankPlayer = {
  name: "",
  grade: "",
  graduationYear: "",
  school: "",
  team: "",
  position: "",
  positionGroup: "",
  jersey: "",
  height: "",
  weight: "",
  dominantHand: "",
  gpa: "",
  seasonGoals: [],
  positionGoals: [],
};

export default function usePlayer() {
  const [userId, setUserId] = useState(null);
  const [player, setPlayer] = useState(blankPlayer);
  const [profileCompleted, setProfileCompleted] =
    useState(false);
  const [loading, setLoading] = useState(true);

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

      setUserId(user?.id ?? null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
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
   * Load the profile whenever the authenticated
   * athlete changes.
   */
  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!userId) {
        setPlayer(blankPlayer);
        setProfileCompleted(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const {
          data,
          error,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error(
            "Error loading profile:",
            error
          );

          setPlayer(blankPlayer);
          setProfileCompleted(false);
          return;
        }

        /*
         * No profile yet means this is a new athlete.
         */
        if (!data) {
          setPlayer(blankPlayer);
          setProfileCompleted(false);
          return;
        }

        setPlayer({
          name: data.name ?? "",
          grade: data.grade ?? "",
          graduationYear:
            data.graduation_year ?? "",
          school: data.school ?? "",
          team: data.team ?? "",
          position: data.position ?? "",
          positionGroup:
            data.position_group ?? "",
          jersey: data.jersey ?? "",
          height: data.height ?? "",
          weight: data.weight ?? "",
          dominantHand:
            data.dominant_hand ?? "",
          gpa: data.gpa ?? "",
          seasonGoals:
            Array.isArray(data.season_goals)
              ? data.season_goals
              : [],
          positionGoals:
            Array.isArray(data.position_goals)
              ? data.position_goals
              : [],
        });

        setProfileCompleted(
          data.profile_completed ?? false
        );
      } catch (error) {
        console.error(
          "Error loading athlete profile:",
          error
        );

        if (!mounted) return;

        setPlayer(blankPlayer);
        setProfileCompleted(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  async function updatePlayer(updatedPlayer) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "No authenticated athlete found."
      );
    }

    /*
     * Only update the currently authenticated
     * athlete's profile.
     */
    const profileData = {
      id: user.id,

      name: updatedPlayer.name ?? "",
      grade: updatedPlayer.grade ?? "",

      graduation_year:
        updatedPlayer.graduationYear ?? "",

      school: updatedPlayer.school ?? "",
      team: updatedPlayer.team ?? "",

      position:
        updatedPlayer.position ?? "",

      position_group:
        updatedPlayer.positionGroup ?? "",

      jersey:
        updatedPlayer.jersey ?? "",

      height:
        updatedPlayer.height ?? "",

      weight:
        updatedPlayer.weight ?? "",

      dominant_hand:
        updatedPlayer.dominantHand ?? "",

      gpa:
        updatedPlayer.gpa ?? "",

      season_goals:
        Array.isArray(
          updatedPlayer.seasonGoals
        )
          ? updatedPlayer.seasonGoals
          : [],

      position_goals:
        Array.isArray(
          updatedPlayer.positionGoals
        )
          ? updatedPlayer.positionGoals
          : [],

      profile_completed: true,

      updated_at:
        new Date().toISOString(),
    };

    const {
      error,
    } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "id",
      });

    if (error) {
      console.error(
        "Error updating profile:",
        error
      );

      throw error;
    }

    setPlayer({
      ...blankPlayer,
      ...updatedPlayer,
      seasonGoals:
        Array.isArray(
          updatedPlayer.seasonGoals
        )
          ? updatedPlayer.seasonGoals
          : [],
      positionGoals:
        Array.isArray(
          updatedPlayer.positionGoals
        )
          ? updatedPlayer.positionGoals
          : [],
    });

    setProfileCompleted(true);
  }

  async function updateSeasonGoal(
    index,
    value
  ) {
    if (!userId) return;

    const updatedGoals =
      player.seasonGoals.map(
        (goal, i) =>
          i === index
            ? value
            : goal
      );

    const {
      error,
    } = await supabase
      .from("profiles")
      .update({
        season_goals:
          updatedGoals,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error(
        "Error updating season goals:",
        error
      );

      return;
    }

    setPlayer(
      (previous) => ({
        ...previous,
        seasonGoals:
          updatedGoals,
      })
    );
  }

  return {
    player,
    updatePlayer,
    updateSeasonGoal,
    profileCompleted,
    loading,
  };
}