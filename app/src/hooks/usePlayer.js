import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function usePlayer() {
  const blankPlayer = {
    name: "",
    grade: "",
    graduationYear: "",
    school: "",
    team: "",
    position: "",
    jersey: "",
    height: "",
    weight: "",
    dominantHand: "",
    gpa: "",
    seasonGoals: [],
  };

  const [player, setPlayer] = useState(blankPlayer);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading profile:", error);
          setLoading(false);
          return;
        }

        // No profile yet = brand-new athlete.
        if (!data) {
          setPlayer(blankPlayer);
          setProfileCompleted(false);
          setLoading(false);
          return;
        }

        setPlayer({
          name: data.name ?? "",
          grade: data.grade ?? "",
          graduationYear: data.graduation_year ?? "",
          school: data.school ?? "",
          team: data.team ?? "",
          position: data.position ?? "",
          jersey: data.jersey ?? "",
          height: data.height ?? "",
          weight: data.weight ?? "",
          dominantHand: data.dominant_hand ?? "",
          gpa: data.gpa ?? "",
          seasonGoals: data.season_goals ?? [],
        });

        setProfileCompleted(data.profile_completed ?? false);
      } catch (error) {
        console.error("Error loading athlete profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function updatePlayer(updatedPlayer) {
    setPlayer(updatedPlayer);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated athlete found.");
    }

    const profileData = {
      id: user.id,

      name: updatedPlayer.name ?? "",
      grade: updatedPlayer.grade ?? "",
      graduation_year: updatedPlayer.graduationYear ?? "",

      school: updatedPlayer.school ?? "",
      team: updatedPlayer.team ?? "",
      position: updatedPlayer.position ?? "",
      jersey: updatedPlayer.jersey ?? "",

      height: updatedPlayer.height ?? "",
      weight: updatedPlayer.weight ?? "",

      dominant_hand: updatedPlayer.dominantHand ?? "",

      gpa: updatedPlayer.gpa ?? "",

      season_goals: updatedPlayer.seasonGoals ?? [],

      profile_completed: true,

      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "id",
      });

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    setProfileCompleted(true);
  }

  async function updateSeasonGoal(index, value) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const updatedGoals = player.seasonGoals.map((goal, i) =>
      i === index ? value : goal
    );

    const { error } = await supabase
      .from("profiles")
      .update({
        season_goals: updatedGoals,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating season goals:", error);
      return;
    }

    setPlayer((prev) => ({
      ...prev,
      seasonGoals: updatedGoals,
    }));
  }

  return {
    player,
    updatePlayer,
    updateSeasonGoal,
    profileCompleted,
    loading,
  };
}